import React, { useState } from 'react';
import Calendar1 from './cal';
import RightSideBar from './RightSideBar';
import Navbar from './Navbar';

const ParentComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={`flex-grow flex transition-all duration-300 ${isSidebarOpen ? 'mr-[250px]' : ''}`}>
        <Calendar1 />
        <RightSideBar isOpen={isSidebarOpen} />
      </div>
    </div>
  );
};

export default ParentComponent;
