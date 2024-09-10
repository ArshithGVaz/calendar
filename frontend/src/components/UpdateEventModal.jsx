import React, { useState, useEffect } from 'react';
import './CEM.css';

const UpdateEventModal = ({ isVisible, onClose, eventDetails, subUsername, superUsername, userid }) => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    url: '',
    notes: '',
    userid: userid
  });

  useEffect(() => {
    if (eventDetails) {
      setEventData({
        title: eventDetails.title || '',
        date: eventDetails.date || '',
        url: eventDetails.url || '',
        notes: eventDetails.notes || '',
        priority: eventDetails.priority || 1,
        subUsername: subUsername,
        superUsername: superUsername,
        userid: userid
      });
    }
  }, [eventDetails, subUsername, superUsername, userid]);

  if (!isVisible) return null;

  return (
    <div className="modal">
      {/* Modal content */}
    </div>
  );
};

export default UpdateEventModal;
