import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

// Function to generate random color
const generateRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const WelcomePage = () => {
  const { username } = useParams();  // Get username from URL params
  const location = useLocation();  // Access location object to retrieve query parameters

  // Extract userid from query parameters
  const queryParams = new URLSearchParams(location.search);
  const userid = queryParams.get('userid');  // Get userid from query parameters

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchSupervisedUsers = async () => {
      try {
        console.log(`Fetching supervised users for: ${userid}`);  // Use userid for the request
        const response = await fetch(`http://localhost:8000/api/supervised/${userid}`);
        const data = await response.json();
        if (data.success) {
          console.log('Supervised Users Data:', data.users);
          setUsers(data.users);
        } else {
          console.error('Failed to fetch supervised users:', data.message);
        }
      } catch (error) {
        console.error('Error fetching supervised users:', error);
      }
    };

    fetchSupervisedUsers();
  }, [userid]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">Welcome, {username}!</h1>

      {/* Log the number of users */}
      {console.log('Total Users (including main user):', users.length + 1)}

      {/* Grid of rectangles for users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 w-full max-w-5xl overflow-y-auto" style={{ position: 'relative' }}>
        {/* The logged-in user's rectangle */}
        <div 
          key={userid}  // Use userid as the key
          className="flex items-center justify-center text-white font-bold rounded-md shadow-lg relative"
          style={{
            backgroundColor: generateRandomColor(),
            width: '100%',  // Takes full width of the grid column
            paddingBottom: '56.25%',  // Ensures 16:9 aspect ratio
            position: 'relative'
          }}
        >
          <span className="absolute">User: {username}</span>
        </div>

        {/* Sub-users' rectangles */}
        {users.map((user) => (
          <div 
            key={user.userid} 
            className="flex items-center justify-center text-white font-bold rounded-md shadow-lg relative"
            style={{
              backgroundColor: generateRandomColor(),
              width: '100%',  // Ensures it takes up the full width available
              paddingBottom: '56.25%',  // 16:9 aspect ratio
              position: 'relative'
            }}
          >
            <span className="absolute">Sub-User: {user.userid}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
