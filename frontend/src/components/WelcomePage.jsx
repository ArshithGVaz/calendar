import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import screenshot from '../assets/lightblue.jpg';

const WelcomePage = () => {
  const { username } = useParams();  // Get superUsername (the logged-in user) from URL params
  const location = useLocation();  // Access location object to retrieve query parameters
  const navigate = useNavigate();

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
    console.log(username);  // Logged-in (super-user) username for debugging
    fetchSupervisedUsers();
  }, [userid]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mt-8">Welcome, {username}!</h1>

      {/* Log the number of users */}
      {console.log('Total Users (including main user):', users.length + 1)}

      {/* Grid of rectangles for users */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 w-full max-w-5xl overflow-y-auto">
        
        {/* Sub-users' rectangles */}
        {users.map((user) => (
          <button 
            onClick={() => navigate(`/calendar/${user.username}?userid=${user.userid}&superUsername=${username}&subUsername=${user.username}`)} 
            key={user.userid}
          >
            <div 
              className="flex items-center justify-center text-black font-bold rounded-md shadow-lg relative h-20"
              style={{
                backgroundColor: 'blue', 
                width: '100%', 
                height: '20%',
                position: 'relative'
              }}
            >
              <img src={screenshot} alt="Calendar Screenshot" className="w-full h-40 rounded-md" />
              <span className="absolute">
                Sub-User: {user.username} (ID: {user.userid})
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;
