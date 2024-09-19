// ParentComponent.jsx

import React, { useState } from 'react';
import Calendar1 from './cal';
import RightSideBar from './RightSideBar';
import AdminSideBar from './AdminSideBar';
import Navbar from './Navbar';
import UpdateEventModal from './UpdateEventModal';
import AdminEventModal from './AdminEventModal';
import CalendarEventModal from './CalendarEventModal';
import { useLocation } from 'react-router-dom';

const ParentComponent = () => {
  // Move formatDate here, before its first use
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));  // Now formatDate is declared before this line

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subUsername = queryParams.get('subUsername');
  const superUsername = queryParams.get('superUsername');
  const userid = queryParams.get('userid');

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

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const openCreateModal = (date) => {
    setSelectedDate(formatDate(date || new Date()));
    console.log(formatDate(date));
    console.log(selectedDate," i am hereeeee");
    setIsCreateModalVisible(true);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar
        toggleSidebar={toggleSidebar}
        subUsername={subUsername}
        superUsername={superUsername}
        userid={userid}
      />
      <div className={`flex-grow flex ${isSidebarOpen ? 'mr-[250px]' : ''}`}>
        <Calendar1 onDateClick={openCreateModal} isToday={isToday} />

        {superUsername === 'admin' ? (
          <AdminSideBar
            isOpen={isSidebarOpen}
            onUpdate={handleUpdate}
            selectedDate={selectedDate}
            subUsername={subUsername}
            superUsername={superUsername}
            userid={userid}
          />
        ) : (
          <RightSideBar
            isOpen={isSidebarOpen}
            onUpdate={handleUpdate}
            selectedDate={selectedDate}
            subUsername={subUsername}
            superUsername={superUsername}
            userid={userid}
          />
        )}
      </div>

      {superUsername === 'admin' ? (
        <AdminEventModal
          isVisible={isCreateModalVisible}
          onClose={handleCloseCreateModal}
          selectedDate={selectedDate}
          userid={userid}
        />
      ) : (
        <CalendarEventModal
          isVisible={isCreateModalVisible}
          onClose={handleCloseCreateModal}
          selectedDate={selectedDate}
          userid={userid}
        />
      )}

      <UpdateEventModal
        isVisible={isUpdateModalVisible}
        onClose={handleCloseUpdateModal}
        eventDetails={selectedEvent}
        subUsername={subUsername}
        superUsername={superUsername}
        userid={userid}
      />
    </div>
  );
};

export default ParentComponent;
