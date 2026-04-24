import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaRegStar,
  FaStore, FaCheckCircle, FaTimesCircle, FaCartArrowDown,
  FaClock, FaArrowLeft, FaFilter, FaSearch, FaUndoAlt, FaSortAmountDown
} from "react-icons/fa";


const RESTAURANT_COLORS = [
  { bg: "linear-gradient(135deg, #ff6b35, #f7931e)", btn: "#ff6b35" },
  { bg: "linear-gradient(135deg, #2d6a4f, #52b788)", btn: "#2d6a4f" },
  { bg: "linear-gradient(135deg, #1a5276, #2e86c1)", btn: "#1a5276" },
  { bg: "linear-gradient(135deg, #6c3483, #a569bd)", btn: "#6c3483" },
  { bg: "linear-gradient(135deg, #b7410e, #e74c3c)", btn: "#b7410e" },
];

const getDummyRestaurantReviews = (restaurantName = "Restaurant") => [
  {
    id: `${restaurantName}-1`,
    user_name: "Aman",
    rating: 5,
    comment: `${restaurantName} se order kiya tha, bahut tasty!`,
    created_at: "2026-04-09T09:30:00.000Z",
  },
  {
    id: `${restaurantName}-2`,
    user_name: "Sneha",
    rating: 4,
    comment: "Packaging achhi thi, delivery bhi fast.",
    created_at: "2026-04-08T16:10:00.000Z",
  },
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

const RatingPopup = ({ avgRating, totalReviews, breakdown }) => {
  const [show, setShow] = useState(false);
  const total = totalReviews || 0;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
        {renderStars(avgRating)}
        <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '3px' }}>
          {total > 0 ? `${avgRating} (${total})` : 'No reviews'}
        </span>
      </div>

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
                <span style={{ fontSize: '12px', color: '#94a3b8', minWidth: '32px', textAlign: 'right' }}>
                  {star} star
                </span>
                <div style={{ flex: 1, height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: '#f59e0b', borderRadius: '3px' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8', minWidth: '12px', textAlign: 'right' }}>
                  {count}
                </span>
              </div>
            );
          })}
          <div style={{
            position: 'absolute', bottom: '-6px', right: '20px',
            transform: 'rotate(45deg)', width: '10px', height: '10px',
            background: '#fff', borderRight: '1px solid #f1f5f9',
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
  const [openingDetail, setOpeningDetail] = useState(null);

  // ✅ Filter State
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("relevance");
  const [minRating, setMinRating] = useState(0);

  const styles = {
    sidebarCard: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      padding: "25px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      border: "1px solid #f0f0f0",
      position: "sticky",
      top: "20px"
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/master-foods/${id}/`)
      .then(res => res.json())
      .then(data => {
        setFood(data);
        setRestaurants(data.restaurants || []);
        setFilteredRestaurants(data.restaurants || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // ✅ Filter Logic
  const applyFilters = (searchTerm, priceMin, priceMax, ratingMin, sortOverride) => {
    let result = restaurants;

    if (searchTerm) {
      result = result.filter(r =>
        r.restaurant_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const minP = typeof priceMin === "number" ? priceMin : minPrice;
    const maxP = typeof priceMax === "number" ? priceMax : maxPrice;
    result = result.filter(r => r.price >= minP && r.price <= maxP);

    const minR = typeof ratingMin === "number" ? ratingMin : minRating;
    if (minR > 0) {
      result = result.filter(r => r.average_rating >= minR);
    }

    const sortValue = sortOverride || sortBy;
    const sortedResult = [...result];
    if (sortValue === "priceLowHigh") sortedResult.sort((a, b) => a.price - b.price);
    if (sortValue === "priceHighLow") sortedResult.sort((a, b) => b.price - a.price);
    if (sortValue === "nameAZ") sortedResult.sort((a, b) => a.restaurant_name.localeCompare(b.restaurant_name));
    if (sortValue === "nameZA") sortedResult.sort((a, b) => b.restaurant_name.localeCompare(a.restaurant_name));

    setFilteredRestaurants(sortedResult);
  };

  const handleOpenProductDetail = (restaurantData) => {
    if (!userId) {
      navigate("/login");
      return;
    }
    setOpeningDetail(restaurantData.restaurant_id);
    navigate(`/product/${id}/${restaurantData.restaurant_id}`, {
      state: {
        selectedProduct: {
          id,
          name: food?.name,
          image: food?.image,
          description: food?.description,
          category: food?.category,
        },
        selectedRestaurant: { ...restaurantData },
        reviews: getDummyRestaurantReviews(restaurantData.restaurant_name),
      },
    });
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.2))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px' }}>
          <button onClick={() => navigate(-1)} className="back-btn" style={{ width: 'fit-content', marginBottom: '20px' }}>
            <FaArrowLeft size={14} /> Back
          </button>
          <div style={{
            display: 'inline-block', background: 'rgba(245,158,11,0.9)', color: '#fff',
            fontSize: '12px', fontWeight: '700', padding: '4px 14px', borderRadius: '20px',
            marginBottom: '12px', width: 'fit-content', letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {food.category}
          </div>
          <h1 style={{ color: '#fff', fontWeight: '800', fontSize: 'clamp(28px, 4vw, 48px)', marginBottom: '12px', lineHeight: '1.2' }}>
            {food.name}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px', maxWidth: '500px', lineHeight: '1.6', marginBottom: '20px' }}>
            {food.description}
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 18px', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
              🏪 Available at {restaurants.length} Restaurant{restaurants.length !== 1 ? 's' : ''}
            </div>
            {restaurants.length > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 18px', color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                💰 Starting from ₹{Math.min(...restaurants.map(r => parseFloat(r.price)))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT WITH SIDEBAR */}
      <div style={{ background: '#f8fafc', minHeight: '400px', padding: '50px 0' }}>
        <div className="container-fluid px-lg-5">
          <div className="row">

            {/* ✅ LEFT SIDEBAR */}
            <div className="col-lg-3 mb-4">
              <div style={styles.sidebarCard}>
                <h5 className="fw-bold mb-4 d-flex align-items-center">
                  <FaFilter className="me-2 text-warning" /> Filters
                </h5>

                {/* Search */}
                <div className="mb-4">
                  <label className="small fw-bold text-muted mb-2">SEARCH RESTAURANT</label>
                  <div className="input-group bg-light rounded-pill px-3 py-1">
                    <FaSearch className="mt-2 text-muted" />
                    <input
                      type="text"
                      className="form-control border-0 bg-transparent shadow-none"
                      placeholder="Search name..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        applyFilters(e.target.value, minPrice, maxPrice, minRating);
                      }}
                    />
                  </div>
                </div>

                {/* Price Slider */}
                <div className="mb-4">
                  <label className="small fw-bold text-muted mb-2 d-block">
                    PRICE: ₹{minPrice} - ₹{maxPrice}
                  </label>
                  <div className="px-2 mt-3">
                    <Slider
                      range min={0} max={1000}
                      value={[minPrice, maxPrice]}
                      trackStyle={[{ backgroundColor: '#ffc107' }]}
                      handleStyle={[{ borderColor: '#ffc107' }, { borderColor: '#ffc107' }]}
                      onChange={(val) => {
                        setMinPrice(val[0]);
                        setMaxPrice(val[1]);
                        applyFilters(search, val[0], val[1], minRating);
                      }}
                    />
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-4">
                  <label className="small fw-bold text-muted mb-3 d-block">
                    CUSTOMER RATING
                  </label>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { label: "All Ratings", val: 0 },
                      { label: "4 Stars", val: 4 },
                      { label: "3 Stars", val: 3 },
                      { label: "2 Stars", val: 2 },
                      { label: "1 Star", val: 1 }
                    ].map((option) => (
                      <label key={option.val} className="d-flex align-items-center" style={{ cursor: 'pointer', fontSize: '14px', color: '#475569' }}>
                        <input
                          type="radio"
                          name="ratingFilter"
                          className="form-check-input me-2 mt-0"
                          style={{ cursor: 'pointer', accentColor: '#ffc107' }}
                          checked={minRating === option.val}
                          onChange={() => {
                            setMinRating(option.val);
                            applyFilters(search, minPrice, maxPrice, option.val);
                          }}
                        />
                        {option.val > 0 ? (
                          <span className="d-flex align-items-center gap-1">
                            {option.val} <FaStar color="#fbbf24" size={13} style={{ marginBottom: '2px' }} /> & above
                          </span>
                        ) : (
                          <span>{option.label}</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  className="btn btn-outline-dark btn-sm w-100 rounded-pill mt-3"
                  onClick={() => {
                    setSearch("");
                    setMinPrice(0);
                    setMaxPrice(1000);
                    setMinRating(0);
                    setSortBy("relevance");
                    setFilteredRestaurants(restaurants);
                  }}
                >
                  <FaUndoAlt className="me-1" /> Reset All
                </button>
              </div>
            </div>

            {/* RESTAURANT CARDS */}
            <div className="col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h3 style={{ fontWeight: '800', fontSize: '24px', marginBottom: '8px', color: '#1e293b' }}>
                    Choose Your Restaurant
                  </h3>
                  <p style={{ color: '#64748b', margin: 0 }}>
                    Same dish, different kitchens — pick the best for you
                  </p>
                </div>

                {/* ✅ Sort Dropdown */}
                <div className="d-flex align-items-center">
                  <FaSortAmountDown className="me-2 text-muted" />
                  <select
                    className="form-select border-0 shadow-sm rounded-pill px-3"
                    style={{ width: "200px" }}
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      applyFilters(search, minPrice, maxPrice, minRating, e.target.value);
                    }}
                  >
                    <option value="relevance">Sort: Relevance</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="nameAZ">Name: A-Z</option>
                    <option value="nameZA">Name: Z-A</option>
                  </select>
                </div>
              </div>

              {filteredRestaurants.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <FaStore size={50} style={{ opacity: 0.2, marginBottom: '16px' }} />
                  <p>Koi restaurant match nahi kar raha aapke filters se.</p>
                </div>
              ) : (
                <div className="row g-4">
                  {filteredRestaurants.map((r, index) => {
                    const colorScheme = RESTAURANT_COLORS[index % RESTAURANT_COLORS.length];
                    return (
                      <div className="col-md-6 col-xl-4" key={r.restaurant_id}>
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
                                <RatingPopup
                                  avgRating={r.average_rating}
                                  totalReviews={r.total_reviews}
                                  breakdown={r.breakdown}
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                              <FaClock size={12} color="#f59e0b" />
                              <span>{r.prep_time || '30-45 mins'}</span>
                            </div>

                            {r.is_available ? (
                              <button
                                className="order-btn"
                                style={{ background: colorScheme.btn }}
                                onClick={() => handleOpenProductDetail(r)}
                                disabled={openingDetail === r.restaurant_id}
                              >
                                {openingDetail === r.restaurant_id ? (
                                  <><span className="spinner-border spinner-border-sm" /> Opening...</>
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
        </div>
      </div>
    </PublicLayout>
  );
};

export default MasterFoodDetail;