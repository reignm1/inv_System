import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaTruck, FaWarehouse, FaUser} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

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
      <div className="mt-auto pt-4 text-white-50 small">
        <div style={{fontSize: '20px', FontFamily: 'Arial'}} className="d-flex align-items-center">
          <FaUser scale={1.5} className="me-2" />
          {user ? user.user_Username : 'User Name'}
        </div>
        <hr className="bg-white" />
      </div>
    </div>
  );
};

export default Sidebar;