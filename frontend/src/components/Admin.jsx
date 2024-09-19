// Admin.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 font-bold text-xl border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1">
          <ul className="mt-4">
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate('/employee')}
            >
              Manage Participants
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate(`/welcome/admin?userid=1000`)}
            >
              Calendar
            </li>
            {/* Add more navigation items here */}
          </ul>
        </nav>
        <div
          className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
          onClick={() => navigate('/logout')}
        >
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Add Participant</h2>
            <p className="text-gray-700 mb-4">
              Manage and add new participants to the system.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              onClick={() => navigate('/employee')}
            >
              Add Participant
            </button>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Calendar</h2>
            <p className="text-gray-700 mb-4">
              View and manage events on the calendar.
            </p>
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/welcome/admin?userid=1000`)}
            >
              View Calendar
            </button>
          </div>
          {/* Add more cards for other functionalities */}
        </div>
      </main>
    </div>
  );
};

export default Admin;
