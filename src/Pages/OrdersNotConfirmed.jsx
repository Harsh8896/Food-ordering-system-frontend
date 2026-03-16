import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';

const OrdersNotConfirmed = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
            return;
        }

        fetch('http://127.0.0.1:8000/api/orders-not-confirmed/')
            .then(res => res.json())
            .then(data => {
                setOrders(data);
            });
    }, []);

    return (
        <AdminLayout>
            <div className="container mt-4">
                <h3 className="text-center text-primary mb-4">Detail of Order Not Confirmed</h3>
                <div className="text-end mb-3">
                    <h5>Total Not Confirmed Orders: <span className="badge bg-success">{orders.length}</span></h5>
                </div>
                <table className="table table-bordered table-hover table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>S.No.</th>
                            <th>Order Number</th>
                            <th>Order Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                                <td>{index + 1}</td>
                                <td>{order.order_number}</td>
                                <td>{new Date(order.order_time).toLocaleString()}</td>
                                <td>
                                    <a href={`/admin-view-order-detail/${order.order_number}`} className="btn btn-sm btn-primary">
                                        View Details
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default OrdersNotConfirmed;