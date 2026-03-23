import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import SalesBarChart from '../components/SalesBarChart';
import TopProducts from '../components/TopProducts';
import WeeklySalesChart from '../components/WeeklySalesChart';
import WeeklyUserChart from '../components/WeeklyUserChart';
import { 
    FaShoppingCart, FaCartPlus, FaCheckCircle, FaUtensils, 
    FaMotorcycle, FaTruck, FaTimesCircle, FaUsers, 
    FaCoins, FaCalendarWeek, FaCalendarAlt, FaCalendar, 
    FaList, FaHeart, FaStar, FaBell 
} from 'react-icons/fa';

const BASE_URL = 'http://127.0.0.1:8000/api';

const AdminDashboard = () => {
    const adminUser = localStorage.getItem('adminUser');
    const navigate = useNavigate();
    const [metrics, setMetrics] = useState({});

    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }

        // null check — 'null' string bhi handle karo
        const rid = localStorage.getItem('restaurantId');
        const validRid = rid && rid !== 'null' ? rid : null;
        const url = validRid
            ? `${BASE_URL}/dashboard_metrics/?restaurant_id=${validRid}`
            : `${BASE_URL}/dashboard_metrics/`;

        fetch(url)
            .then(res => res.json())
            .then(data => setMetrics(data));

    }, [adminUser, navigate]);

    const cardData = [
        { title: 'Total Orders', key: 'total_orders', color: '#3b82f6', icon: <FaShoppingCart /> },
        { title: 'New Orders', key: 'new_orders', color: '#6366f1', icon: <FaCartPlus /> },
        { title: 'Confirmed Orders', key: 'confirmed_orders', color: '#06b6d4', icon: <FaCheckCircle /> },
        { title: 'Food Preparing', key: 'food_preparing', color: '#f59e0b', icon: <FaUtensils /> },
        { title: 'Food Pickup', key: 'food_pickup', color: '#64748b', icon: <FaMotorcycle /> },
        { title: 'Food Delivered', key: 'food_delivered', color: '#10b981', icon: <FaTruck /> },
        { title: 'Cancelled Orders', key: 'cancelled_orders', color: '#ef4444', icon: <FaTimesCircle /> },
        { title: 'Total Users', key: 'total_users', color: '#8b5cf6', icon: <FaUsers /> },
        { title: "Today's Sales", key: 'today_sales', color: '#0ea5e9', icon: <FaCoins />, isCash: true },
        { title: "Weekly Sales", key: 'week_sales', color: '#ec4899', icon: <FaCalendarWeek />, isCash: true },
        { title: "Monthly Sales", key: 'month_sales', color: '#1e293b', icon: <FaCalendarAlt />, isCash: true },
        { title: "Yearly Sales", key: 'year_sales', color: '#059669', icon: <FaCalendar />, isCash: true },
        { title: 'Categories', key: 'total_categories', color: '#f97316', icon: <FaList /> },
        { title: 'Wishlists', key: 'total_wishlists', color: '#f43f5e', icon: <FaHeart /> },
        { title: 'Reviews', key: 'total_reviews', color: '#6366f1', icon: <FaStar /> },
    ];

    return (
        <AdminLayout>
            <div className="dashboard-wrapper p-4" style={{backgroundColor: '#f8fafc', minHeight: '100vh'}}>
                
                <div className="mb-4">
                    <h3 className="fw-bold text-dark mb-1">Business Overview</h3>
                    <p className="text-muted small">Welcome back, Admin! Here is what's happening today.</p>
                </div>

                <div className="row g-3">
                    {cardData.map((item, i) => (
                        <div className="col-xl-3 col-lg-4 col-md-6" key={i}>
                            <div className="dashboard-card shadow-sm border-0 card h-100">
                                <div className="card-body d-flex align-items-center">
                                    <div className="icon-box" style={{backgroundColor: `${item.color}15`, color: item.color}}>
                                        {item.icon}
                                    </div>
                                    <div className="ms-3">
                                        <p className="text-muted small fw-bold mb-0 text-uppercase" style={{letterSpacing: '0.5px'}}>
                                            {item.title}
                                        </p>
                                        <h3 className="fw-bold mb-0" style={{color: '#1e293b'}}>
                                            {item.isCash ? `₹${metrics[item.key] || 0}` : metrics[item.key] || 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="col-xl-3 col-lg-4 col-md-6">
                        <div className="card h-100 border-0 shadow-sm d-flex flex-row align-items-center p-3" style={{background: 'linear-gradient(45deg, #ef4444, #b91c1c)', color: '#fff'}}>
                            <FaBell className="me-3" size={30} />
                            <div>
                                <p className="mb-0 fw-bold">Food Ordering</p>
                                <small className="opacity-75">System Live & Secure</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4 g-4">
                    <div className="col-lg-6">
                        <div className="chart-container bg-white p-4 shadow-sm rounded-4 border">
                            <h6 className="fw-bold mb-4 border-bottom pb-2">Sales Analytics</h6>
                            <SalesBarChart />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="chart-container bg-white p-4 shadow-sm rounded-4 border">
                            <h6 className="fw-bold mb-4 border-bottom pb-2">Top Selling Products</h6>
                            <TopProducts />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="chart-container bg-white p-4 shadow-sm rounded-4 border">
                            <h6 className="fw-bold mb-4 border-bottom pb-2">Weekly Performance</h6>
                            <WeeklySalesChart />
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="chart-container bg-white p-4 shadow-sm rounded-4 border">
                            <h6 className="fw-bold mb-4 border-bottom pb-2">User Growth</h6>
                            <WeeklyUserChart />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-card {
                    transition: all 0.3s ease;
                    border-radius: 15px;
                    background: #fff;
                }
                .dashboard-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                }
                .icon-box {
                    width: 50px;
                    height: 50px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                }
                .chart-container { border-radius: 16px !important; }
                .rounded-4 { border-radius: 1rem !important; }
            `}</style>
        </AdminLayout>
    );
};

export default AdminDashboard;