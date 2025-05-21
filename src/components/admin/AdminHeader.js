import React from 'react';
import { Navbar, Button, Dropdown } from 'react-bootstrap';
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaUserEdit,
  FaBus,
  FaComments,
  FaTools
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminHeader.css';

const AdminHeader = ({ toggleSidebar }) => {
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Navbar className="admin-header">
      <Button
        variant="link"
        className="sidebar-toggle"
        onClick={toggleSidebar}
      >
        <FaBars />
      </Button>

      <div className="ms-auto d-flex align-items-center">
        <Dropdown align="end" className="me-3">
          <Dropdown.Toggle variant="link" id="notification-dropdown" className="notification-toggle">
            <FaBell />
            <span className="notification-badge">3</span>
          </Dropdown.Toggle>

          <Dropdown.Menu className="notification-menu">
            <div className="notification-header">
              <h6 className="mb-0">Notifications</h6>
              <Button variant="link" size="sm" className="p-0">Mark all as read</Button>
            </div>
            <Dropdown.Divider />
            <div className="notification-list">
              <Dropdown.Item className="notification-item unread">
                <div className="notification-icon bus">
                  <FaBus />
                </div>
                <div className="notification-content">
                  <p className="notification-text">New bus added to the system</p>
                  <span className="notification-time">2 hours ago</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="notification-item unread">
                <div className="notification-icon feedback">
                  <FaComments />
                </div>
                <div className="notification-content">
                  <p className="notification-text">New feedback received</p>
                  <span className="notification-time">5 hours ago</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item className="notification-item unread">
                <div className="notification-icon maintenance">
                  <FaTools />
                </div>
                <div className="notification-content">
                  <p className="notification-text">Maintenance scheduled for Bus #42</p>
                  <span className="notification-time">1 day ago</span>
                </div>
              </Dropdown.Item>
            </div>
            <Dropdown.Divider />
            <Dropdown.Item className="text-center view-all">
              View all notifications
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" id="user-dropdown" className="user-toggle">
            {currentUser?.profilePicture ? (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.name}
                className="user-avatar"
              />
            ) : (
              <FaUserCircle className="user-icon" />
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item>
              <FaUserCircle className="me-2" /> Profile
            </Dropdown.Item>
            <Dropdown.Item>
              <FaUserEdit className="me-2" /> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item>
              <FaCog className="me-2" /> Settings
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default AdminHeader;
