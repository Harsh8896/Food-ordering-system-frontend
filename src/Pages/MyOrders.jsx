import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaInfoCircle, FaMapMarkedAlt } from "react-icons/fa";

const MyOrders = () => {

const userId = localStorage.getItem("userId");
const [orders, setOrders] = useState([]);
const navigate = useNavigate();


/* ---------- STATUS BADGE FUNCTION ---------- */

const getStatusBadge = (status) => {

if(!status) return "secondary";

const statusLower = status.toLowerCase();

if (statusLower.includes("delivered")) return "success";
if (statusLower.includes("cancel")) return "danger";
if (statusLower.includes("confirmed")) return "info";
if (statusLower.includes("prepare")) return "warning";

return "secondary";

};



/* ---------- FETCH ORDERS ---------- */

useEffect(() => {

if(!userId){
navigate("/login");
return;
}

fetch(`http://127.0.0.1:8000/api/orders/${userId}/`)
.then(res => res.json())
.then(data => setOrders(data));

}, [userId,navigate]);



return (

<PublicLayout>

<div className="container py-5">

<h3 className="text-center mb-4">

<FaBoxOpen className="text-warning" size={50}/> My Orders

</h3>


{orders.length === 0 ? (

<p className="text-center text-muted">
You have not placed any orders yet.
</p>

) : (

orders.map((order,index)=>(
    
<div className="card mb-4 shadow-sm" key={index}>

<div className="card-body d-flex align-items-center flex-wrap">

<div className="me-2">

<FaBoxOpen className="text-warning" size={50}/>

</div>

<div className="flex-grow-1">

<h5 className="mb-1">

<Link to={`/order-details/${order.order_number}`}>

Order # {order.order_number}

</Link>

</h5>

<p className="text-muted mb-1">

<strong>Date:</strong> {new Date(order.order_time).toLocaleString()}

<br/>

<span className={`badge bg-${getStatusBadge(order.order_final_status)}`}>

{order.order_final_status || "Waiting for restaurant confirmation"}

</span>

</p>

</div>


<div className="mt-3 mt-md-0">

<Link 
to={`/track-order/${order.order_number}`}
className="btn btn-outline-secondary btn-sm me-2"
>

<FaMapMarkedAlt/> Track

</Link>

<Link 
className="btn btn-outline-primary btn-sm"
to={`/order-details/${order.order_number}`}
>

<FaInfoCircle/> View Detail

</Link>

</div>

</div>

</div>

))

)}

</div>

</PublicLayout>

);

};

export default MyOrders;