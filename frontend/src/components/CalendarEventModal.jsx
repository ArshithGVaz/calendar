import React, { useState, useEffect } from 'react';
import './CEM.css';

const CalendarEventModal = ({ isVisible, onClose, selectedDate }) => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    date: '',
    url: '',
    notes: '',
    todoList: [],
    priority: 1  // Default priority to 1
  });

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = formatDate(selectedDate);
      setEventDetails(prev => ({ ...prev, date: formattedDate }));
    }
  }, [selectedDate]);

  const formatDate = (date) => {
    const d = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return d.toISOString().split('T')[0].split('-').reverse().join('/');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSliderChange = (e) => {
    setEventDetails(prev => ({ ...prev, priority: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Saving Event Details:', eventDetails);

    const formData = new FormData();
    formData.append('title', eventDetails.title);
    formData.append('date', eventDetails.date);
    formData.append('priority', eventDetails.priority);
    formData.append('url', eventDetails.url);
    formData.append('notes', eventDetails.notes);
    formData.append('todoList', JSON.stringify(eventDetails.todoList));

    try {
      const response = await fetch('http://localhost:8000/events', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Event created successfully!');
        onClose();
      } else {
        console.error('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleCancel = () => {
    setEventDetails(prev => ({ ...prev, title: '' }));
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={eventDetails.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label>Date:</label>
            <input
              type="text"
              name="date"
              value={eventDetails.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="URL"
              name="url"
              value={eventDetails.url}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <textarea
              placeholder="To-Do List"
              name="todoList"
              value={eventDetails.todoList}
              onChange={handleChange}
            ></textarea>
            <textarea
              placeholder="Note"
              name="notes"
              value={eventDetails.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!eventDetails.title.trim()}
              className="save-button"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarEventModal;
