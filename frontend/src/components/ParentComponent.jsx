import React, { useState, useEffect } from 'react';
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

  // Extract subUsername, superUsername, and userid from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const subUsername = queryParams.get('subUsername');
  const superUsername = queryParams.get('superUsername');
  const userid = queryParams.get('userid');

  // Function to get today's date in DD/MM/YYYY format
  const getTodayDateString = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to check if the given date matches today's date
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

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

  const todayDate = getTodayDateString(); // Get today's date in the required format

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Pass subUsername, superUsername, and userid to Navbar */}
      <Navbar toggleSidebar={toggleSidebar} subUsername={subUsername} superUsername={superUsername} userid={userid} />
      <div className={`flex-grow flex transition-all duration-300 ${isSidebarOpen ? 'mr-[250px]' : ''}`}>
        <Calendar1 
          onDateClick={openCreateModal} 
          isToday={isToday}  // Pass the isToday function
        />
        {/* Pass selectedDate (todayDate) and other props to RightSideBar */}
        <RightSideBar 
          isOpen={isSidebarOpen} 
          onUpdate={handleUpdate} 
          selectedDate={todayDate}  // Pass todayDate in DD/MM/YYYY format
          subUsername={subUsername} 
          superUsername={superUsername} 
          userid={userid} 
        />
      </div>
      <UpdateEventModal
        isVisible={isUpdateModalVisible}
        onClose={handleCloseUpdateModal}
        eventDetails={selectedEvent}
        subUsername={subUsername}  // Pass subUsername
        superUsername={superUsername}  // Pass superUsername
        userid={userid}  // Pass userid
      />
      <CalendarEventModal
        isVisible={isCreateModalVisible}
        onClose={handleCloseCreateModal}
        selectedDate={selectedDate}
        userid={userid} // Pass userid to CalendarEventModal
      />
    </div>
  );
};

export default ParentComponent;
