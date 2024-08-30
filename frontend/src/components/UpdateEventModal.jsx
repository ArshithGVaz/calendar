import React, { useState, useEffect } from 'react';
import './CEM.css';

const UpdateEventModal = ({ isVisible, onClose, eventDetails }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    url: '',
    files: [],
    notes: '',
    todoList: [],
    priority: 1
  });

  useEffect(() => {
    if (eventDetails) {
      setEventData({
        title: eventDetails.title || '',
        date: eventDetails.date || '',
        url: eventDetails.url || '',
        files: eventDetails.files || [],
        notes: eventDetails.notes || '',
        todoList: eventDetails.todoList || [],
        priority: eventDetails.priority || 1
      });
    }
  }, [eventDetails]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setEventData(prev => ({ ...prev, [name]: files }));
    } else {
      setEventData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSliderChange = (e) => {
    setEventData(prev => ({ ...prev, priority: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', eventData.title);
    formData.append('date', eventData.date);
    formData.append('url', eventData.url);
    formData.append('notes', eventData.notes);
    formData.append('todoList', JSON.stringify(eventData.todoList));
    formData.append('priority', eventData.priority);

    if (eventData.files.length > 0) {
      for (let i = 0; i < eventData.files.length; i++) {
        formData.append('files', eventData.files[i]);
      }
    }

    try {
      const response = await fetch(`http://localhost:8000/events/${eventDetails.id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        console.log('Event updated successfully!');
        onClose();
      } else {
        console.error('Failed to update event');
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleCancel = () => {
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
              value={eventData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label>Date:</label>
            <input
              type="text"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="URL"
              name="url"
              value={eventData.url}
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label>Attach files
              <input
                type="file"
                name="files"
                multiple
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-control">
            <label>Priority:</label>
            <input
              type="range"
              min="1"
              max="5"
              value={eventData.priority}
              onChange={handleSliderChange}
            />
            <span>{eventData.priority}</span>
          </div>
          <div className="form-control">
            <textarea
              placeholder="To-Do List"
              name="todoList"
              value={eventData.todoList}
              onChange={handleChange}
            ></textarea>
            <textarea
              placeholder="Note"
              name="notes"
              value={eventData.notes}
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
              disabled={!eventData.title.trim()}
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

export default UpdateEventModal;
