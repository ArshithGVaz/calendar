import React, { useState, useEffect } from 'react';
import FollowUpModal from './FollowUpModal';
import './RightSideBar.css';
import tickIcon from '../assets/tick.png';

const RightSideBar = ({ isOpen, onUpdate, selectedDate, subUsername, superUsername, userid }) => {
  const [eventsData, setEventsData] = useState({
    Today: {
      tasks: [],
      meetings: [],
      following_up: []
    }
  });
  const [activeButtons, setActiveButtons] = useState({});
  const [isFollowUpModalVisible, setIsFollowUpModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:8000/sidebar/${userid}?date=${selectedDate}`);
        if (response.ok) {
          const data = await response.json();
          setEventsData(data || {
            Today: {
              tasks: [],
              meetings: [],
              following_up: []
            }
          });
        } else {
          console.error('Error fetching events, status:', response.status);
          setEventsData({
            Today: {
              tasks: [],
              meetings: [],
              following_up: []
            }
          });
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Set default empty state in case of error
        setEventsData({
          Today: {
            tasks: [],
            meetings: [],
            following_up: []
          }
        });
      }
    };

    if (userid && selectedDate) {
      fetchEvents();
    }
  }, [userid, selectedDate]);

  const toggleButtons = (id) => {
    setActiveButtons((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFollowUp = (task) => {
    setSelectedTask(task);
    setIsFollowUpModalVisible(true);
  };

  const handleFollowUpSubmit = () => {
    setIsFollowUpModalVisible(false);
  };

  const handleCompleted = async (event) => {
    try {
      const response = await fetch(`http://localhost:8000/events/${event.id}/complete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (response.ok) {
        console.log(`Event with ID: ${event.id} marked as completed`);
        // Update event status locally
        updateEventStatus(event.id, 'Completed');
      } else {
        console.error('Failed to mark event as completed');
      }
    } catch (error) {
      console.error('Error marking event as completed:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log(`Event with ID: ${id} deleted`);
        // Remove the event from the state
        removeEventFromState(id);
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // New function to handle approval
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/events/${id}/approve`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log(`Event with ID: ${id} approved`);
        // Update event approval status locally
        updateEventApproval(id, 'Approved');
      } else {
        console.error('Failed to approve event');
      }
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  // Function to update event status locally
  const updateEventStatus = (id, status) => {
    setEventsData((prevData) => {
      const updatedEvents = { ...prevData };
      ['tasks', 'meetings', 'following_up'].forEach((category) => {
        updatedEvents.Today[category] = updatedEvents.Today[category].map((event) => {
          if (event.id === id) {
            return { ...event, status };
          }
          return event;
        });
      });
      return updatedEvents;
    });
  };

  // Function to update event approval status locally
  const updateEventApproval = (id, approved) => {
    setEventsData((prevData) => {
      const updatedEvents = { ...prevData };
      ['tasks', 'meetings', 'following_up'].forEach((category) => {
        updatedEvents.Today[category] = updatedEvents.Today[category].map((event) => {
          if (event.id === id) {
            return { ...event, approved };
          }
          return event;
        });
      });
      return updatedEvents;
    });
  };

  // Function to remove event from state
  const removeEventFromState = (id) => {
    setEventsData((prevData) => {
      const updatedEvents = { ...prevData };
      ['tasks', 'meetings', 'following_up'].forEach((category) => {
        updatedEvents.Today[category] = updatedEvents.Today[category].filter((event) => event.id !== id);
      });
      return updatedEvents;
    });
  };

  // Updated renderEventButtons function
  const renderEventButtons = (event) => (
    <div className="event-actions">
     
      {event.status !== 'Completed' && (
        <>
         <button onClick={() => onUpdate(event)}>UPDATE</button>
          <button onClick={() => handleFollowUp(event)}>FOLLOW UP</button>
          <button onClick={() => handleCompleted(event)}>COMPLETED</button>
          <button onClick={() => handleDelete(event.id)}>DELETE</button>
        </>
      )}
      {event.status === 'Completed' && event.approved !== 'Approved' && (
        <button onClick={() => handleApprove(event.id)}>APPROVE</button>
      )}
    </div>
  );

  const renderEventTitle = (event) => (
    <>
      {event.status === 'Completed' && (
        <img src={tickIcon} alt="Completed" className="tick-icon" />
      )}
      {event.title}
      {event.approved === 'Approved' && (
        <span className="approved-label"> (Approved)</span>
      )}
    </>
  );

  // Ensure eventsData and Today exist before accessing tasks, meetings, etc.
  const { tasks = [], meetings = [], following_up = [] } = eventsData?.Today || {};

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <aside className="sidebar">
        <section>
          <h3>Tasks for {selectedDate}</h3>
          {tasks.map((task) => (
            <div key={task.id} className="event-item">
              <button
                className="event-title"
                onClick={() => toggleButtons(task.id)}
              >
                {renderEventTitle(task)}
              </button>
              {activeButtons[task.id] && renderEventButtons(task)}
            </div>
          ))}
        </section>
        <section>
          <h3>Meetings</h3>
          {meetings.map((meeting) => (
            <div key={meeting.id} className="event-item">
              <button
                className="event-title"
                onClick={() => toggleButtons(meeting.id)}
              >
                {renderEventTitle(meeting)}
              </button>
              {activeButtons[meeting.id] && renderEventButtons(meeting)}
            </div>
          ))}
        </section>
        <section>
          <h3>Pending Works</h3>
          {following_up.map((work) => (
            <div key={work.id} className="event-item">
              <button
                className="event-title"
                onClick={() => toggleButtons(work.id)}
              >
                {renderEventTitle(work)}
              </button>
              {activeButtons[work.id] && renderEventButtons(work)}
            </div>
          ))}
        </section>
      </aside>

      <FollowUpModal
        isVisible={isFollowUpModalVisible}
        onClose={() => setIsFollowUpModalVisible(false)}
        task={selectedTask}
        onFollowUp={handleFollowUpSubmit}
      />
    </div>
  );
};

export default RightSideBar;
