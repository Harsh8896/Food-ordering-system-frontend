import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderReport = () => {
    const [orders, setOrders] = useState([]);
    const [formData, setFormData] = useState({
        from_date: '',
        to_date: '',
        status: 'all',
    });

    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    useEffect(() => {
        if (!adminUser) {
            navigate('/admin-login');
        }
    }, [adminUser, navigate]);

    // Input fields ke data ko state mein update karne ke liye
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Form submit hone par backend API call karne ke liye
    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('http://127.0.0.1:8000/api/order-between-dates/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
                restaurant_id: localStorage.getItem('restaurantId')  // ← body ke andar
            }),
        });

        const data = await response.json();
        if (response.status === 200) {
            setOrders(data);
        } else {
            toast.error("Something went wrong");
        }
    } catch (error) {
        console.error(error);
        toast.error("Error connecting to server");
    }
};

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="container mt-4">
                <h3 className="text-center text-primary mb-4">Between Dates Reports</h3>
                
                {/* Search Form */}
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <label>From Date</label>
                            <input type="date" name="from_date" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-4">
                            <label>To Date</label>
                            <input type="date" name="to_date" onChange={handleChange} className="form-control" required />
                        </div>
                        <div className="col-md-4">
                            <label>Status</label>
                            <select name="status" onChange={handleChange} className="form-control">
                                <option value="all">All</option>
                                <option value="not_confirmed">Not Confirmed</option>
                                <option value="Order Confirmed">Order Confirmed</option>
                                <option value="Food being Prepared">Food being Prepared</option>
                                <option value="Food Pickup">Food Pickup</option>
                                <option value="Food Delivered">Food Delivered</option>
                                <option value="Order Cancelled">Order Cancelled</option>
                            </select>
                        </div>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>

                {/* Results Table (Sirf tab dikhega jab data load hoga) */}
                {orders.length > 0 && (
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
                                        <a href={`/admin-view-order-detail/${order.order_number}`} className="btn btn-sm btn-info">
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </AdminLayout>
    );
};

export default OrderReport;