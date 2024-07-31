// src/components/RightSideBar.jsx

import React, { useState } from 'react';
import './RightSideBar.css';

const RightSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <aside className="sidebar">
        
      </aside>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? '→' : '←'}
      </button>
    </div>
  );
};

export default RightSideBar;
