import React, { useEffect, useState } from 'react';

const Employee = () => {
  const [users, setUsers] = useState([]);  // State to store users
  const [newUser, setNewUser] = useState({ userid: '', username: '', email: '', super_user_id: '', password: '' });  // State for adding new users
  const [editUserId, setEditUserId] = useState(null);  // Track which user is being edited
  const [editedUser, setEditedUser] = useState(null);  // Store the changes for the edited user
  const [saveEnabled, setSaveEnabled] = useState(false);  // Control save button state

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userid) => {
    try {
      await fetch(`http://localhost:8000/api/users/${userid}`, { method: 'DELETE' });
      setUsers(users.filter(user => user.userid !== userid));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user.userid);  // Set the user ID that is being edited
    setEditedUser(user);  // Set the current values for editing
    setSaveEnabled(false);  // Disable the save button initially
  };

  const handleCancel = () => {
    setEditUserId(null);  // Exit edit mode
    setEditedUser(null);  // Clear edited values
  };

  const handleSave = async (userid) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });
      if (response.ok) {
        setUsers(users.map(user => (user.userid === userid ? editedUser : user)));
        setEditUserId(null);  // Exit edit mode after saving
        setEditedUser(null);
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
    setSaveEnabled(true);  // Enable save button when changes are made
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        // Call fetchUsers again to refresh the user list after adding a new user
        fetchUsers();
        setNewUser({ userid: '', username: '', email: '', super_user_id: '', password: '' });  // Reset the form after adding
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Participants</h1>
      <table className="table-auto border-collapse border border-gray-400 min-w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Super User ID</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userid}>
              {editUserId === user.userid ? (
                <>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="userid"
                      value={editedUser.userid}
                      disabled
                      className="border p-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="username"
                      value={editedUser.username}
                      onChange={handleInputChange}
                      className="border p-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="email"
                      name="email"
                      value={editedUser.email}
                      onChange={handleInputChange}
                      className="border p-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <input
                      type="text"
                      name="super_user_id"
                      value={editedUser.super_user_id}
                      onChange={handleInputChange}
                      className="border p-1"
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className={`text-green-500 mr-2 ${!saveEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => handleSave(user.userid)}
                      disabled={!saveEnabled}
                    >
                      Save
                    </button>
                    <button className="text-yellow-500 mr-2" onClick={handleCancel}>Cancel</button>
                    <button className="text-red-500" onClick={() => handleDelete(user.userid)}>Delete</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="border px-4 py-2">{user.userid}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.super_user_id}</td>
                  <td className="border px-4 py-2">
                    <button className="text-blue-500 mr-2" onClick={() => handleEdit(user)}>Edit</button>
                    <button className="text-red-500" onClick={() => handleDelete(user.userid)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Add New User</h2>
        <input
          type="text"
          placeholder="User ID"
          className="border p-2 mr-2"
          value={newUser.userid}
          onChange={(e) => setNewUser({ ...newUser, userid: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          className="border p-2 mr-2"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mr-2"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Super User ID"
          className="border p-2 mr-2"
          value={newUser.super_user_id}
          onChange={(e) => setNewUser({ ...newUser, super_user_id: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mr-2"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <button className="bg-green-500 text-white p-2" onClick={handleAddUser}>Add User</button>
      </div>
    </div>
  );
};

export default Employee;
