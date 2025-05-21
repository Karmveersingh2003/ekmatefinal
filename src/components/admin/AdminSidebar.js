import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { 
  FaTimes, 
  FaHome, 
  FaBus, 
  FaUsers, 
  FaUserTie, 
  FaCalendarAlt, 
  FaComments, 
  FaTools, 
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminSidebar.css';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { logout, currentUser } = useAuth();

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: <FaHome />
    },
    {
      path: '/admin/buses',
      name: 'Manage Buses',
      icon: <FaBus />
    },
    {
      path: '/admin/drivers',
      name: 'Manage Drivers',
      icon: <FaUserTie />
    },
    {
      path: '/admin/users',
      name: 'Manage Users',
      icon: <FaUsers />
    },
    {
      path: '/admin/events',
      name: 'Manage Events',
      icon: <FaCalendarAlt />
    },
    {
      path: '/admin/feedback',
      name: 'Feedback',
      icon: <FaComments />
    },
    {
      path: '/admin/maintenance',
      name: 'Maintenance',
      icon: <FaTools />
    },
    {
      path: '/admin/analytics',
      name: 'Analytics',
      icon: <FaChartLine />
    }
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">EKmate Admin</h3>
        <Button 
          variant="link" 
          className="close-sidebar d-md-none" 
          onClick={toggleSidebar}
        >
          <FaTimes />
        </Button>
      </div>

      <div className="admin-info">
        <div className="admin-avatar">
          {currentUser?.name?.charAt(0) || 'A'}
        </div>
        <div className="admin-details">
          <h5>{currentUser?.name || 'Admin User'}</h5>
          <p>{currentUser?.email || 'admin@example.com'}</p>
        </div>
      </div>

      <div className="sidebar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-menu-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-text">{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <Button 
          variant="outline-danger" 
          className="logout-btn" 
          onClick={handleLogout}
        >
          <FaSignOutAlt className="me-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
