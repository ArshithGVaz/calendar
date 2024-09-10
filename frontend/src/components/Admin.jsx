import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="space-y-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/employee')}
        >
          Add Participant
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(`/welcome/admin?userid=1000`)}
        >
          CalenDar
        </button>
        {/* Add more buttons for other functionalities */}
      </div>
    </div>
  );
};

export default Admin;
