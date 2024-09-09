from fastapi import FastAPI, File, UploadFile, Form, Path
from fastapi.responses import JSONResponse
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import mysql.connector

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_config = {
    'user': 'your_user',
    'password': 'your_password',
    'host': 'localhost',
    'database': 'your_database'
}


def format_date_to_ddmmyyyy(date_str):
    return datetime.strptime(date_str, '%Y-%m-%d').strftime('%d/%m/%Y')
@app.post("/events")
async def create_event(
    title: str = Form(...),
    date: str = Form(...),
    priority: int = Form(...),
    url: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    todoList: Optional[str] = Form(None),
    status: Optional[str] = Form(None), 
):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:

        query = """
        INSERT INTO events (title, date, priority, url, notes, todoList, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (title, date, priority, url, notes, todoList, status))
        connection.commit()
        return JSONResponse(content={"message": "Event created successfully!"}, status_code=201)
    except Exception as e:
        connection.rollback()
        return JSONResponse(content={"message": "Error creating event", "error": str(e)}, status_code=500)
    finally:
        cursor.close()
        connection.close()


@app.put("/events/{event_id}")
async def update_event(
    event_id: int,
    title: str = Form(...),
    date: str = Form(...),
    priority: int = Form(...),
    url: str = Form(None),
    notes: str = Form(None),
    todoList: str = Form(None),
    files: list[UploadFile] = File(None)
):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:
        query = """
        UPDATE events 
        SET title = %s, date = %s, priority = %s, url = %s, notes = %s, todoList = %s
        WHERE id = %s
        """
        cursor.execute(query, (title, date, priority, url, notes, todoList, event_id))
        connection.commit()
        return JSONResponse(content={"message": "Event updated successfully!"}, status_code=200)
    except Exception as e:
        connection.rollback()
        return JSONResponse(content={"message": "Error updating event", "error": str(e)}, status_code=500)
    finally:
        cursor.close()
        connection.close()


@app.patch("/events/{event_id}/complete")
async def mark_event_as_completed(event_id: int = Path(..., title="The ID of the event to be marked as completed")):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:

        query = "UPDATE events SET status = 'Completed' WHERE id = %s"
        cursor.execute(query, (event_id,))
        connection.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        return JSONResponse(content={"message": "Event marked as completed successfully!"}, status_code=200)
    except Exception as e:
        connection.rollback()
        return JSONResponse(content={"message": "Error marking event as completed", "error": str(e)}, status_code=500)
    finally:
        cursor.close()
        connection.close()
@app.delete("/events/{event_id}")
async def delete_event(event_id: int = Path(..., title="The ID of the event to delete")):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()
    try:
        query = "DELETE FROM events WHERE id = %s"
        cursor.execute(query, (event_id,))
        connection.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        return JSONResponse(content={"message": "Event deleted successfully!"}, status_code=200)
    except Exception as e:
        connection.rollback()
        return JSONResponse(content={"message": "Error deleting event", "error": str(e)}, status_code=500)
    finally:
        cursor.close()
        connection.close()
@app.get("/sidebar")
async def get_events():
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor(dictionary=True)
    today = datetime.now().strftime('%d/%m/%Y')
    
    try:
        cursor.execute("SELECT * FROM events WHERE DATE_FORMAT(date, '%%d/%%m/%%Y') = %s AND url IS NULL", (today,))
        tasks = cursor.fetchall()
        cursor.execute("SELECT * FROM events WHERE DATE_FORMAT(date, '%%d/%%m/%%Y') = %s AND url IS NOT NULL", (today,))
        meetings = cursor.fetchall()
        cursor.execute("SELECT * FROM events WHERE status = 'Pending'")
        following_up = cursor.fetchall()
        for event in tasks + meetings + following_up:
            event['date'] = format_date_to_ddmmyyyy(event['date'])
        result = {
            "Today": {
                "tasks": tasks,
                "meetings": meetings,
                "following_up": following_up
            }
        }
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        cursor.close()
        connection.close()