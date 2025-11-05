import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';
import DashboardContent from '../components/DashboardContent.jsx';
import ProjectsView from '../components/ProjectsView.jsx';
import UsersView from '../components/UsersView.jsx';
import SettingsView from '../components/SettingsView.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSidebarClick = (view) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'projects':
        return <ProjectsView />;
      case 'users':
        return <UsersView user={user} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardContent user={user} />;
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar user={user} onLogout={handleLogout} onNavClick={handleSidebarClick} activeView={activeView} />
      <div className="dashboard-main">
        <Header user={user} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

