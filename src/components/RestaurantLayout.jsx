import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUtensils, FaSignOutAlt } from 'react-icons/fa';

const RestaurantLayout = ({ children }) => {
  const navigate = useNavigate();
  const restaurantName = localStorage.getItem('restaurantName');
  const restaurantId = localStorage.getItem('restaurantId');

  useEffect(() => {
    if (!restaurantId) {
      navigate('/restaurant-login');
    }
  }, [restaurantId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('restaurantId');
    localStorage.removeItem('restaurantName');
    localStorage.removeItem('ownerEmail');
    navigate('/restaurant-login');
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <FaUtensils className="text-warning" />
          <span className="text-white fw-bold">{restaurantName}</span>
          <span className="badge bg-warning text-dark ms-2">Owner Panel</span>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          <FaSignOutAlt className="me-1" /> Logout
        </button>
      </nav>

      {/* Content */}
      <div className="container-fluid mt-4">
        {children}
      </div>
    </div>
  );
};

export default RestaurantLayout;