import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewFoodOrder = () => {

    const { order_number } = useParams();
    const [data, setData] = useState(null);
    const adminUser = localStorage.getItem('adminUser');
    const navigate = useNavigate();

    useEffect(() => {

        if (!adminUser) {
            navigate('/admin-login');
            return;
        }

        fetch(`http://127.0.0.1:8000/api/view-order-detail/${order_number}/`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Order not found");
                }
                return res.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(err => {
                toast.error("Order not found");
                console.log(err);
            });

    }, [order_number, adminUser, navigate]);


    if (!data) {
        return (
            <AdminLayout>
                <div className="text-center mt-5">
                    <p>Loading...</p>
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



    const onSub = (e) => {

        e.preventDefault();

        const status = e.target.status.value;
        const remark = e.target.remark.value;

        fetch('http://127.0.0.1:8000/api/update_order_status/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                order_number: order.order_number,
                status: status,
                remark: remark,
            }),
        })
            .then((res) => res.json())
            .then((res) => {

                if (res.message) {

                    toast.success(res.message);

                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);

                } else {
                    toast.error(res.error || "Failed to update status");
                }

            })
            .catch(() => {
                toast.error("Server error");
            });
    };


    return (

        <AdminLayout>

            <ToastContainer position="top-right" autoClose={2000} />

            <div className="container mt-4">

                <h3 className="text-center text-primary mb-4">
                    Order Details #{order_number}
                </h3>


                <div className="row">

                    <div className="col-md-6">

                        <h5>User Info</h5>

                        <table className="table table-bordered">

                            <tbody>

                                <tr>
                                    <th>First Name</th>
                                    <td>{order?.user_first_name}</td>
                                </tr>

                                <tr>
                                    <th>Last Name</th>
                                    <td>{order?.user_last_name}</td>
                                </tr>

                                <tr>
                                    <th>Email</th>
                                    <td>{order?.user_email}</td>
                                </tr>

                                <tr>
                                    <th>Mobile</th>
                                    <td>{order?.user_mobile}</td>
                                </tr>

                                <tr>
                                    <th>Address</th>
                                    <td>{order?.address}</td>
                                </tr>

                                <tr>
                                    <th>Order Time</th>
                                    <td>
                                        {order?.order_time
                                            ? new Date(order.order_time).toLocaleString()
                                            : ""}
                                    </td>
                                </tr>

                                <tr>
                                    <th>Final Status</th>
                                    <td>{order?.order_final_status || "Pending"}</td>
                                </tr>

                            </tbody>

                        </table>

                    </div>



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
                                            <img
                                                src={`http://127.0.0.1:8000${item.image}`}
                                                width="60"
                                                alt="food"
                                            />
                                        </td>

                                        <td>{item.item_name}</td>

                                        <td>{item.item_price}</td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>



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
                                        <td colSpan="4" className="text-center">
                                            No tracking history yet
                                        </td>
                                    </tr>

                                ) : (

                                    tracking.map((track, index) => (

                                        <tr key={index}>

                                            <td>{index + 1}</td>

                                            <td>{track.status}</td>

                                            <td>{track.remark}</td>

                                            <td>
                                                {new Date(track.status_date).toLocaleString()}
                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>



                        {order?.order_final_status !== "Food Delivered" && (

                            <div className="my-4">

                                <h5>Update Order Status</h5>

                                <form onSubmit={onSub}>

                                    <div className="mb-3">

                                        <label>Status</label>

                                        <select name="status" className="form-control" required>

                                            <option value="">
                                                --Select Status--
                                            </option>

                                            {visibleOptions.map((status, index) => (

                                                <option key={index} value={status}>
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
                                        >
                                            Update Status
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