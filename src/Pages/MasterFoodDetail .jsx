import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import {
  FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaRegStar,
  FaStore, FaCheckCircle, FaTimesCircle, FaCartArrowDown,
  FaClock, FaArrowLeft
} from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000";

const RESTAURANT_COLORS = [
  { bg: "linear-gradient(135deg, #ff6b35, #f7931e)", btn: "#ff6b35" },
  { bg: "linear-gradient(135deg, #2d6a4f, #52b788)", btn: "#2d6a4f" },
  { bg: "linear-gradient(135deg, #1a5276, #2e86c1)", btn: "#1a5276" },
  { bg: "linear-gradient(135deg, #6c3483, #a569bd)", btn: "#6c3483" },
  { bg: "linear-gradient(135deg, #b7410e, #e74c3c)", btn: "#b7410e" },
];

const renderStars = (avg, size = 14) => {
  return [1, 2, 3, 4, 5].map(i => {
    const filled = i <= Math.floor(avg);
    const half = !filled && i === Math.ceil(avg) && avg % 1 >= 0.5;
    return filled
      ? <FaStar key={i} color="#fbbf24" size={size} />
      : half
        ? <FaStarHalfAlt key={i} color="#fbbf24" size={size} />
        : <FaRegStar key={i} color="#d1d5db" size={size} />;
  });
};

// ✅ Naya RatingPopup Component
const RatingPopup = ({ avgRating, totalReviews, breakdown }) => {
  const [show, setShow] = useState(false);
  const total = totalReviews || 0;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {/* Stars trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
        {renderStars(avgRating)}
        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '3px' }}>
          {total > 0 ? `${avgRating} (${total})` : 'No reviews'}
        </span>
      </div>

      {/* Popup */}
      {show && total > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: '0',
          background: '#fff',
          border: '1px solid #f1f5f9',
          borderRadius: '12px',
          padding: '12px 16px',
          width: '200px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          zIndex: 999,
        }}>

          {[5, 4, 3, 2, 1].map(star => {
            const count = breakdown?.[star] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} style={{
                display: 'flex', alignItems: 'center',
                gap: '8px', marginBottom: '6px'
              }}>
                <span style={{
                  fontSize: '12px', color: '#94a3b8',
                  minWidth: '32px', textAlign: 'right'
                }}>
                  {star} star
                </span>
                <div style={{
                  flex: 1, height: '6px',
                  background: '#f1f5f9', borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: '#f59e0b',
                    borderRadius: '3px',
                  }} />
                </div>
                <span style={{
                  fontSize: '12px', color: '#94a3b8',
                  minWidth: '12px', textAlign: 'right'
                }}>
                  {count}
                </span>
              </div>
            );
          })}

          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: '-6px', right: '20px',
            transform: 'rotate(45deg)',
            width: '10px', height: '10px',
            background: '#fff',
            borderRight: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
          }} />
        </div>
      )}
    </div>
  );
};

const MasterFoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [food, setFood] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/master-foods/${id}/`)
      .then(res => res.json())
      .then(data => {
        setFood(data);
        setRestaurants(data.restaurants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async (restaurantId, restaurantName, menuItemId) => {
    if (!userId) { navigate("/login"); return; }
    
    // ✅ food_id null check
    if (!menuItemId) {
        toast.error("This item is not properly linked. Please contact support.");
        return;
    }
    
    setAddingToCart(restaurantId);
    try {
        const res = await fetch(`${BASE_URL}/api/cart/add/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, foodId: menuItemId }),
        });
        const result = await res.json();
        if (res.ok) {
            toast.success(`Added from ${restaurantName}! 🎉`);
            setTimeout(() => navigate("/cart"), 1500);
        } else {
            toast.error(result.message || "Something went wrong");
        }
    } catch {
        toast.error("Server error");
    } finally {
        setAddingToCart(null);
    }
};

  if (loading) return (
    <PublicLayout>
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status" />
      </div>
    </PublicLayout>
  );

  if (!food) return (
    <PublicLayout>
      <div className="text-center py-5 text-muted">Food not found</div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroReveal {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }
        .restaurant-card {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeUp 0.5s ease both;
          background: #fff;
        }
        .restaurant-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
        .order-btn {
          border: none;
          border-radius: 12px;
          padding: 12px;
          width: 100%;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .order-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }
        .order-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 30px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.15);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
          text-decoration: none;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.25);
          color: #fff;
        }
      `}</style>

      {/* HERO */}
      <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
        <img
          src={food.image}
          alt={food.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'heroReveal 0.8s ease' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.2))',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '0 60px',
        }}>
          <button onClick={() => navigate(-1)} className="back-btn" style={{ width: 'fit-content', marginBottom: '20px' }}>
            <FaArrowLeft size={14} /> Back
          </button>
          <div style={{
            display: 'inline-block',
            background: 'rgba(245,158,11,0.9)',
            color: '#fff', fontSize: '12px', fontWeight: '700',
            padding: '4px 14px', borderRadius: '20px',
            marginBottom: '12px', width: 'fit-content',
            letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {food.category}
          </div>
          <h1 style={{
            color: '#fff', fontWeight: '800',
            fontSize: 'clamp(28px, 4vw, 48px)',
            marginBottom: '12px', lineHeight: '1.2',
          }}>
            {food.name}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: '16px', maxWidth: '500px',
            lineHeight: '1.6', marginBottom: '20px',
          }}>
            {food.description}
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              borderRadius: '12px', padding: '10px 18px', color: '#fff',
              fontSize: '14px', fontWeight: '600',
            }}>
              🏪 Available at {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''}
            </div>
            {restaurants.length > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
                borderRadius: '12px', padding: '10px 18px', color: '#fff',
                fontSize: '14px', fontWeight: '600',
              }}>
                💰 Starting from ₹{Math.min(...restaurants.map(r => parseFloat(r.price)))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RESTAURANT CARDS */}
      <div style={{ background: '#f8fafc', minHeight: '400px', padding: '50px 0' }}>
        <div className="container">
          <h3 style={{ fontWeight: '800', fontSize: '24px', marginBottom: '8px', color: '#1e293b' }}>
            Choose Your Restaurant
          </h3>
          <p style={{ color: '#64748b', marginBottom: '36px' }}>
            Same dish, different kitchens — pick the best for you
          </p>

          {restaurants.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaStore size={50} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>Koi restaurant available nahi hai abhi</p>
            </div>
          ) : (
            <div className="row g-4">
              {restaurants.map((r, index) => {
                const colorScheme = RESTAURANT_COLORS[index % RESTAURANT_COLORS.length];
                return (
                  <div className="col-md-6 col-lg-4" key={r.restaurant_id}>
                    <div className="restaurant-card" style={{ animationDelay: `${index * 0.1}s` }}>

                      {/* Card Header */}
                      <div style={{
                        background: colorScheme.bg, padding: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'rgba(255,255,255,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <FaStore color="#fff" size={20} />
                          </div>
                          <div>
                            <h6 style={{ color: '#fff', fontWeight: '700', margin: 0, fontSize: '15px' }}>
                              {r.restaurant_name}
                            </h6>
                            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '12px' }}>
                              <FaMapMarkerAlt size={10} className="me-1" />
                              {r.location}
                            </p>
                          </div>
                        </div>
                        <div style={{
                          background: r.is_available ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
                          borderRadius: '20px', padding: '5px 12px',
                          color: '#fff', fontSize: '11px', fontWeight: '700',
                          display: 'flex', alignItems: 'center', gap: '5px',
                        }}>
                          {r.is_available
                            ? <><FaCheckCircle size={11} /> Available</>
                            : <><FaTimesCircle size={11} /> Unavailable</>
                          }
                        </div>
                      </div>

                      {/* Food Image */}
                      <div style={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
                        <img
                          src={food.image}
                          alt={food.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                        />
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <div>
                            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', margin: 0 }}>PRICE</p>
                            <h4 style={{ fontWeight: '800', color: '#1e293b', margin: 0, fontSize: '22px' }}>
                              ₹{r.price}
                            </h4>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', margin: 0 }}>RATING</p>
                            {/* ✅ RatingPopup yahan use ho raha hai */}
                            <RatingPopup
                              avgRating={r.average_rating}
                              totalReviews={r.total_reviews}
                              breakdown={r.breakdown}
                            />
                          </div>
                        </div>

                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          color: '#64748b', fontSize: '13px', marginBottom: '16px',
                        }}>
                          <FaClock size={12} color="#f59e0b" />
                          <span>{r.prep_time || '30-45 mins'}</span>
                        </div>

                        {r.is_available ? (
                          <button
                            className="order-btn"
                            style={{ background: colorScheme.btn }}
                            onClick={() => handleAddToCart(r.restaurant_id, r.restaurant_name, r.food_id)}
                            disabled={addingToCart === r.restaurant_id}
                          >
                            {addingToCart === r.restaurant_id ? (
                              <><span className="spinner-border spinner-border-sm" /> Adding...</>
                            ) : (
                              <><FaCartArrowDown size={16} /> Order Now</>
                            )}
                          </button>
                        ) : (
                          <button className="order-btn" style={{ background: '#94a3b8', cursor: 'not-allowed' }} disabled>
                            <FaTimesCircle size={16} /> Not Available
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default MasterFoodDetail;