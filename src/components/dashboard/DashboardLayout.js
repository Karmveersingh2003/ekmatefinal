import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import BottomNavbar from './BottomNavbar';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="dashboard-content">
        <TopNavbar toggleSidebar={toggleSidebar} />
        <main className="main-content">
          <Outlet />
        </main>
        <BottomNavbar />
      </div>
    </div>
  );
};

export default DashboardLayout;
