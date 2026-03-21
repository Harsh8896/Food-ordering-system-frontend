import React, { useEffect, useState } from 'react';
import RestaurantLayout from '../components/RestaurantLayout';

const BASE_URL = 'http://127.0.0.1:8000/api';

const RestaurantDashboard = () => {
  const restaurantId = localStorage.getItem('restaurantId');
  const restaurantName = localStorage.getItem('restaurantName');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/dashboard_metrics/`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const cards = [
    { title: 'Total Orders', value: stats?.total_orders || 0, color: 'primary' },
    { title: 'New Orders', value: stats?.new_orders || 0, color: 'warning' },
    { title: 'Delivered', value: stats?.food_delivered || 0, color: 'success' },
    { title: 'Cancelled', value: stats?.cancelled_orders || 0, color: 'danger' },
  ];

  return (
    <RestaurantLayout>
      <div className="mb-4">
        <h3 className="fw-bold">Welcome, {restaurantName}!</h3>
        <p className="text-muted">Restaurant ID: {restaurantId}</p>
      </div>

      <div className="row g-3">
        {cards.map((card, i) => (
          <div className="col-md-3" key={i}>
            <div className={`card border-0 shadow-sm text-white bg-${card.color}`}>
              <div className="card-body text-center">
                <h6 className="fw-bold">{card.title}</h6>
                <h2 className="fw-bold">{card.value}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card shadow-sm p-4 text-center" style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/restaurant-foods'}>
            <h5>🍔 Manage Menu</h5>
            <p className="text-muted small">Add, edit, delete food items</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-4 text-center" style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/restaurant-orders'}>
            <h5>📦 Manage Orders</h5>
            <p className="text-muted small">View and update order status</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm p-4 text-center" style={{ cursor: 'pointer' }}
            onClick={() => window.location.href = '/restaurant-categories'}>
            <h5>📋 Manage Categories</h5>
            <p className="text-muted small">Add and manage food categories</p>
          </div>
        </div>
      </div>
    </RestaurantLayout>
  );
};

export default RestaurantDashboard;