import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBus, 
  FaCalendarAlt, 
  FaQuestionCircle 
} from 'react-icons/fa';
import './BottomNavbar.css';

const BottomNavbar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Home',
      icon: <FaHome />
    },
    {
      path: '/dashboard/schedules',
      name: 'Schedules',
      icon: <FaBus />
    },
    {
      path: '/dashboard/events',
      name: 'Events',
      icon: <FaCalendarAlt />
    },
    {
      path: '/dashboard/support',
      name: 'Support',
      icon: <FaQuestionCircle />
    }
  ];

  return (
    <div className="bottom-navbar d-lg-none">
      {menuItems.map((item, index) => (
        <Link 
          key={index} 
          to={item.path} 
          className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <div className="bottom-nav-icon">{item.icon}</div>
          <div className="bottom-nav-text">{item.name}</div>
        </Link>
      ))}
    </div>
  );
};

export default BottomNavbar;
