import React from 'react';
import './Navbar.css'; // Make sure to import the CSS file

const Navbar = ({ toggleSidebar, subUsername, superUsername, userid }) => {
  // Retrieve the user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h1 className="brand">My Calendar App</h1>
      </div>
      <div className="navbar-center">
        <nav>
          <ul className="nav-links">
            {subUsername && <li className="nav-item">{subUsername}</li>}
            {superUsername && <li className="nav-item">({superUsername})</li>}
          </ul>
        </nav>
      </div>
      <div className="navbar-right">
        {user && (
          <img
            src={user.picture}
            alt="Profile"
            className="profile-picture"
          />
        )}
        <button onClick={toggleSidebar} className="burger-icon">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;
