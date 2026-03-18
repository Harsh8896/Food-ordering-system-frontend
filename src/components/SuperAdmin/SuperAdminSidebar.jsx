import React from 'react';
import { Nav } from 'react-bootstrap';

const SuperAdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      id: 'restaurants',
      label: 'Restaurants',
      icon: '🏢',
    },
    {
      id: 'credentials',
      label: 'Credentials',
      icon: '🔐',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
    },
  ];

  return (
    <div className="super-admin-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span className="logo-icon">🍽️</span>
          <span className="logo-text">FoodSys</span>
        </div>
        <p className="sidebar-subtitle">Super Admin</p>
      </div>

      <Nav className="flex-column sidebar-nav">
        {menuItems.map(item => (
          <Nav.Link
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sidebar-nav-link ${activeTab === item.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      <div className="sidebar-footer">
        <div className="admin-info">
          <div className="admin-avatar">PA</div>
          <div className="admin-details">
            <p className="admin-name">Platform Admin</p>
            <p className="admin-email">admin@platform.com</p>
          </div>
        </div>
        <button className="btn btn-sm btn-outline-danger w-100 mt-3">
          Logout
        </button>
      </div>
    </div>
  );
};

export default SuperAdminSidebar;
