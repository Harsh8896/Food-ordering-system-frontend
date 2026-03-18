import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminLayout from '../components/AdminLayout';

const OrderDelivered = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(""); // Search state

    const getDeliveredData = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/orders-delivered/');
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

    // Filter Logic: User Name ya Food Name dono se search karega
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
                {/* Search Box Section */}
                <div className="row mb-4">
                    <div className="col-md-6 offset-md-3">
                        <div className="input-group shadow-sm">
                            <span className="input-group-text bg-white border-end-0">
                                🔍
                            </span>
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

                <div className="delivered-wrapper shadow-sm">
                    <div className="header-section d-flex justify-content-between align-items-center">
                        <h3 className="m-0 text-white">Delivered History 🍽️</h3>
                        <span className="badge bg-light text-success">
                            {filteredOrders.length} Results
                        </span>
                    </div>

                    <div className="table-responsive bg-white">
                        <table className="table table-borderless align-middle mb-0">
                            <thead>
                                <tr className="border-bottom">
                                    <th className="py-3 ps-4">Order ID</th>
                                    <th className="py-3">Customer Name</th>
                                    <th className="py-3">Food Item</th>
                                    <th className="py-3">Price</th>
                                    <th className="py-3 pe-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="spinner-border text-success" role="status"></div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((order, index) => (
                                        <tr key={index} className="order-row border-bottom">
                                            <td className="ps-4 fw-bold">#{order.order_number}</td>
                                            <td className="text-capitalize">{order.user_name}</td>
                                            <td>
                                                <span className="text-capitalize">{order.food_name}</span>
                                            </td>
                                            <td className="fw-bold">₹{order.price}</td>
                                            <td className="pe-4 text-center">
                                                <span className="status-delivered">Delivered</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
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

                <style jsx>{`
                    .input-group-text {
                        font-size: 1.2rem;
                    }
                    .form-control:focus {
                        box-shadow: none;
                        border-color: #dee2e6;
                    }
                    .delivered-wrapper {
                        border-radius: 12px;
                        overflow: hidden;
                    }
                    .header-section {
                        background: #198754;
                        padding: 20px 25px;
                    }
                    .order-row:hover {
                        background-color: #f8f9fa;
                    }
                    .food-tag {
                        background: #e9ecef;
                        padding: 5px 12px;
                        border-radius: 5px;
                        font-size: 0.9rem;
                        color: #495057;
                        display: inline-block;
                        text-transform: capitalize;
                    }
                    .status-delivered {
                        background: #d1e7dd;
                        color: #0f5132;
                        padding: 6px 15px;
                        border-radius: 50px;
                        font-size: 0.85rem;
                        font-weight: 500;
                        border: 1px solid #badbcc;
                    }
                    th {
                        color: #6c757d;
                        font-size: 0.85rem;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                `}</style>
            </div>
        </AdminLayout>
    );
};

export default OrderDelivered;