import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaSearch, FaFilter, FaSortAmountDown, FaStar, FaStarHalfAlt, FaRegStar, FaUndoAlt, FaChevronRight, FaStore, FaCrown } from "react-icons/fa";


// ── Star renderer ──
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

// ── Rating Popup ──
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

// ── Main Component ──
const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/master-foods/`).then(r => r.json()),
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/foods/`).then(r => r.json()),
    ]).then(([masterFoods, restaurantFoods]) => {

      const masterFormatted = masterFoods.map(f => ({
        id: f.id,
        type: 'master',
        name: f.name,
        description: f.description,
        image: f.image,
        price: parseFloat(f.min_price) || 0,
        category: f.category,
        restaurant_count: f.restaurant_count,
        link: `/master-food/${f.id}`,
        is_available: f.restaurant_count > 0,
        average_rating: 0,
        total_reviews: 0,
        breakdown: {},
      }));

      const restaurantFormatted = restaurantFoods.map(f => ({
        id: f.id,
        type: 'restaurant',
        name: f.item_name,
        description: f.item_description,
        image: f.image,
        price: parseFloat(f.item_price) || 0,
        category: f.category_name || 'Other',
        restaurant_name: f.restaurant_name,
        restaurant_count: 1,
        link: `/food/${f.id}`,
        is_available: f.is_available,
        // ✅ Rating data
        average_rating: f.average_rating || 0,
        total_reviews: f.total_reviews || 0,
        breakdown: f.breakdown || {},
      }));

      const allFoods = [...masterFormatted, ...restaurantFormatted];
      setFoods(allFoods);
      setFilteredFoods(allFoods);

      const cats = [...new Set(allFoods.map(f => f.category).filter(Boolean))];
      setCategories(cats);
    });
  }, []);

  const sortFoods = (list, sortValue) => {
    const sorted = [...list];
    switch (sortValue) {
      case "priceLowHigh": sorted.sort((a, b) => a.price - b.price); break;
      case "priceHighLow": sorted.sort((a, b) => b.price - a.price); break;
      case "nameAZ": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "nameZA": sorted.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return sorted;
  };

  const applyFilters = (searchTerm, category, priceMin, priceMax, sortOverride) => {
    let result = foods;
    if (searchTerm) {
      result = result.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category !== 'All') {
      result = result.filter(f => f.category === category);
    }
    const min = typeof priceMin === "number" ? priceMin : minPrice;
    const max = typeof priceMax === "number" ? priceMax : maxPrice;
    result = result.filter(f => f.price >= min && f.price <= max);
    const sortValue = sortOverride || sortBy;
    result = sortFoods(result, sortValue);
    setFilteredFoods(result);
  };

  const styles = {
    sidebarCard: {
      backgroundColor: "#fff",
      borderRadius: "20px",
      padding: "25px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
      border: "1px solid #f0f0f0",
      position: "sticky",
      top: "20px"
    },
    foodCard: (isHovered) => ({
      borderRadius: "25px",
      backgroundColor: "#fff",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      transform: isHovered ? "translateY(-10px)" : "translateY(0)",
      boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.1)" : "0 5px 15px rgba(0,0,0,0.03)",
      border: "1px solid #f0f0f0",
      height: "100%",
      overflow: "visible",
    }),
  };

  return (
    <PublicLayout>
      <div className="container-fluid py-5 px-lg-5" style={{ backgroundColor: "#fcfcfc" }}>
        <div className="row">

          {/* LEFT SIDEBAR */}
          <div className="col-lg-3 mb-4">
            <div style={styles.sidebarCard}>
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <FaFilter className="me-2 text-warning" /> Filters
              </h5>

              {/* Search */}
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2">SEARCH DISH</label>
                <div className="input-group bg-light rounded-pill px-3 py-1">
                  <FaSearch className="mt-2 text-muted" />
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent shadow-none"
                    placeholder="Search name..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); applyFilters(e.target.value, selectedCategory); }}
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2">CATEGORY</label>
                <select
                  className="form-select border-0 bg-light rounded-3 shadow-none"
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); applyFilters(search, e.target.value); }}
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
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
                      applyFilters(search, selectedCategory, val[0], val[1]);
                    }}
                  />
                </div>
              </div>

              <button
                className="btn btn-outline-dark btn-sm w-100 rounded-pill mt-3"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                  setMinPrice(0);
                  setMaxPrice(1000);
                  setSortBy("relevance");
                  setFilteredFoods(foods);
                }}
              >
                <FaUndoAlt className="me-1" /> Reset All
              </button>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">
                Fresh <span className="text-warning">Cuisine</span>
                <small className="text-muted fs-6 ms-2">({filteredFoods.length} items)</small>
              </h3>
              <div className="d-flex align-items-center">
                <FaSortAmountDown className="me-2 text-muted" />
                <select
                  className="form-select border-0 shadow-sm rounded-pill px-3"
                  style={{ width: "200px" }}
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    applyFilters(search, selectedCategory, minPrice, maxPrice, e.target.value);
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

            <div className="row g-4">
              {filteredFoods.length === 0 ? (
                <div className="text-center py-5">
                  <img src="https://cdn-icons-png.flaticon.com/512/5058/5058436.png" width="80" alt="empty" className="mb-3" />
                  <p className="text-muted">No items found matching your filters.</p>
                </div>
              ) : (
                filteredFoods.map((food) => (
                  <div className="col-md-6 col-xl-4" key={`${food.type}-${food.id}`}>
                    <div
                      style={styles.foodCard(hoveredId === `${food.type}-${food.id}`)}
                      onMouseEnter={() => setHoveredId(`${food.type}-${food.id}`)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Image */}
                      <div className="position-relative" style={{ height: "200px", overflow: "hidden", borderRadius: "25px 25px 0 0" }}>
                        <img
                          src={food.image}
                          alt={food.name}
                          style={{
                            width: "100%", height: "100%", objectFit: "cover",
                            transition: "0.6s",
                            transform: hoveredId === `${food.type}-${food.id}` ? "scale(1.1)" : "scale(1)"
                          }}
                        />

                        {food.type === 'master' && (
                          <div style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: '#fff', fontSize: '10px', fontWeight: '700',
                            padding: '3px 10px', borderRadius: '20px',
                            display: 'flex', alignItems: 'center', gap: '4px',
                          }}>
                            <FaCrown size={9} /> Multi-Restaurant
                          </div>
                        )}

                        {food.type === 'restaurant' && (
                          <div style={{
                            position: 'absolute', top: '10px', left: '10px',
                            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                            color: '#fff', fontSize: '10px', fontWeight: '700',
                            padding: '3px 10px', borderRadius: '20px',
                            letterSpacing: '0.5px', textTransform: 'uppercase',
                          }}>
                            {food.category}
                          </div>
                        )}
                      </div>

                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>{food.name}</h6>

                          {food.type === 'master' ? (
                            <span style={{
                              background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                              border: '1px solid rgba(99,102,241,0.2)',
                              padding: '3px 10px', borderRadius: '20px',
                              fontSize: '11px', fontWeight: '600',
                              display: 'flex', alignItems: 'center', gap: '4px',
                              whiteSpace: 'nowrap',
                            }}>
                              <FaStore size={10} />
                              {food.restaurant_count} {food.restaurant_count === 1 ? 'place' : 'places'}
                            </span>
                          ) : (
                            <span style={{
                              background: 'rgba(16,185,129,0.1)', color: '#059669',
                              border: '1px solid rgba(16,185,129,0.2)',
                              padding: '3px 10px', borderRadius: '20px',
                              fontSize: '11px', fontWeight: '600',
                              whiteSpace: 'nowrap',
                            }}>
                              🍽️ {food.restaurant_name || 'Restaurant'}
                            </span>
                          )}
                        </div>

                        <p className="text-muted small mb-2">
                          {food.description?.slice(0, 60)}...
                        </p>

                        {/* ✅ Restaurant food pe rating dikhao */}
                        {food.type === 'restaurant' && (
                          <div style={{ marginBottom: '8px' }}>
                            <RatingPopup
                              avgRating={food.average_rating}
                              totalReviews={food.total_reviews}
                              breakdown={food.breakdown}
                            />
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                          <div>
                            <span className="text-muted d-block small fw-bold">
                              {food.type === 'master' ? 'Starting from' : 'Price'}
                            </span>
                            <span className="fs-5 fw-bold text-dark">₹{food.price}</span>
                          </div>

                          {food.is_available ? (
                            <Link
                              to={food.link}
                              className="btn btn-warning rounded-pill px-4 shadow-sm fw-bold"
                            >
                              Order <FaChevronRight size={10} className="ms-1" />
                            </Link>
                          ) : (
                            <span className="badge bg-light text-danger border rounded-pill py-2">
                              Unavailable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodList;