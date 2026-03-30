import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate, useParams } from "react-router-dom";
import CancelOrderModal from "../components/CancelOrderModal ";

const OrderDetail = () => {
  const userId = localStorage.getItem("userId");

  const [orderItems, setOrderItems] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [total, setTotal] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const handleCloseModal = () => setShowCancelModal(false);

  const navigate = useNavigate();
  const { order_number } = useParams();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Fetch order items
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/by_order_number/${order_number}/`)
      .then((res) => res.json())
      .then((data) => {
        setOrderItems(data);

        const totalAmount = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );

        setTotal(totalAmount);
      });

    // Fetch address
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order_address/${order_number}/`)
      .then((res) => res.json())
      .then((data) => {
        setOrderAddress(data);
      });
  }, [order_number, navigate, userId]);

  return (
    <PublicLayout>
      <div className="container py-5">
        <h3 className="mb-4 text-primary">
          <i className="fas fa-receipt me-2"></i> Order #{order_number} Details
        </h3>

        <div className="row">
          <div className="col-md-8">
            {orderItems.map((item, index) => (
              <div key={index} className="card mb-3 shadow-sm">
                <div className="row g-0">
                  <div className="col-md-4">
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}${item.food.image}`}
                      alt={item.food.item_name}
                      className="img-fluid rounded-start"
                      style={{ width: "100%", height: "220px", objectFit: "cover" }}
                    />
                  </div>

                  <div className="col-md-8 p-3">
                    <h5>
                      {item.food.item_name} ({item.food.item_quantity})
                    </h5>

                    <p>
                      {item.food.item_description?.slice(0, 140)}...
                    </p>

                    <p>
                      <strong>Price:</strong> ₹ {item.food.item_price}
                    </p>

                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>

                    
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            {orderAddress && (
              <div className="card p-4 shadow-sm border-0 bg-light">
                <h5 className="fw-semibold mb-3">
                  <i className="fas fa-map-marker-alt me-2 text-danger"></i>
                  Delivery Details
                </h5>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(orderAddress.order_time).toLocaleString()}
                </p>

                <p>
                  <strong>Address:</strong> {orderAddress.address}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {orderAddress.order_final_status ||
                    "Waiting for Restaurant Confirmation"}
                </p>

                <p>
                  <strong>Payment Mode:</strong>
                  <span className="badge bg-info text-dark ms-2">
                    {orderAddress.payment_mode}
                  </span>
                </p>

                <hr />

                <h5 className="text-success">
                  Total: ₹ {total}{
                    console.log("hhhhh", total)
                  }
                </h5>

<a 
  href={`${import.meta.env.VITE_BACKEND_URL}/api/invoice/${order_number}/`} 
  target="_blank" 
  className="btn btn-primary w-100 my-2"
>
  <i className="fas fa-file-invoice me-2"></i> Invoice
</a>

{orderAddress && (
    <div className="mt-3">
        {/* Modal Component */}
        <CancelOrderModal 
            show={showCancelModal} 
            handleClose={handleCloseModal} 
            orderNumber={order_number} 
            paymentMode={orderAddress.payment_mode} 
        />

        {/* Logic: Sirf in statuses par cancel button dikhayen */}
        {orderAddress.order_final_status === null || 
         orderAddress.order_final_status === 'Order Confirmed' || 
         orderAddress.order_final_status === 'Food being Prepared' ? (
            <button className="btn btn-danger w-100" onClick={() => setShowCancelModal(true)}>
                <i className="fas fa-times-circle me-2"></i> Cancel Order
            </button>
        ) : (
            <p className="text-danger mt-2">
                Order cannot be cancelled (Current Status: {orderAddress.order_final_status})
            </p>
        )}
    </div>
)}
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderDetail;