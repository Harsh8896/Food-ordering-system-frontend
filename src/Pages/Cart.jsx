import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash, FaMapMarkerAlt, FaStore } from "react-icons/fa";
import { useCart } from "../context/CartContext";



function Cart() {
  const userId = localStorage.getItem("userId");
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const { cartCount, setCartCount } = useCart();
  const navigate = useNavigate();

  const fetchCart = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}/`);
    const data = await res.json();
    setCartItems(data);
    setCartCount(data.length);
    const total = data.reduce(
      (sum, item) => sum + parseFloat(item.food.item_price) * item.quantity,
      0
    );
    setGrandTotal(total);
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [userId]);

  const updateQuantity = async (orderId, newQty) => {
    if (newQty < 1) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/update_quantity/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, quantity: newQty }),
      });
      if (response.status === 200) {
        fetchCart();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const deleteCartItem = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/delete/${orderId}/`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        toast.success("Item removed");
        fetchCart();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <style>{`
        .cart-wrapper {
          min-height: 80vh;
          background: #f8fafc;
          padding: 40px 0;
        }
        .cart-title {
          font-size: 28px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 32px;
        }
        .cart-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          margin-bottom: 16px;
          transition: box-shadow 0.2s;
        }
        .cart-card:hover {
          box-shadow: 0 8px 30px rgba(0,0,0,0.10);
        }
        .cart-img {
          width: 130px;
          min-width: 130px;
          height: 130px;
          object-fit: cover;
          border-radius: 16px;
          margin: 16px;
        }
        .cart-body {
          flex: 1;
          padding: 16px 16px 16px 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .food-name {
          font-size: 17px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 4px;
        }
        .restaurant-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fed7aa;
          border-radius: 20px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .location-text {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 8px;
        }
        .food-desc {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 10px;
          line-height: 1.5;
        }
        .price-tag {
          font-size: 18px;
          font-weight: 800;
          color: #16a34a;
        }
        .qty-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.15s;
        }
        .qty-btn:hover:not(:disabled) {
          background: #f59e0b;
          border-color: #f59e0b;
          color: #fff;
        }
        .qty-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .qty-num {
          font-weight: 700;
          font-size: 15px;
          color: #1e293b;
          min-width: 28px;
          text-align: center;
        }
        .remove-btn {
          background: none;
          border: 1.5px solid #fecaca;
          color: #ef4444;
          border-radius: 8px;
          padding: 5px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          transition: all 0.15s;
        }
        .remove-btn:hover {
          background: #ef4444;
          color: #fff;
        }
        .subtotal {
          font-size: 13px;
          color: #64748b;
          font-weight: 500;
        }
        .summary-card {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
          padding: 28px;
          position: sticky;
          top: 20px;
        }
        .summary-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          color: #64748b;
          margin-bottom: 10px;
        }
        .summary-total {
          display: flex;
          justify-content: space-between;
          font-size: 20px;
          font-weight: 800;
          color: #1e293b;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 2px solid #f1f5f9;
        }
        .checkout-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          border: none;
          border-radius: 14px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }
        .checkout-btn:hover {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(245,158,11,0.3);
        }
        .empty-state {
          text-align: center;
          padding: 80px 20px;
        }
        .empty-icon {
          font-size: 60px;
          margin-bottom: 16px;
          opacity: 0.3;
        }
        @media (max-width: 576px) {
          .cart-img {
            width: 90px;
            min-width: 90px;
            height: 90px;
          }
          .food-name { font-size: 15px; }
        }
      `}</style>

      <div className="cart-wrapper">
        <div className="container">
          <h2 className="cart-title">
            <FaShoppingCart className="me-2 text-warning" />
            Your Cart
            {cartItems.length > 0 && (
              <span style={{
                fontSize: '14px', fontWeight: '500',
                color: '#94a3b8', marginLeft: '10px'
              }}>
                ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>

          {cartItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h5 style={{ color: '#64748b', fontWeight: '600' }}>Your cart is empty</h5>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Add some delicious food to get started!</p>
              <button
                onClick={() => navigate("/food-menu")}
                style={{
                  marginTop: '16px', padding: '12px 28px',
                  background: '#f59e0b', border: 'none',
                  borderRadius: '12px', color: '#fff',
                  fontWeight: '700', cursor: 'pointer', fontSize: '14px'
                }}
              >
                Browse Foods
              </button>
            </div>
          ) : (
            <div className="row g-4">

              {/* LEFT — Cart Items */}
              <div className="col-lg-8">
                {cartItems.map((item) => (
                  <div className="cart-card" key={item.id}>
                    <div className="d-flex">
                      <img
                        src={item.food.image}
                        className="cart-img"
                        alt={item.food.item_name}
                      />
                      <div className="cart-body">

                        {/* Food Name */}
                        <div>
                          <div className="food-name">{item.food.item_name}</div>

                          {/* ✅ Restaurant Badge */}
                          <div className="restaurant-badge">
                            <FaStore size={10} />
                            {item.food.restaurant_name || 'Restaurant'}
                          </div>

                          {/* ✅ Location */}
                          {item.food.restaurant_location && (
                            <div className="location-text">
                              <FaMapMarkerAlt size={10} color="#f59e0b" />
                              {item.food.restaurant_location}
                            </div>
                          )}

                          {/* Description */}
                          <p className="food-desc">
                            {item.food.item_description
                              ? item.food.item_description.slice(0, 80) + "..."
                              : ""}
                          </p>
                        </div>

                        {/* Bottom Row — Price + Qty + Remove */}
                        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                          <div>
                            <div className="price-tag">₹{item.food.item_price}</div>
                            <div className="subtotal">
                              Subtotal: ₹{(parseFloat(item.food.item_price) * item.quantity).toFixed(2)}
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            {/* Quantity */}
                            <button
                              className="qty-btn"
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <FaMinus size={10} />
                            </button>
                            <span className="qty-num">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <FaPlus size={10} />
                            </button>

                            {/* Remove */}
                            <button
                              className="remove-btn"
                              onClick={() => deleteCartItem(item.id)}
                            >
                              <FaTrash size={10} /> Remove
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT — Order Summary */}
              <div className="col-lg-4">
                <div className="summary-card">
                  <div className="summary-title">Order Summary</div>

                  {cartItems.map((item) => (
                    <div className="summary-row" key={item.id}>
                      <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.food.item_name} × {item.quantity}
                      </span>
                      <span style={{ fontWeight: '600', color: '#1e293b' }}>
                        ₹{(parseFloat(item.food.item_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="summary-total">
                    <span>Total</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>

                  <button className="checkout-btn" onClick={() => navigate("/payment")}>
                    <FaShoppingCart size={15} />
                    Proceed to Payment
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default Cart;