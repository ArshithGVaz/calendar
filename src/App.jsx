// src/App.jsx

import React from "react";
import Navbar from "./components/Navbar";
import RightSideBar from "./components/RightSideBar";
import Calendar from "./components/calendar";
import Calendar1 from "./components/cal";

const App = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Navbar fixed at the top */}
      <Navbar />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Calendar and Right Sidebar Container */}
        {/* <div className="flex flex-1 overflow-y-auto">
          <div className="flex-1 flex items-center justify-center bg-gray-100 mt-64"> */}
            <Calendar1 />
          </div>
          <RightSideBar />
        </div>
    //   </div>
    // </div>
  );
};

export default App;
