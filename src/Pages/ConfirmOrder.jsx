import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLayout from '../components/AdminLayout';

const ConfirmOrder = () => {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // API Fetch Function
    const fetchConfirmedOrders = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders-confirmed/'); // Apni base URL check kar lein
            if (!response.ok) {
                throw new Error('Data fetch karne mein dikkat aa rahi hai');
            }
            const data = await response.json();
            setConfirmedOrders(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfirmedOrders();
    }, []);

    return (
        <AdminLayout>
            <div className="container mt-5">
            <div className="order-card shadow-lg p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="text-primary fw-bold">Confirmed Orders ✅</h2>
                    <button className="btn btn-outline-primary btn-sm" onClick={fetchConfirmedOrders}>
                        Refresh Data
                    </button>
                </div>

                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2">Orders load ho rahe hain...</p>
                    </div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover custom-table align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {confirmedOrders.length > 0 ? (
                                    confirmedOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="fw-bold text-secondary">#{order.order_number}</td>
                                            <td>{new Date(order.order_time).toLocaleDateString()}</td>
                                            <td>
                                                <span className="badge bg-success">Confirmed</span>
                                            </td>
                                            <td className="text-center">
                                                <button className="btn btn-info btn-sm text-white shadow-sm">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted py-4">
                                            Abhi koi confirmed order nahi hai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                .order-card {
                    border-radius: 15px;
                    border: none;
                }
                .custom-table {
                    border-radius: 10px;
                    overflow: hidden;
                }
                .custom-table thead th {
                    font-weight: 500;
                    padding: 15px;
                }
                .custom-table tbody td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #f8f9fa;
                }
                .table-hover tbody tr:hover {
                    background-color: #f1f7ff !important;
                    transition: 0.3s;
                }
                .badge {
                    font-size: 0.85rem;
                    padding: 6px 12px;
                    border-radius: 20px;
                }
            `}</style>
        </div>
        </AdminLayout>    
    );
};

export default ConfirmOrder;