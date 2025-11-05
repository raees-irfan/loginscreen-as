import React, { useEffect, useMemo } from 'react';
import './DashboardContent.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../store/slices/authSlice';


const DashboardContent = ({ user: propUser }) => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const user = propUser || authUser;

  const allUsers = useSelector((state) => state.auth.allUsers);
  const isUsersLoading = useSelector((state) => state.auth.isUsersLoading);

  const userName = user?.name || 'User';
  const role = user?.role === 'admin' ? 'Admin' : 'User';

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(fetchAllUsers());
    }
  }, [dispatch, user]);

  const activeUsersCount = useMemo(() => {
    if (user?.role === 'admin') {
      return Array.isArray(allUsers) ? allUsers.length : 0;
    }
    return 1;
  }, [user, allUsers]);

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2 className="dashboard-title">{role} Dashboard</h2>
        <p className="dashboard-welcome">
          Welcome back, {userName}. Here's what's happening today.
        </p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Active Users</h3>
            <svg
              className="card-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <div className="card-value">
            {isUsersLoading && user?.role === 'admin' ? '...' : activeUsersCount}
          </div>
          <div className="card-trend">
            <span className="trend-up">12%</span>
            <span className="trend-text">vs last month</span>
          </div>
        </div>

        <div className="dashboard-card empty"></div>
      </div>

      <div className="active-projects-section">
        <div className="section-header">
          <h3 className="section-title">Active Users</h3>
          <a href="#" className="view-all-link">
            View All
          </a>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

