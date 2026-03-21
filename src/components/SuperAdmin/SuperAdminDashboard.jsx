import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Badge, Button, ButtonGroup } from 'react-bootstrap';
import SuperAdminSidebar from './SuperAdminSidebar';
import StatCard from './StatCard';
import RestaurantListTable from './RestaurantListTable';
import RestaurantOnboardingForm from './RestaurantOnboardingForm';
import CredentialsManagement from './CredentialsManagement';
import SystemSettings from './SystemSettings';
import PlatformOverviewChart from './PlatformOverviewChart';
import '../../styles/superadmin.css';

const BASE_URL = 'http://127.0.0.1:8000/api';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subFilter, setSubFilter] = useState('all');

  const [dashboardStats] = useState({
    platformRevenue: '$125,430',
    systemHealth: '98.5%',
  });

  const fetchRestaurants = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/restaurants/`);
      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      console.error('Restaurants fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleAddRestaurant = async (formData) => {
    try {
      const res = await fetch(`${BASE_URL}/restaurants/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        fetchRestaurants();
        setShowOnboardingModal(false);
      }
    } catch (err) {
      console.error('Add restaurant error:', err);
    }
  };

  const handleEditRestaurant = async (id, updatedData) => {
    try {
      const res = await fetch(`${BASE_URL}/restaurants/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (res.ok) fetchRestaurants();
    } catch (err) {
      console.error('Edit restaurant error:', err);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/restaurants/${id}/`, {
        method: 'DELETE',
      });
      if (res.ok) fetchRestaurants();
    } catch (err) {
      console.error('Delete restaurant error:', err);
    }
  };

  const handleSuspendRestaurant = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/restaurants/${id}/suspend/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) fetchRestaurants();
    } catch (err) {
      console.error('Suspend restaurant error:', err);
    }
  };

  // Subscription status helper
  const getSubStatus = (daysLeft) => {
    if (daysLeft < 0) return 'overdue';
    if (daysLeft <= 7) return 'expiring';
    return 'active';
  };

  const filteredSubs = restaurants.filter(r => {
    if (subFilter === 'all') return true;
    return getSubStatus(r.days_left) === subFilter;
  });

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
                <div className="stats-grid">
                  <StatCard
                    title="Total Restaurants"
                    value={restaurants.length}
                    icon="🏢"
                    color="primary"
                    trend="+12% this month"
                  />
                  <StatCard
                    title="Active Subscriptions"
                    value={restaurants.filter(r => r.status === 'active').length}
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

                <PlatformOverviewChart />

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
                  {loading ? <p className="text-muted">Loading...</p> : (
                    <RestaurantListTable
                      restaurants={restaurants}
                      onEdit={handleEditRestaurant}
                      onDelete={handleDeleteRestaurant}
                      onSuspend={handleSuspendRestaurant}
                    />
                  )}
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
                {loading ? <p className="text-muted">Loading...</p> : (
                  <RestaurantListTable
                    restaurants={restaurants}
                    onEdit={handleEditRestaurant}
                    onDelete={handleDeleteRestaurant}
                    onSuspend={handleSuspendRestaurant}
                  />
                )}
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

            {/* Subscriptions Tab — inline, no separate component */}
            {activeTab === 'subscriptions' && (
              <div className="subscriptions-section">
                <div className="section-header">
                  <h1>Subscription Status</h1>
                  <p>Monitor restaurant subscription renewals</p>
                </div>

                <ButtonGroup size="sm" className="mb-3">
                  <Button
                    variant={subFilter === 'all' ? 'primary' : 'outline-primary'}
                    onClick={() => setSubFilter('all')}
                  >
                    All ({restaurants.length})
                  </Button>
                  <Button
                    variant={subFilter === 'active' ? 'success' : 'outline-success'}
                    onClick={() => setSubFilter('active')}
                  >
                    Active ({restaurants.filter(r => getSubStatus(r.days_left) === 'active').length})
                  </Button>
                  <Button
                    variant={subFilter === 'expiring' ? 'warning' : 'outline-warning'}
                    onClick={() => setSubFilter('expiring')}
                  >
                    Expiring ({restaurants.filter(r => getSubStatus(r.days_left) === 'expiring').length})
                  </Button>
                  <Button
                    variant={subFilter === 'overdue' ? 'danger' : 'outline-danger'}
                    onClick={() => setSubFilter('overdue')}
                  >
                    Overdue ({restaurants.filter(r => getSubStatus(r.days_left) === 'overdue').length})
                  </Button>
                </ButtonGroup>

                <div style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
                  <Table striped hover responsive>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th>Restaurant Name</th>
                        <th>Plan</th>
                        <th>Status</th>
                        <th>Days Left</th>
                        <th>Expiry Date</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubs.length > 0 ? filteredSubs.map(r => {
                        const status = getSubStatus(r.days_left);
                        const badgeColor = status === 'overdue' ? 'danger' : status === 'expiring' ? 'warning' : 'success';
                        return (
                          <tr key={r.id}>
                            <td className="fw-bold">{r.name}</td>
                            <td><Badge bg="info">{r.subscription_plan}</Badge></td>
                            <td>
                              <Badge bg={badgeColor} text={status === 'expiring' ? 'dark' : undefined}>
                                {status === 'overdue' ? 'Overdue' : status === 'expiring' ? 'Expiring Soon' : 'Active'}
                              </Badge>
                            </td>
                            <td style={{ color: r.days_left < 0 ? '#dc3545' : '#6c757d', fontWeight: 500 }}>
                              {r.days_left} days
                            </td>
                            <td>{r.subscription_expiry}</td>
                            <td style={{ textAlign: 'center' }}>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => alert(`Reminder sent to ${r.owner_email}`)}
                              >
                                Send Reminder
                              </Button>
                            </td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-4">
                            No restaurants found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </div>
            )}

          </div>
        </Col>
      </Row>

      <RestaurantOnboardingForm
        show={showOnboardingModal}
        onHide={() => setShowOnboardingModal(false)}
        onSubmit={handleAddRestaurant}
      />
    </div>
  );
};

export default SuperAdminDashboard;