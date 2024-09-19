import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userid = queryParams.get('userid');

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error handling

  useEffect(() => {
    const fetchSupervisedUsers = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/supervised/${userid}`);
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError('Failed to fetch supervised users.');
        }
      } catch (error) {
        setError('An error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisedUsers();
  }, [userid]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-xl font-semibold text-gray-800">
            {/* Replace with your logo if available */}
            Your App Logo
          </div>
          <div className="flex items-center">
            <span className="text-gray-600 mr-4">Welcome, {username}</span>
            <button
              onClick={() => navigate('/')}
              className="text-red-500 hover:text-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        {/* Welcome Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">Welcome, {username}!</h1>
          <p className="text-gray-600 mt-2">
            Here are your supervised users. Click on a user to view their calendar.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
            <span className="ml-4 text-gray-600">Loading users...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}

        {/* Users Grid */}
        {!loading && !error && (
          <>
            {users.length > 0 ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {users.map((user) => (
                  <div
                    key={user.userid}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
                    onClick={() =>
                      navigate(
                        `/calendar/${user.username}?userid=${user.userid}&superUsername=${username}&subUsername=${user.username}`
                      )
                    }
                  >
                    <div className="p-6 text-center cursor-pointer">
                      {/* User Avatar */}
                      <div className="mx-auto h-24 w-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      {/* User Information */}
                      <h2 className="mt-4 text-xl font-semibold text-gray-800">
                        {user.username}
                      </h2>
                      <p className="text-gray-600">ID: {user.userid}</p>
                      {/* View Calendar Button */}
                      <button
                        className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent event bubbling
                          navigate(
                            `/calendar/${user.username}?userid=${user.userid}&superUsername=${username}&subUsername=${user.username}`
                          );
                        }}
                      >
                        View Calendar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600">
                <p>No supervised users found.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default WelcomePage;
