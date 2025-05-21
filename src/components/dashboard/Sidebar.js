import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBus,
  FaCalendarAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaComments,
  FaCog
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <FaHome />
    },
    {
      path: '/dashboard/schedules',
      name: 'Bus Schedules',
      icon: <FaBus />
    },
    {
      path: '/dashboard/track',
      name: 'Track Bus',
      icon: <FaMapMarkerAlt />
    },
    {
      path: '/dashboard/events',
      name: 'Events',
      icon: <FaCalendarAlt />
    },
    {
      path: '/dashboard/feedback',
      name: 'Feedback',
      icon: <FaComments />
    },
    {
      path: '/dashboard/preferences',
      name: 'Preferences',
      icon: <FaCog />
    },
    {
      path: '/dashboard/support',
      name: 'Help & Support',
      icon: <FaQuestionCircle />
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h3>EKmate</h3>
        <button className="close-sidebar d-lg-none" onClick={toggleSidebar}>
          &times;
        </button>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => window.innerWidth < 992 && toggleSidebar()}
          >
            <div className="sidebar-icon">{item.icon}</div>
            <div className="sidebar-text">{item.name}</div>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
