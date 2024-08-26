import React from 'react';
import './RightSideBar.css';

const RightSideBar = ({ isOpen }) => {
  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <aside className="sidebar">
        {/* Sidebar content */}
      </aside>
    </div>
  );
};

export default RightSideBar;
