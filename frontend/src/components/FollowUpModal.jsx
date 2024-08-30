import React, { useState } from 'react';
import './FollowUpModal.css';  // You can create a new CSS file for this or reuse existing styles

const FollowUpModal = ({ isVisible, onClose, task, onFollowUp }) => {
  const [followUpDate, setFollowUpDate] = useState('');
  const [error, setError] = useState('');

  const handleDateChange = (e) => {
    setFollowUpDate(e.target.value);
    setError('');  // Clear any previous error messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentDate = new Date();
    const selectedDate = new Date(followUpDate);

    if (selectedDate <= currentDate) {
      setError('The follow-up date must be in the future.');
      return;
    }

    // Construct the follow-up event data
    const followUpEvent = {
      title: `Follow up of ${task.title}`,
      date: followUpDate,
      priority: task.priority,
      url: task.url,
      notes: task.notes,
      todoList: task.todoList,
      status: 'Pending',  // Assuming follow-up starts as pending
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
        onFollowUp();  // Callback to refresh or update the UI after the follow-up event is created
        onClose();  // Close the modal after successful submission
      } else {
        console.error('Failed to create follow-up event');
      }
    } catch (error) {
      console.error('Error creating follow-up event:', error);
    }
  };

  const handleCancel = () => {
    onClose();  // Close the modal without submitting
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
