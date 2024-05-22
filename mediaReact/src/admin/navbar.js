import React, { useState } from 'react';
import { Link, Outlet, useLocation,useNavigate } from 'react-router-dom';
// import { useHistory } from 'react-router-dom';
// import '../App.css';

function Navbar() {
  const navigate = useNavigate();

  const name=sessionStorage.getItem('username');
    const [dropdownOpen, setDropdownOpen] = useState(false);
  // const history = useHistory();

  const handleLogout = () => {
    sessionStorage.setItem('mySessionData', false);
    navigate('/admin');
    // Perform any necessary logout actions (e.g., clearing session, removing tokens, etc.)
    // ...
    // After the logout actions are performed, redirect the user to the login page
    // history.push('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
      <h2 className="navbar-brand ps-3">Admin Panel</h2>
      <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!">
        <i className="fas fa-bars"></i>
      </button>
      <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
        <div className="input-group">
          &nbsp;
        </div>
      </form>
      <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
        <li className={`nav-item dropdown ${dropdownOpen ? 'show' : ''}`}>
          <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" onClick={toggleDropdown} aria-expanded={dropdownOpen}>
            <i className="fas fa-user fa-fw"></i>
          </a>
          <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} aria-labelledby="navbarDropdown">
            <li>
              <a className="dropdown-item" href="change-password.php">
                Change Password
              </a>
            </li>
            <li>
              <button className="dropdown-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Logout
              </button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
