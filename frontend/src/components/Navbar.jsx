import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  // Retrieve the user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center z-50">
      <h1 className="text-lg font-bold">My Calendar App</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">About</a></li>
          <li><a href="#" className="hover:underline">Contact</a></li>
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
