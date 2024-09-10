import React, { useState, useEffect } from 'react';
import FollowUpModal from './FollowUpModal';
import './RightSideBar.css';
import tickIcon from '../assets/tick.png';
import { useParams } from 'react-router-dom';

const RightSideBar = ({ isOpen, onUpdate, selectedDate }) => {
  const { subUserId } = useParams(); // Extract subUserId from the URL params
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
        const response = await fetch(`http://localhost:8000/sidebar/${subUserId}?date=${selectedDate}`);
        const data = await response.json();
        setEventsData(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    if (subUserId && selectedDate) {
      fetchEvents();
    }
  }, [subUserId, selectedDate]);

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

  const renderEventTitle = (event) => {
    return (
      <>
        {event.status === 'Completed' && (
          <img src={tickIcon} alt="Completed" className="tick-icon" />
        )}
        {event.title}
      </>
    );
  };

  const { tasks, meetings, following_up } = eventsData.Today;

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
