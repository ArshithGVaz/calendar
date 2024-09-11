const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    origin: '*',  // Allow all origins, for testing purposes
    methods: 'GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'beastguy',
    password: 'arsus',
    database: 'LEM'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// Function to convert DD/MM/YYYY to YYYY-MM-DD
const convertToDateString = (isoDateStr) => {
    const date = new Date(isoDateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based month
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Return as YYYY-MM-DD
  };
  const convertStringToDate = (dateStr) => {
    if (typeof dateStr === 'string') {
        const [dd, mm, yyyy] = dateStr.split('/');
        return new Date(`${yyyy}-${mm}-${dd}`);
    }
    return null;
};

// Function to convert YYYY-MM-DD to DD/MM/YYYY
const convertDateToString = (date) => {
    if (date instanceof Date) {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${dd}/${mm}/${yyyy}`;
    }
    return null;
};

// Admin login route (POST)
app.get('/api/users', (req, res) => {
    const query = 'SELECT * FROM users';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching users', error: err.message });
        }
        res.status(200).json(result);
    });
});

// Add a new user (POST)
app.post('/api/users', (req, res) => {
    const { userid, username, email, super_user_id, password } = req.body;

    // Check if user already exists
    const checkUserQuery = 'SELECT * FROM users WHERE userid = ?';
    db.query(checkUserQuery, [userid], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error checking for user', error: err.message });
        }
        if (result.length > 0) {
            return res.status(409).json({ message: 'User with this ID already exists' });
        }

        // Insert user into the database
        const query = 'INSERT INTO users (userid, username, email, super_user_id, password) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [userid, username, email, super_user_id, password], (err, result) => {
            if (err) {
                console.error('Error adding user:', err.message);
                return res.status(500).json({ message: 'Error adding user', error: err.message });
            }

            res.status(201).json({ message: 'User added successfully!', userId: result.insertId });
        });
    });
});


// Add a new user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Query to fetch user details by email and password
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Error fetching user details:', err.message);
            return res.status(500).json({ success: false, message: 'Error fetching user details', error: err.message });
        }

        if (result.length === 0) {
            console.log('User not found or invalid credentials');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = result[0];

        // Check if the user is admin (userid = 1000)
        if (user.userid === 1000) {
            return res.status(200).json({ 
                success: true, 
                isAdmin: true, 
                username: user.username, 
                userid: user.userid  // Return userid along with username
            });
        } else {
            return res.status(200).json({ 
                success: true, 
                isAdmin: false, 
                username: user.username, 
                userid: user.userid  // Return userid along with username
            });
        }
    });
});


// Update a user
app.put('/api/users/:userid', (req, res) => {
    const { userid } = req.params;
    const { username, email, super_user_id, password } = req.body;
    const query = 'UPDATE users SET username = ?, email = ?, super_user_id = ?, PASSWORD = ? WHERE userid = ?';
    db.query(query, [username, email, super_user_id, password, userid], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating user', error: err.message });
        }
        res.status(200).json({ message: 'User updated successfully!' });
    });
});

// Delete a user
app.delete('/api/users/:userid', (req, res) => {
    const { userid } = req.params;
    const query = 'DELETE FROM users WHERE userid = ?';
    db.query(query, [userid], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting user', error: err.message });
        }
        res.status(200).json({ message: 'User deleted successfully!' });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Query to fetch user details by email and password
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, result) => {
        if (err) {
            console.error('Error fetching user details:', err.message);
            return res.status(500).json({ success: false, message: 'Error fetching user details', error: err.message });
        }

        if (result.length === 0) {
            console.log('User not found or invalid credentials');
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = result[0];

        // Check if the user is admin (userid = 1000)
        if (user.userid === 1000) {
            return res.status(200).json({ success: true, isAdmin: true, username: user.username, userid: user.userid });
        } else {
            return res.status(200).json({ success: true, isAdmin: false, username: user.username, userid: user.userid });
        }
    });
});


// Get supervised users (recursive tree)
app.get('/api/supervised/:userid', (req, res) => {
    const { userid } = req.params;

    const query = `
        WITH RECURSIVE supervised_users AS (
            SELECT userid, username, super_user_id
            FROM users
            WHERE userid = ?
            UNION
            SELECT u.userid, u.username, u.super_user_id
            FROM users u
            INNER JOIN supervised_users su ON su.userid = u.super_user_id
        )
        SELECT userid, username FROM supervised_users
    `;

    db.query(query, [userid], (err, result) => {
        if (err) {
            console.error('Error fetching supervised users:', err.message);
            return res.status(500).json({ success: false, message: 'Error fetching supervised users', error: err.message });
        }

        // Log the fetched result for debugging
        console.log('Supervised Users:', result);
        
        res.status(200).json({ success: true, users: result });
    });
});


app.post('/events', (req, res) => {
    let { userid, title, date, url, notes, status } = req.body;
    console.log(req.body);
    // Convert date to YYYY-MM-DD
    
    date = convertStringToDate(date);
    console.log("Date is here",date);
    const query = 'INSERT INTO events (userid, title, date, url, notes, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [userid, title, date, url, notes,  status], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error creating event', error: err.message });
        }
        res.status(201).json({ message: 'Event created successfully!' });
    });
});



// Update Event (PUT)
app.put('/events/:event_id', (req, res) => {
    let { subUsername, title, date, url, notes, todoList, status } = req.body;

    // Convert date to YYYY-MM-DD
    date = convertStringToDate(date);

    const query = 'UPDATE events SET subUsername = ?, title = ?, date = ?, url = ?, notes = ?, todoList = ?, status = ? WHERE id = ?';
    db.query(query, [subUsername, title, date, url, notes, todoList, status, req.params.event_id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating event', error: err.message });
        }
        res.status(200).json({ message: 'Event updated successfully!' });
    });
});


// Mark Event as Completed (PATCH)
app.patch('/events/:event_id/complete', (req, res) => {
    const { event_id } = req.params;

    const query = 'UPDATE events SET status = "Completed" WHERE id = ?';
    db.query(query, [event_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error marking event as completed', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event marked as completed successfully!' });
    });
});


// Delete Event (DELETE)
app.delete('/events/:event_id', (req, res) => {
    const { event_id } = req.params;

    const query = 'DELETE FROM events WHERE id = ?';
    db.query(query, [event_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error deleting event', error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully!' });
    });
});

app.get('/sidebar/:userid', (req, res) => {
    const { userid } = req.params;
    let { date } = req.query;

    // Convert date from DD/MM/YYYY to YYYY-MM-DD
    if (date) {
        const [day, month, year] = date.split('/');
        date = `${year}-${month}-${day}`;
    }

    const tasksQuery = "SELECT * FROM events WHERE userid = ? AND date = ? AND url IS NULL";
    const meetingsQuery = "SELECT * FROM events WHERE userid = ? AND date = ? AND url IS NOT NULL";
    const followUpQuery = "SELECT * FROM events WHERE userid = ? AND date = ? AND status = 'Pending'";

    db.query(tasksQuery, [userid, date], (err, tasks) => {
        if (err) return res.status(500).json({ error: err.message });

        db.query(meetingsQuery, [userid, date], (err, meetings) => {
            if (err) return res.status(500).json({ error: err.message });

            db.query(followUpQuery, [userid, date], (err, following_up) => {
                if (err) return res.status(500).json({ error: err.message });

                const result = {
                    Today: {
                        tasks,
                        meetings,
                        following_up
                    }
                };

                res.json(result);
            });
        });
    });
});


// Server setup
const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
