<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, PATCH");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$dsn = 'mysql:host=localhost;dbname=your_database;charset=utf8';
$username = 'your_user';
$password = 'your_password';

try {
    $pdo = new PDO($dsn, $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['error' => 'Connection failed: ' . $e->getMessage()]);
    exit();
}

function formatDateToDDMMYYYY($dateStr) {
    return date('d/m/Y', strtotime($dateStr));
}

function getRequestBody() {
    return json_decode(file_get_contents('php://input'), true);
}

function handlePostRequest() {
    global $pdo;

    $data = getRequestBody();
    $title = $data['title'];
    $date = $data['date'];
    $priority = $data['priority'];
    $url = $data['url'] ?? null;
    $notes = $data['notes'] ?? null;
    $todoList = $data['todoList'] ?? null;
    $status = $data['status'] ?? null;

    $sql = "INSERT INTO events (title, date, priority, url, notes, todoList, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$title, $date, $priority, $url, $notes, $todoList, $status]);
        echo json_encode(['message' => 'Event created successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Error creating event', 'error' => $e->getMessage()]);
    }
}

function handlePutRequest($event_id) {
    global $pdo;

    $data = getRequestBody();
    $title = $data['title'];
    $date = $data['date'];
    $priority = $data['priority'];
    $url = $data['url'] ?? null;
    $notes = $data['notes'] ?? null;
    $todoList = $data['todoList'] ?? null;

    $sql = "UPDATE events SET title = ?, date = ?, priority = ?, url = ?, notes = ?, todoList = ? WHERE id = ?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$title, $date, $priority, $url, $notes, $todoList, $event_id]);
        echo json_encode(['message' => 'Event updated successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Error updating event', 'error' => $e->getMessage()]);
    }
}

function handlePatchRequest($event_id) {
    global $pdo;

    $sql = "UPDATE events SET status = 'Completed' WHERE id = ?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$event_id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Event not found']);
        } else {
            echo json_encode(['message' => 'Event marked as completed successfully!']);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Error marking event as completed', 'error' => $e->getMessage()]);
    }
}

function handleDeleteRequest($event_id) {
    global $pdo;

    $sql = "DELETE FROM events WHERE id = ?";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$event_id]);
        if ($stmt->rowCount() === 0) {
            http_response_code(404);
            echo json_encode(['message' => 'Event not found']);
        } else {
            echo json_encode(['message' => 'Event deleted successfully!']);
        }
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Error deleting event', 'error' => $e->getMessage()]);
    }
}

function handleGetRequest() {
    global $pdo;

    $today = date('d/m/Y');
    $result = ['Today' => ['tasks' => [], 'meetings' => [], 'following_up' => []]];

    try {
        $tasksQuery = "SELECT * FROM events WHERE DATE_FORMAT(date, '%d/%m/%Y') = ? AND url IS NULL";
        $stmt = $pdo->prepare($tasksQuery);
        $stmt->execute([$today]);
        $result['Today']['tasks'] = array_map(function($task) {
            $task['date'] = formatDateToDDMMYYYY($task['date']);
            return $task;
        }, $stmt->fetchAll());

        $meetingsQuery = "SELECT * FROM events WHERE DATE_FORMAT(date, '%d/%m/%Y') = ? AND url IS NOT NULL";
        $stmt = $pdo->prepare($meetingsQuery);
        $stmt->execute([$today]);
        $result['Today']['meetings'] = array_map(function($meeting) {
            $meeting['date'] = formatDateToDDMMYYYY($meeting['date']);
            return $meeting;
        }, $stmt->fetchAll());

        $followUpQuery = "SELECT * FROM events WHERE status = 'Pending'";
        $stmt = $pdo->query($followUpQuery);
        $result['Today']['following_up'] = array_map(function($follow_up) {
            $follow_up['date'] = formatDateToDDMMYYYY($follow_up['date']);
            return $follow_up;
        }, $stmt->fetchAll());

        echo json_encode($result);
    } catch (PDOException $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$event_id = $_GET['event_id'] ?? null;

switch ($method) {
    case 'POST':
        handlePostRequest();
        break;
    case 'PUT':
        if ($event_id) {
            handlePutRequest($event_id);
        }
        break;
    case 'PATCH':
        if ($event_id) {
            handlePatchRequest($event_id);
        }
        break;
    case 'DELETE':
        if ($event_id) {
            handleDeleteRequest($event_id);
        }
        break;
    case 'GET':
        handleGetRequest();
        break;
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method Not Allowed']);
}
?>
