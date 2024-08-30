import React, { useState } from 'react';
import Calendar1 from './cal';
import RightSideBar from './RightSideBar';
import Navbar from './Navbar';
import UpdateEventModal from './UpdateEventModal';
import CalendarEventModal from './CalendarEventModal';  // This is the correct import

const ParentComponent = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

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
    setSelectedDate(date || new Date());
    setIsCreateModalVisible(true);
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={`flex-grow flex transition-all duration-300 ${isSidebarOpen ? 'mr-[250px]' : ''}`}>
        <Calendar1 onDateClick={openCreateModal} />
        <RightSideBar isOpen={isSidebarOpen} onUpdate={handleUpdate} />
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
      />
    </div>
  );
};

export default ParentComponent;
