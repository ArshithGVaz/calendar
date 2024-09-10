import React, { useState, useEffect } from 'react';
import FollowUpModal from './FollowUpModal';
import './RightSideBar.css';
import tickIcon from '../assets/tick.png'; // Assuming you have a tick icon for completed tasks

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
        const data = await response.json();
        // Make sure data is in the correct format
        setEventsData(data || {
          Today: {
            tasks: [],
            meetings: [],
            following_up: []
          }
        });
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

    if (subUsername && selectedDate) {
      fetchEvents();
    }
  }, [subUsername, selectedDate]);

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
        // Refresh the events after marking as completed
        setEventsData(prev => ({
          ...prev,
          Today: {
            ...prev.Today,
            tasks: prev.Today.tasks.filter(task => task.id !== event.id), // Remove the completed task
          }
        }));
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
        // Refresh the events after deleting
        setEventsData(prev => ({
          ...prev,
          Today: {
            tasks: prev.Today.tasks.filter(task => task.id !== id),
            meetings: prev.Today.meetings.filter(meeting => meeting.id !== id),
            following_up: prev.Today.following_up.filter(work => work.id !== id)
          }
        }));
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const renderEventButtons = (event) => (
    <div className="event-actions">
      <button onClick={() => onUpdate(event)}>UPDATE</button>
      <button onClick={() => handleFollowUp(event)}>FOLLOW UP</button>
      <button onClick={() => handleCompleted(event)}>COMPLETED</button>
      <button onClick={() => handleDelete(event.id)}>DELETE</button>
    </div>
  );

  const renderEventTitle = (event) => (
    <>
      {event.status === 'Completed' && (
        <img src={tickIcon} alt="Completed" className="tick-icon" />
      )}
      {event.title}
    </>
  );

  // Safely access eventsData.Today, fallback to empty arrays if undefined
  const tasks = eventsData?.Today?.tasks || [];
  const meetings = eventsData?.Today?.meetings || [];
  const following_up = eventsData?.Today?.following_up || [];

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <aside className="sidebar">
        <section>
          <h3>Tasks</h3>
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
