import React, { useState, useEffect } from 'react';
import './CEM.css';

const CalendarEventModal = ({ isVisible, onClose, selectedDate, userid }) => {
  const [eventDetails, setEventDetails] = useState({
    userid: '',  
    title: '',
    date: '',
    url: '',
    notes: '',
    status: 'Pending',
  });

  // Define the formatDate function
  const formatDate = (date) => {
    const d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    let year = d.getFullYear();

    // Add leading zero to day and month if necessary
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (selectedDate && userid) {
      const formattedDate = formatDate(selectedDate);
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
            // Reset form values after successful save
            setEventDetails({
                userid: '',
                title: '',
                date: formatDate(selectedDate), // Ensure selectedDate is still formatted
                url: '',
                notes: '',
                status: 'Pending',
            });

            // Call onClose after successful submission
            onClose(); 
        } else {
            console.error('Failed to create event');
        }
    } catch (error) {
        console.error('Error creating event:', error);
    }
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
          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
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

export default CalendarEventModal;
