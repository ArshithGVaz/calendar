import React, { useState } from 'react';
import './FollowUpModal.css';  

const FollowUpModal = ({ isVisible, onClose, task, onFollowUp }) => {
  const [followUpDate, setFollowUpDate] = useState('');
  const [error, setError] = useState('');

  const handleDateChange = (e) => {
    setFollowUpDate(e.target.value);
    setError('');  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(followUpDate);

    if (selectedDate <= currentDate) {
      setError('The follow-up date must be in the future.');
      return;
    }

    const followUpEvent = {
      title: `Follow up of ${task.title}`,
      date: followUpDate,
      priority: task.priority,
      url: task.url,
      notes: task.notes,
      todoList: task.todoList,
      status: 'Pending',  
    };

    try {
      const response = await fetch('http://localhost:8000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(followUpEvent),
      });

      if (response.ok) {
        console.log('Follow-up event created successfully!');
        onFollowUp();  
        onClose(); 
      } else {
        console.error('Failed to create follow-up event');
      }
    } catch (error) {
      console.error('Error creating follow-up event:', error);
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
            <label>Follow-Up Date:</label>
            <input
              type="date"
              name="followUpDate"
              value={followUpDate}
              onChange={handleDateChange}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
            <button type="submit" className="save-button">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpModal;
