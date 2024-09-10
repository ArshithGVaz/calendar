import React from 'react';

const Navbar = ({ toggleSidebar, subUsername, superUsername, userid }) => {
  // Retrieve the user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("Speaking from Navba,",userid)
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-50">
      <h1 className="text-lg font-bold">My Calendar App</h1>
      <nav>
        <ul className="flex space-x-4">
          {/* Display sub-username, super-username, and userid */}
          {subUsername && <li className="font-bold">Sub: {subUsername}</li>}
          {superUsername && <li className="font-bold">Super: {superUsername}</li>}
        </ul>
      </nav>
      <div className="flex items-center">
        {/* Display the Google Profile image */}
        {user && (
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-full w-8 h-8 mr-4"
          />
        )}
        <button onClick={toggleSidebar} className="burger-icon ml-4">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;
