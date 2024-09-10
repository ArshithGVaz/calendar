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
  const [selectedDate, setSelectedDate] = useState(null);  // Initially no date selected
  const [currentUserid, setCurrentUserid] = useState(null);  // Set userid when page loads

  const location = useLocation();

  // Extract subUsername, superUsername, and userid from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const subUsername = queryParams.get('subUsername');
  const superUsername = queryParams.get('superUsername');
  const userid = queryParams.get('userid');

  // Store userid at the beginning
  if (currentUserid === null) {
    setCurrentUserid(userid); // Set it only once when the page loads
  }

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

  // When a date is clicked in Calendar1, set both date and userid
  const openCreateModal = (date) => {
    setSelectedDate(date || new Date());  // Set the selected date
    setIsCreateModalVisible(true);        // Show the modal
  };

  return (
    <div className="relative flex flex-col min-h-screen">
      {/* Pass subUsername, superUsername, and currentUserid to Navbar */}
      <Navbar toggleSidebar={toggleSidebar} subUsername={subUsername} superUsername={superUsername} userid={currentUserid} />
      <div className={`flex-grow flex transition-all duration-300 ${isSidebarOpen ? 'mr-[250px]' : ''}`}>
        {/* Pass userid to Calendar1 */}
        <Calendar1 onDateClick={openCreateModal} userid={currentUserid} /> 
        {/* Pass selectedDate, subUsername, superUsername, and currentUserid to RightSideBar */}
        <RightSideBar 
          isOpen={isSidebarOpen} 
          onUpdate={handleUpdate} 
          selectedDate={selectedDate} 
          subUsername={subUsername} 
          superUsername={superUsername} 
          userid={currentUserid} 
        />
      </div>
      <UpdateEventModal
        isVisible={isUpdateModalVisible}
        onClose={handleCloseUpdateModal}
        eventDetails={selectedEvent}
        subUsername={subUsername}
        superUsername={superUsername}
        userid={currentUserid}  // Pass userid to UpdateEventModal, even though it's not initially needed
      />
      <CalendarEventModal
        isVisible={isCreateModalVisible}
        onClose={handleCloseCreateModal}
        selectedDate={selectedDate}
        userid={currentUserid}  // Pass both date and userid to CalendarEventModal
      />
    </div>
  );
};

export default ParentComponent;
