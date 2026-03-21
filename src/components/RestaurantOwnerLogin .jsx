import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaLock, FaEnvelope } from 'react-icons/fa';

const RestaurantOwnerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/restaurant-owner-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.status === 200) {
        // localStorage mein save karo
        localStorage.setItem('restaurantId', data.restaurant_id);
        localStorage.setItem('restaurantName', data.restaurant_name);
        localStorage.setItem('ownerEmail', data.owner_email);

        toast.success(`Welcome, ${data.restaurant_name}!`);
        setTimeout(() => {
          navigate('/restaurant-dashboard');
        }, 1500);
      } else {
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '420px' }}>

        <div className="text-center mb-4">
          <div className="bg-dark rounded-3 p-2 d-inline-block mb-2">
            <FaUtensils className="text-warning" size={28} />
          </div>
          <h4 className="fw-bold mb-0">Restaurant Owner Login</h4>
          <p className="text-muted small">Access your restaurant dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaEnvelope className="me-2" /> Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="owner@restaurant.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <FaLock className="me-2" /> Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 btn-lg"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

      </div>
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
};

export default RestaurantOwnerLogin;