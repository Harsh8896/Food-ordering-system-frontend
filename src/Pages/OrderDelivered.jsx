import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';

const OrderDelivered = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const getDeliveredData = async () => {
        try {
            const rid = localStorage.getItem('restaurantId');
            const restaurantId = rid && rid !== 'null' ? rid : null;
            const url = restaurantId
                ? `http://127.0.0.1:8000/api/orders-delivered/?restaurant_id=${restaurantId}`
                : `http://127.0.0.1:8000/api/orders-delivered/`;

            const response = await fetch(url);
            const data = await response.json();
            setOrders(data);
            setLoading(false);
        } catch (error) {
            console.error("API Error:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getDeliveredData();
    }, []);

    const filteredOrders = orders.filter((order) => {
        const term = searchTerm.toLowerCase();
        return (
            order.user_name?.toLowerCase().includes(term) ||
            order.food_name?.toLowerCase().includes(term) ||
            order.order_number?.toString().includes(term)
        );
    });

    return (
        <AdminLayout>
            <div className="container mt-5">
                <div className="row mb-4">
                    <div className="col-md-6 offset-md-3">
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0">🔍</span>
                            <input
                                type="text"
                                className="form-control border-start-0 ps-0"
                                placeholder="Search by name, food, or order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                    <div className="d-flex justify-content-between align-items-center p-4" style={{ background: '#198754' }}>
                        <h3 className="m-0 text-white">Delivered History 🍽️</h3>
                        <span className="badge bg-light text-success">{filteredOrders.length} Results</span>
                    </div>

                    <div className="table-responsive bg-white">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="border-bottom">
                                    <th className="py-3 ps-4">Order ID</th>
                                    <th className="py-3">Customer Name</th>
                                    <th className="py-3">Food Item</th>
                                    <th className="py-3">Price</th>
                                    <th className="py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-success" role="status"></div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
                                    <tr key={index} className="border-bottom">
                                        <td className="ps-4 fw-bold">#{order.order_number}</td>
                                        <td className="text-capitalize">{order.user_name}</td>
                                        <td>{order.food_name}</td>
                                        <td className="fw-bold">₹{order.price}</td>
                                        <td className="text-center">
                                            <span style={{ background: '#d1e7dd', color: '#0f5132', padding: '6px 15px', borderRadius: '50px', fontSize: '0.85rem' }}>
                                                Delivered
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            No matching orders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default OrderDelivered;