import React, { useState, useEffect } from 'react';
import './CEM.css';

const CalendarEventModal = ({ isVisible, onClose, selectedDate }) => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    color: 'Emerald green', // Default or fetched setting
    date: '',
    isAllDay: false,
    memo: false,
    notification: 'No Notification',
    repeat: 'Not Repeating',
    url: '',
    location: '',
    files: [],
    notes: '',
    todoList: []
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Saving Event Details:', eventDetails);
    onClose(); // Close modal after save
  };

  const handleCancel = () => {
    setEventDetails(prev => ({ ...prev, title: '' })); // Reset form on cancel
    onClose(); // Close modal
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input type="text" placeholder="Title" name="title" value={eventDetails.title} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Date:</label>
            <input type="text" name="date" value={eventDetails.date} onChange={handleChange} />
          </div>
          {/* <div className="form-control">
            <input type="text" placeholder="Emerald green" name="color" value={eventDetails.color} onChange={handleChange} />
          </div> */}
          <div className="form-control">
            <input type="text" placeholder="URL" name="url" value={eventDetails.url} onChange={handleChange} />
          </div>
          <div className="form-control">
            <label>Attach files
              <input type="file" name="files" multiple onChange={handleChange} />
            </label>
          </div>
          <div className="form-control">
            <textarea placeholder="To-Do List" name="todoList" value={eventDetails.todoList} onChange={handleChange}></textarea>
            <textarea placeholder="Note" name="notes" value={eventDetails.notes} onChange={handleChange}></textarea>
            
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
            <button type="submit" disabled={!eventDetails.title.trim()} className="save-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarEventModal;
