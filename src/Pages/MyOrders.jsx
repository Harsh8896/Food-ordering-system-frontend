import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBoxOpen, FaInfoCircle, FaMapMarkedAlt,
  FaStar, FaCheckCircle, FaTimes, FaEdit, FaTrash
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyOrders = () => {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const [deliveredFoods, setDeliveredFoods] = useState([]);
  const [activeReview, setActiveReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  const getStatusConfig = (status) => {
    if (!status) return { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", label: "Waiting for confirmation", dot: "#94a3b8" };
    const s = status.toLowerCase();
    if (s.includes("delivered")) return { color: "#22c55e", bg: "rgba(34,197,94,0.15)", label: status, dot: "#22c55e" };
    if (s.includes("cancel"))    return { color: "#ef4444", bg: "rgba(239,68,68,0.12)",  label: status, dot: "#ef4444" };
    if (s.includes("confirmed")) return { color: "#38bdf8", bg: "rgba(56,189,248,0.12)", label: status, dot: "#38bdf8" };
    if (s.includes("prepare"))   return { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", label: status, dot: "#f59e0b" };
    if (s.includes("pickup"))    return { color: "#a78bfa", bg: "rgba(167,139,250,0.12)", label: status, dot: "#a78bfa" };
    return { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", label: status, dot: "#94a3b8" };
  };

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchOrders();
    fetchDeliveredFoods();
    setTimeout(() => setMounted(true), 50);
  }, [userId, navigate]);

  const fetchOrders = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/orders/${userId}/`)
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  const fetchDeliveredFoods = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/delivered-orders/${userId}/`)
      .then(res => res.json())
      .then(data => setDeliveredFoods(data));
  };

  const getDeliveredFoodsForOrder = (orderNumber) =>
    deliveredFoods.filter(f => f.order_number === orderNumber);

  // Open modal for new review
  const handleOpenReview = (food) => {
    setActiveReview(food);
    setIsEditing(false);
    setRating(0);
    setComment("");
    setHoveredRating(0);
  };

  // Open modal for editing existing review
  const handleEditReview = (food) => {
    setActiveReview(food);
    setIsEditing(true);
    setRating(food.my_rating || 0);
    setComment(food.my_comment || "");
    setHoveredRating(0);
  };

  // Submit new or edited review
  const handleSubmitReview = async () => {
    if (rating < 1) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    try {
      let res;
      if (isEditing && activeReview.my_review_id) {
        // Edit existing review
        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/review_edit/${activeReview.my_review_id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        });
      } else {
        // New review
        res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reviews/add/${activeReview.food_id}/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: userId, rating, comment }),
        });
      }
      const data = await res.json();
      if (res.ok) {
        toast.success(isEditing ? "Review updated!" : "Review submitted!");
        setActiveReview(null);
        setRating(0); setComment("");
        fetchDeliveredFoods();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch { toast.error("Server error"); }
    finally { setSubmitting(false); }
  };

  // Delete review
  const handleDeleteReview = async (food) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/review_edit/${food.my_review_id}/`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Review deleted!");
        fetchDeliveredFoods();
      }
    } catch { toast.error("Server error"); }
  };

  const renderStars = (count, interactive = false, size = 18) =>
    [1, 2, 3, 4, 5].map(star => (
      <FaStar key={star} size={size}
        style={{
          cursor: interactive ? "pointer" : "default",
          color: star <= (interactive ? (hoveredRating || rating) : count) ? "#fbbf24" : "#334155",
          marginRight: "3px",
          transition: "all 0.15s ease",
          filter: star <= (interactive ? (hoveredRating || rating) : count)
            ? "drop-shadow(0 0 4px rgba(251,191,36,0.6))" : "none",
          transform: interactive && star <= (hoveredRating || rating) ? "scale(1.2)" : "scale(1)",
        }}
        onClick={interactive ? () => setRating(star) : undefined}
        onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
      />
    ));

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(24px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
        }
        .page-bg {
          min-height: 100vh;
          background: #020617;
        }
        .order-card {
          background: #0f1629;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .order-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99,102,241,0.25);
          box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
        }
        .food-chip {
          background: #162032;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 12px 14px;
          display: flex; align-items: center;
          justify-content: space-between;
          gap: 10px;
          transition: all 0.2s;
        }
        .food-chip:hover {
          background: #1a2a40;
          border-color: rgba(255,255,255,0.12);
        }
        .rate-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border: none; border-radius: 10px;
          color: #000; font-weight: 700; font-size: 12px;
          padding: 7px 14px; cursor: pointer;
          transition: all 0.2s ease;
          display: flex; align-items: center; gap: 5px;
          white-space: nowrap;
        }
        .rate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(251,191,36,0.45);
        }
        .icon-btn {
          display: flex; align-items: center; justify-content: center;
          width: 30px; height: 30px; border-radius: 8px;
          border: none; cursor: pointer; transition: all 0.2s;
          flex-shrink: 0;
        }
        .edit-btn {
          background: rgba(99,102,241,0.12);
          color: #a5b4fc;
        }
        .edit-btn:hover {
          background: rgba(99,102,241,0.25);
          transform: translateY(-1px);
        }
        .delete-btn {
          background: rgba(239,68,68,0.1);
          color: #f87171;
        }
        .delete-btn:hover {
          background: rgba(239,68,68,0.22);
          transform: translateY(-1px);
        }
        .overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999; padding: 16px;
        }
        .modal-card {
          background: #0f1629;
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 24px;
          padding: 32px;
          width: 100%; max-width: 420px;
          position: relative;
          animation: modalIn 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1);
        }
        .submit-btn {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border: none; border-radius: 12px;
          color: #000; font-weight: 700;
          padding: 13px; width: 100%;
          cursor: pointer; font-size: 14px;
          transition: all 0.2s;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(251,191,36,0.45);
        }
        .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .cancel-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; color: #64748b;
          padding: 13px; width: 100%;
          cursor: pointer; font-size: 14px;
          transition: all 0.2s;
        }
        .cancel-btn:hover {
          background: rgba(255,255,255,0.09);
          color: #e2e8f0;
        }
        .nav-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px;
          font-size: 12px; font-weight: 600;
          text-decoration: none; transition: all 0.2s;
          border: 1px solid;
        }
      `}</style>

      <div className="page-bg py-5">
        <div className="container" style={{ maxWidth: "700px" }}>

          {/* Page Header */}
          <div className="text-center mb-5" style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(-16px)",
            transition: "all 0.5s ease",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "68px", height: "68px", borderRadius: "22px",
              background: "linear-gradient(135deg, rgba(251,191,36,0.18), rgba(245,158,11,0.08))",
              border: "1px solid rgba(251,191,36,0.28)", marginBottom: "18px",
              boxShadow: "0 8px 24px rgba(251,191,36,0.12)",
            }}>
              <FaBoxOpen size={30} color="#fbbf24" />
            </div>
            <h2 style={{ color: "#f1f5f9", fontWeight: "800", fontSize: "28px", marginBottom: "6px" }}>
              My Orders
            </h2>
            <p style={{ color: "#334155", fontSize: "14px" }}>
              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
            </p>
          </div>

          {/* Empty State */}
          {orders.length === 0 ? (
            <div className="text-center py-5" style={{ color: "#334155" }}>
              <FaBoxOpen size={56} style={{ marginBottom: "16px", opacity: 0.2 }} />
              <p style={{ fontSize: "15px" }}>Koi order nahi mila abhi tak.</p>
            </div>
          ) : (
            orders.map((order, index) => {
              const statusCfg = getStatusConfig(order.order_final_status);
              const isDelivered = order.order_final_status?.toLowerCase().includes("delivered");
              const foods = getDeliveredFoodsForOrder(order.order_number);

              return (
                <div key={index} className="order-card mb-4" style={{
                  animationName: "fadeSlideUp",
                  animationDuration: "0.5s",
                  animationDelay: `${index * 0.09}s`,
                  animationFillMode: "both",
                }}>

                  {/* Card Top */}
                  <div style={{
                    padding: "18px 22px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", flexWrap: "wrap", gap: "10px",
                  }}>
                    <div>
                      <Link to={`/order-details/${order.order_number}`} style={{
                        color: "#e2e8f0", fontWeight: "700", fontSize: "16px", textDecoration: "none",
                      }}>
                        Order #{order.order_number}
                      </Link>
                      <p style={{ color: "#334155", fontSize: "11px", margin: "3px 0 0" }}>
                        {new Date(order.order_time).toLocaleString()}
                      </p>
                    </div>

                    {/* Status pill */}
                    <div style={{
                      display: "flex", alignItems: "center", gap: "7px",
                      background: statusCfg.bg,
                      border: `1px solid ${statusCfg.color}40`,
                      borderRadius: "20px", padding: "6px 14px",
                    }}>
                      <div style={{
                        width: "7px", height: "7px", borderRadius: "50%",
                        background: statusCfg.dot,
                        animation: isDelivered ? "pulse-glow 2s infinite" : "none",
                      }} />
                      <span style={{ color: statusCfg.color, fontSize: "12px", fontWeight: "600" }}>
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "16px 22px" }}>

                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: isDelivered && foods.length > 0 ? "18px" : "0" }}>
                      <Link to={`/track-order/${order.order_number}`} className="nav-btn" style={{
                        background: "rgba(255,255,255,0.04)",
                        borderColor: "rgba(255,255,255,0.09)",
                        color: "#64748b",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#e2e8f0"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#64748b"; }}
                      >
                        <FaMapMarkedAlt size={12} /> Track
                      </Link>
                      <Link to={`/order-details/${order.order_number}`} className="nav-btn" style={{
                        background: "rgba(99,102,241,0.08)",
                        borderColor: "rgba(99,102,241,0.2)",
                        color: "#818cf8",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.18)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.08)"; }}
                      >
                        <FaInfoCircle size={12} /> Details
                      </Link>
                    </div>

                    {/* Delivered foods with rating — ONLY for delivered orders */}
                    {isDelivered && foods.length > 0 && (
                      <div>
                        <p style={{
                          color: "#334155", fontSize: "10px", fontWeight: "700",
                          letterSpacing: "1px", marginBottom: "10px",
                        }}>
                          RATE YOUR ITEMS
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {foods.map((food, fi) => (
                            <div key={fi} className="food-chip">

                              {/* Food info */}
                              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                                {food.food_image && (
                                  <img src={food.food_image} alt={food.food_name}
                                    style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }} />
                                )}
                                <div style={{ minWidth: 0 }}>
                                  <p style={{
                                    color: "#e2e8f0", fontSize: "13px", fontWeight: "600",
                                    margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                                  }}>
                                    {food.food_name}
                                  </p>
                                  {food.already_reviewed && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "3px" }}>
                                      {renderStars(food.my_rating, false, 13)}
                                      {food.my_comment && (
                                        <span style={{ color: "#334155", fontSize: "11px", marginLeft: "4px" }}>
                                          "{food.my_comment.slice(0, 30)}{food.my_comment.length > 30 ? "..." : ""}"
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Action buttons */}
                              {food.already_reviewed ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                                  <button className="icon-btn edit-btn" title="Edit review"
                                    onClick={() => handleEditReview(food)}>
                                    <FaEdit size={12} />
                                  </button>
                                  <button className="icon-btn delete-btn" title="Delete review"
                                    onClick={() => handleDeleteReview(food)}>
                                    <FaTrash size={11} />
                                  </button>
                                </div>
                              ) : (
                                <button className="rate-btn" onClick={() => handleOpenReview(food)}>
                                  <FaStar size={11} /> Rate
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Review Modal */}
      {activeReview && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setActiveReview(null)}>
          <div className="modal-card">

            {/* Close */}
            <button onClick={() => setActiveReview(null)} style={{
              position: "absolute", top: "18px", right: "18px",
              background: "rgba(255,255,255,0.06)", border: "none",
              borderRadius: "8px", color: "#475569", cursor: "pointer",
              width: "30px", height: "30px", display: "flex",
              alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#e2e8f0"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#475569"; }}
            >
              <FaTimes size={14} />
            </button>

            {/* Food info */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              {activeReview.food_image && (
                <img src={activeReview.food_image} alt={activeReview.food_name}
                  style={{ width: "56px", height: "56px", borderRadius: "14px", objectFit: "cover" }} />
              )}
              <div>
                <h5 style={{ color: "#f1f5f9", fontWeight: "700", margin: 0, fontSize: "16px" }}>
                  {activeReview.food_name}
                </h5>
                <p style={{ color: "#334155", fontSize: "12px", margin: "4px 0 0" }}>
                  {isEditing ? "Update your review" : "How was your experience?"}
                </p>
              </div>
            </div>

            {/* Stars */}
            <p style={{ color: "#334155", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "12px" }}>
              YOUR RATING
            </p>
            <div style={{ display: "flex", marginBottom: "24px" }}>
              {renderStars(rating, true, 34)}
            </div>

            {/* Comment */}
            <p style={{ color: "#334155", fontSize: "11px", fontWeight: "700", letterSpacing: "1px", marginBottom: "10px" }}>
              COMMENT (OPTIONAL)
            </p>
            <textarea rows="3"
              placeholder="Aapka experience kaisa raha..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              style={{
                width: "100%", background: "#162032",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px",
                padding: "12px 14px", color: "#e2e8f0", fontSize: "13px",
                resize: "none", outline: "none", marginBottom: "24px",
                fontFamily: "inherit", lineHeight: "1.6",
                transition: "border-color 0.2s",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.4)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button className="cancel-btn" onClick={() => setActiveReview(null)}>Cancel</button>
              <button className="submit-btn" onClick={handleSubmitReview} disabled={submitting}>
                {submitting ? "Saving..." : isEditing ? "Update Review" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
};

export default MyOrders;