import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaTruck, FaWarehouse, FaUser } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';


const UserDropdown = ({ user }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      window.location.href = '/login'; // or navigate('/login')
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="mt-auto pt-4 text-white-50 small position-relative" ref={dropdownRef}>
      <div
        onClick={() => setOpen(!open)}
        className="d-flex align-items-center text-white"
        style={{ fontSize: '20px', fontFamily: 'Arial', cursor: 'pointer' }} // 👈 cursor added here
      >
        <FaUser className="me-2" />
        {user ? user.user_Username : 'User Name'}
      </div>
      <hr className="bg-white" />

      {open && (
      <div
        className="bg-white text-dark rounded shadow-sm mb-2"
        style={{
          position: 'absolute',
          left: 0,
          bottom: '100%', // 👈 this moves it above
          zIndex: 1000,
        }}
      >
      <button
        onClick={handleLogout}
        className="w-100 text-start px-3 py-2 border-0 bg-white text-dark"
        style={{
          fontSize: '18px',
          fontFamily: 'Arial',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  )}
</div>
  );
};


const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth(); // Get user from context

  return (
    <div className="sidebar d-flex flex-column p-3" style={{background: '#25877b', minHeight: '100vh', width: 280 }}>
      <div className="mb-4">
        <span className="fs-4 fw-bold text-white">MarketTrack</span>
      </div>
      <p>

      </p>
      <Link style={{fontSize: '18px', FontFamily: 'Arial'}} className={`nav-link text-white mb-2, active: ''}`} to="/">
        <FaTachometerAlt className="me-2" /> Dashboard
      </Link>
      <p>

      </p>     
      <Link style={{fontSize: '18px', FontFamily: 'Arial'}} className="nav-link text-white mb-2" to="/products">
        <FaBoxOpen className="me-2" /> Product Management
      </Link>
      <p>

      </p>  
      <Link style={{fontSize: '18px', FontFamily: 'Arial'}} className="nav-link text-white mb-2" to="/orders">
        <FaClipboardList className="me-2" /> Purchase Order
      </Link>
      <p>

      </p>  
      <Link style={{fontSize: '18px', FontFamily: 'Arial'}} className="nav-link text-white mb-2" to="/suppliers">
        <FaTruck className="me-2" /> Suppliers
      </Link>
      <p>

      </p>  
      <Link style={{fontSize: '18px', FontFamily: 'Arial'}} className="nav-link text-white mb-2" to="/stock">
        <FaWarehouse className="me-2" /> Stock Management
      </Link>
      <p>

      </p>  

      <Link style={{fontSize: '18px', FontFamily: 'Arial'}} className="nav-link text-white mb-2" to="/users">
        <FaUser className="me-2" /> Account Management
      </Link>

      <UserDropdown user={user} />

    </div>
  );
};

export default Sidebar;