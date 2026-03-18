import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SuperAdminSidebar from './SuperAdminSidebar';
import StatCard from './StatCard';
import RestaurantListTable from './RestaurantListTable';
import RestaurantOnboardingForm from './RestaurantOnboardingForm';
import CredentialsManagement from './CredentialsManagement';
import SystemSettings from './SystemSettings';
import '../../styles/superadmin.css';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: "The Golden Fork",
      owner_email: "owner@goldfork.com",
      location: "New York, NY",
      subscription_plan: "Premium",
      status: "active",
      created_date: "2024-01-15",
      revenue: "$4,250"
    },
    {
      id: 2,
      name: "Pizza Paradise",
      owner_email: "owner@pizzaparadise.com",
      location: "Los Angeles, CA",
      subscription_plan: "Standard",
      status: "active",
      created_date: "2024-02-20",
      revenue: "$2,150"
    },
    {
      id: 3,
      name: "Asian Flavors",
      owner_email: "owner@asianflavors.com",
      location: "Chicago, IL",
      subscription_plan: "Basic",
      status: "suspended",
      created_date: "2024-03-10",
      revenue: "$1,300"
    }
  ]);

  const [dashboardStats] = useState({
    totalRestaurants: 48,
    activeSubscriptions: 42,
    platformRevenue: '$125,430',
    systemHealth: '98.5%',
  });

  const handleAddRestaurant = (formData) => {
    const newRestaurant = {
      id: Math.max(...restaurants.map(r => r.id), 0) + 1,
      ...formData,
      status: 'active',
      created_date: new Date().toISOString().split('T')[0],
      revenue: '$0',
    };
    setRestaurants([...restaurants, newRestaurant]);
    setShowOnboardingModal(false);
  };

  const handleEditRestaurant = (id, updatedData) => {
    setRestaurants(
      restaurants.map(r => (r.id === id ? { ...r, ...updatedData } : r))
    );
  };

  const handleDeleteRestaurant = (id) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  const handleSuspendRestaurant = (id) => {
    setRestaurants(
      restaurants.map(r =>
        r.id === id ? { ...r, status: r.status === 'active' ? 'suspended' : 'active' } : r
      )
    );
  };

  return (
    <div className="super-admin-dashboard">
      <Row className="g-0">
        <Col md={2} className="sidebar-wrapper">
          <SuperAdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </Col>
        <Col md={10} className="main-content-wrapper">
          <div className="main-content">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="dashboard-section">
                <div className="section-header">
                  <h1>Super Admin Dashboard</h1>
                  <p>Welcome back, Platform Manager</p>
                </div>

                {/* Stat Cards */}
                <div className="stats-grid">
                  <StatCard
                    title="Total Restaurants"
                    value={dashboardStats.totalRestaurants}
                    icon="🏢"
                    color="primary"
                    trend="+12% this month"
                  />
                  <StatCard
                    title="Active Subscriptions"
                    value={dashboardStats.activeSubscriptions}
                    icon="✓"
                    color="success"
                    trend="+8% this month"
                  />
                  <StatCard
                    title="Platform Revenue"
                    value={dashboardStats.platformRevenue}
                    icon="💰"
                    color="warning"
                    trend="+23% this month"
                  />
                  <StatCard
                    title="System Health"
                    value={dashboardStats.systemHealth}
                    icon="⚡"
                    color="info"
                    trend="Stable"
                  />
                </div>

                {/* Restaurants List */}
                <div className="restaurants-section mt-5">
                  <div className="section-header-inline">
                    <h2>Registered Restaurants</h2>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setShowOnboardingModal(true)}
                    >
                      + Add New Restaurant
                    </button>
                  </div>
                  <RestaurantListTable
                    restaurants={restaurants}
                    onEdit={handleEditRestaurant}
                    onDelete={handleDeleteRestaurant}
                    onSuspend={handleSuspendRestaurant}
                  />
                </div>
              </div>
            )}

            {/* Restaurants Tab */}
            {activeTab === 'restaurants' && (
              <div className="restaurants-section">
                <div className="section-header">
                  <h1>Restaurant Management</h1>
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowOnboardingModal(true)}
                  >
                    + Add New Restaurant
                  </button>
                </div>
                <RestaurantListTable
                  restaurants={restaurants}
                  onEdit={handleEditRestaurant}
                  onDelete={handleDeleteRestaurant}
                  onSuspend={handleSuspendRestaurant}
                />
              </div>
            )}

            {/* Credentials Tab */}
            {activeTab === 'credentials' && (
              <div className="credentials-section">
                <div className="section-header">
                  <h1>Credentials Management</h1>
                </div>
                <CredentialsManagement restaurants={restaurants} />
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="settings-section">
                <div className="section-header">
                  <h1>System Settings</h1>
                </div>
                <SystemSettings />
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Restaurant Onboarding Modal */}
      <RestaurantOnboardingForm
        show={showOnboardingModal}
        onHide={() => setShowOnboardingModal(false)}
        onSubmit={handleAddRestaurant}
      />
    </div>
  );
};

export default SuperAdminDashboard;
