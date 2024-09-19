import React, { useState, useEffect } from 'react';
import './CEM.css';

const AdminEventModal = ({ isVisible, onClose, selectedDate, userid }) => {
  const [eventDetails, setEventDetails] = useState({
    userid: '',  
    title: '',
    date: selectedDate,
    url: '',
    notes: '',
    status: '',
    repeat: 'No option'  // Added repeat state
  });
  console.log("EventMosdal:", selectedDate);


  useEffect(() => {
    if (selectedDate && userid) {
      const formattedDate =selectedDate;
      setEventDetails(prev => ({
        ...prev,
        date: formattedDate,
        userid: userid
      }));
    }
  }, [selectedDate, userid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const jsonObject = {
        userid: eventDetails.userid,
        title: eventDetails.title,
        date: eventDetails.date,
        url: eventDetails.url,
        notes: eventDetails.notes,
        status: eventDetails.status,
        repeat: eventDetails.repeat,  // Include repeat field in the API request
    };
    
    try {
        const response = await fetch('http://localhost:8000/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonObject),
        });

        if (response.ok) {
            handleCancel(); // Reset form values after successful save
        } else {
            console.error('Failed to create event');
        }
    } catch (error) {
        console.error('Error creating event:', error);
    } finally {
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
    setEventDetails(prev => ({ ...prev, title: '', repeat: 'No option' }));  // Reset repeat on cancel
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <input
              type="text"
              placeholder="Task Title"
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
              readOnly
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="Meeting URL (optional)"
              name="url"
              value={eventDetails.url}
              onChange={handleChange}
            />
          </div>
          <div>
            <textarea
              placeholder="Notes"
              name="notes"
              value={eventDetails.notes}
              onChange={handleChange}
            ></textarea>
          </div>
          {/* Repeat dropdown integration */}
          <div className="form-control">
            <label>Repeat:</label>
            <select name="repeat" value={eventDetails.repeat} onChange={handleChange}>
              <option>No option</option>
              <option>Daily</option>
              <option>Weekly</option>
              <option>Fortnightly</option>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventModal;
