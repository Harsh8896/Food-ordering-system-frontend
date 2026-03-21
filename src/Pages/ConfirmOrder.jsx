import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const ConfirmOrder = () => {
    const [confirmedOrders, setConfirmedOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConfirmedOrders = async () => {
        try {
            const rid = localStorage.getItem('restaurantId');
            const restaurantId = rid && rid !== 'null' ? rid : null;
            const url = restaurantId
                ? `http://127.0.0.1:8000/api/orders-confirmed/?restaurant_id=${restaurantId}`
                : `http://127.0.0.1:8000/api/orders-confirmed/`;

            const response = await fetch(url);
            const data = await response.json();
            setConfirmedOrders(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
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
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary" role="status"></div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Order Date</th>
                                        <th>Status</th>
                                        <th className="text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {confirmedOrders.length > 0 ? confirmedOrders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="fw-bold">#{order.order_number}</td>
                                            <td>{new Date(order.order_time).toLocaleDateString()}</td>
                                            <td><span className="badge bg-success">Confirmed</span></td>
                                            <td className="text-center">
                                                <a href={`/admin-view-order-detail/${order.order_number}`} className="btn btn-info btn-sm text-white">
                                                    View Details
                                                </a>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="text-center text-muted py-4">
                                                Koi confirmed order nahi hai
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default ConfirmOrder;