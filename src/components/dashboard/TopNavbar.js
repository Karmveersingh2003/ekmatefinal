import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeToggle from '../common/ThemeToggle';
import './TopNavbar.css';

const TopNavbar = ({ toggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const { darkMode } = useTheme();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Bus #102 will be delayed by 10 minutes',
      time: '5 minutes ago',
      read: false
    },
    {
      id: 2,
      message: 'New event: College Annual Day on 15th May',
      time: '1 hour ago',
      read: false
    },
    {
      id: 3,
      message: 'Your seat reservation has been confirmed',
      time: '2 hours ago',
      read: true
    }
  ]);

  const profileDropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <button className={`menu-toggle d-lg-none ${darkMode ? 'text-light' : ''}`} onClick={toggleSidebar}>
          <FaBars />
        </button>
        <div className={`navbar-brand d-lg-none ${darkMode ? 'text-light' : ''}`}>EKmate</div>
      </div>

      <div className="navbar-right">
        <ThemeToggle />
        <div className="notification-container" ref={notificationsRef}>
          <button
            className={`notification-button ${darkMode ? 'text-light' : ''}`}
            onClick={toggleNotifications}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h6>Notifications</h6>
                {unreadCount > 0 && (
                  <button className="mark-read-button" onClick={markAllAsRead}>
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                    >
                      <div className="notification-content">
                        <p className="notification-message">{notification.message}</p>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">
                    No notifications
                  </div>
                )}
              </div>

              <div className="notification-footer">
                <Link to="/dashboard/notifications" className="view-all-link">
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="profile-container" ref={profileDropdownRef}>
          <button
            className="profile-button"
            onClick={toggleProfileDropdown}
          >
            <div className="profile-avatar">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <FaUser />}
            </div>
          </button>

          {showProfileDropdown && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <h6>{currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0].split('.')[0] : 'Guest')}</h6>
                <p>{currentUser?.email || ''}</p>
              </div>

              <div className="profile-menu">
                <Link to="/dashboard/profile" className="profile-item">
                  <FaUser className="profile-icon" />
                  <span>My Profile</span>
                </Link>
                <Link to="/dashboard/settings" className="profile-item">
                  <FaCog className="profile-icon" />
                  <span>Settings</span>
                </Link>
                <button className="profile-item logout" onClick={handleLogout}>
                  <FaSignOutAlt className="profile-icon" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
