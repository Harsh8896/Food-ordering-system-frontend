import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewFoodOrder = () => {
    const { order_number } = useParams();
    const [data, setData] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [updating, setUpdating] = useState(false);
    const adminUser = localStorage.getItem('adminUser');
    const navigate = useNavigate();

    // ── Fetch order data ──
    const fetchOrderData = useCallback(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/view-order-detail/${order_number}/`)
            .then(res => {
                if (!res.ok) throw new Error("Order not found");
                return res.json();
            })
            .then(data => {
                setData(data);
                setSelectedStatus(""); // status reset karo har fetch pe
            })
            .catch(err => {
                toast.error("Order not found");
                console.log(err);
            });
    }, [order_number]);

    useEffect(() => {
        if (!adminUser) { navigate('/admin-login'); return; }
        fetchOrderData();
    }, [order_number, adminUser, navigate, fetchOrderData]);

    if (!data) {
        return (
            <AdminLayout>
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Loading...</p>
                </div>
            </AdminLayout>
        );
    }

    const order = data?.order;
    const foods = data?.foods || [];
    const tracking = data?.tracking || [];

    const statusOptions = [
        "Order Confirmed",
        "Food being Prepared",
        "Food Pickup",
        "Food Delivered",
        "Order Cancelled"
    ];

    const currentStatus = order?.order_final_status || "";

    const visibleOptions =
        statusOptions.indexOf(currentStatus) !== -1
            ? statusOptions.slice(statusOptions.indexOf(currentStatus) + 1)
            : statusOptions;

    const getOptionDisabled = (status, index) => {
    return index !== 0;
};

    const onSub = async (e) => {
        e.preventDefault();

        const status = e.target.status.value;
        const remark = e.target.remark.value;

        setUpdating(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update_order_status/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order_number: order.order_number,
                    status: status,
                    remark: remark,
                }),
            });
            const result = await res.json();

            if (result.message) {
                toast.success(result.message);
                fetchOrderData();
                e.target.remark.value = "";
            } else {
                toast.error(result.error || "Failed to update status");
            }
        } catch {
            toast.error("Server error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={2000} />

            <div className="container mt-4">
                <h3 className="text-center text-primary mb-4">
                    Order Details #{order_number}
                </h3>

                <div className="row">
                    {/* User Info */}
                    <div className="col-md-6">
                        <h5>User Info</h5>
                        <table className="table table-bordered">
                            <tbody>
                                <tr><th>First Name</th><td>{order?.user_first_name}</td></tr>
                                <tr><th>Last Name</th><td>{order?.user_last_name}</td></tr>
                                <tr><th>Email</th><td>{order?.user_email}</td></tr>
                                <tr><th>Mobile</th><td>{order?.user_mobile}</td></tr>
                                <tr><th>Address</th><td>{order?.address}</td></tr>
                                <tr>
                                    <th>Order Time</th>
                                    <td>{order?.order_time ? new Date(order.order_time).toLocaleString() : ""}</td>
                                </tr>
                                <tr>
                                    <th>Final Status</th>
                                    <td>
                                        <span className={`badge ${
                                            currentStatus === 'Food Delivered' ? 'bg-success' :
                                            currentStatus === 'Order Cancelled' ? 'bg-danger' :
                                            currentStatus === 'Food being Prepared' ? 'bg-warning text-dark' :
                                            currentStatus === 'Food Pickup' ? 'bg-info' :
                                            currentStatus === 'Order Confirmed' ? 'bg-primary' :
                                            'bg-secondary'
                                        }`}>
                                            {order?.order_final_status || "Pending"}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Ordered Foods */}
                    <div className="col-md-6">
                        <h5>Ordered Foods</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {foods.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img src={item.image} width="60" alt="food" style={{ borderRadius: '8px' }} />
                                        </td>
                                        <td>{item.item_name}</td>
                                        <td>₹{item.item_price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tracking History */}
                <div className="row mt-4">
                    <div className="col-md-12">
                        <h5>Tracking History</h5>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Status</th>
                                    <th>Remark</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tracking.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center text-muted">
                                            No tracking history yet
                                        </td>
                                    </tr>
                                ) : (
                                    tracking.map((track, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{track.status}</td>
                                            <td>{track.remark}</td>
                                            <td>{new Date(track.status_date).toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                        {/* Update Status Form — sirf tab dikhe jab delivered/cancelled nahi hua */}
                        {order?.order_final_status !== "Food Delivered" &&
                         order?.order_final_status !== "Order Cancelled" && (
                            <div className="my-4">
                                <h5>Update Order Status</h5>
                                <form onSubmit={onSub}>
                                    <div className="mb-3">
                                        <label>Status</label>
                                        <select
                                            name="status"
                                            className="form-control"
                                            required
                                            value={selectedStatus}
                                            onChange={(e) => setSelectedStatus(e.target.value)}
                                        >
                                            <option value="">--Select Status--</option>
                                            {visibleOptions.map((status, index) => (
                                                <option
                                                    key={index}
                                                    value={status}
                                                    disabled={getOptionDisabled(status, index)}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label>Remark</label>
                                        <textarea
                                            name="remark"
                                            className="form-control"
                                            rows="3"
                                            required
                                        />
                                    </div>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={updating}
                                        >
                                            {updating ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Updating...
                                                </>
                                            ) : "Update Status"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ViewFoodOrder;