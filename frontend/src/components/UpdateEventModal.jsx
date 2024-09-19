import React, { useState, useEffect } from 'react';
import './CEM.css';

const UpdateEventModal = ({ isVisible, onClose, eventDetails }) => {
  const [eventData, setEventData] = useState(eventDetails || {});

  useEffect(() => {
    if (eventDetails) {
      setEventData(eventDetails);
    }
  }, [eventDetails]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:8000/events/${eventData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        onClose(); // Close the modal on successful update
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="modal">
      {/* Modal content */}
    </div>
  );
};

export default UpdateEventModal;
