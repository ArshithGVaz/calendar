import React, { useState } from 'react';
import Calendar1 from './cal';
import RightSideBar from './RightSideBar';
import Navbar from './Navbar';
import UpdateEventModal from './UpdateEventModal';
import CalendarEventModal from './CalendarEventModal';  
import { useLocation } from 'react-router-dom';

const ParentComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // selectedDate defined here

  const location = useLocation();

  // Extract subUsername and superUsername from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const subUsername = queryParams.get('subUsername');
  const superUsername = queryParams.get('superUsername');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleUpdate = (event) => {
    setSelectedEvent(event);
    setIsUpdateModalVisible(true);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalVisible(false);
    setSelectedEvent(null);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalVisible(false);
  };

  const openCreateModal = (date) => {
    setSelectedDate(date || new Date()); // Set the selected date when opening the modal
    setIsCreateModalVisible(true);
  };
  console.log(subUsername, superUsername, "Hi");

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Pass subUsername and superUsername to Navbar */}
      <Navbar toggleSidebar={toggleSidebar} subUsername={subUsername} superUsername={superUsername} />
      <div className={`flex-grow flex transition-all duration-300 ${isSidebarOpen ? 'mr-[250px]' : ''}`}>
        <Calendar1 onDateClick={openCreateModal} />
        {/* Pass selectedDate to RightSideBar */}
        <RightSideBar isOpen={isSidebarOpen} onUpdate={handleUpdate} selectedDate={selectedDate} />
      </div>
      <UpdateEventModal
        isVisible={isUpdateModalVisible}
        onClose={handleCloseUpdateModal}
        eventDetails={selectedEvent}
      />
      <CalendarEventModal
  isVisible={isCreateModalVisible}
  onClose={handleCloseCreateModal}
  selectedDate={selectedDate}
  subUsername={subUsername}  // Pass subUsername here
/>
    </div>
  );
};

export default ParentComponent;
