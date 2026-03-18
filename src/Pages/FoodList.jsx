import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaSearch, FaFilter, FaSortAmountDown, FaStar, FaUndoAlt, FaChevronRight } from "react-icons/fa";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [sortBy, setSortBy] = useState("relevance");
  const [hoveredId, setHoveredId] = useState(null);
  const [showRatingId, setShowRatingId] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/foods/")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredFoods(data);
      });

    fetch("http://127.0.0.1:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const sortFoods = (list, sortValue) => {
    const sorted = [...list];
    switch (sortValue) {
      case "priceLowHigh": sorted.sort((a, b) => a.item_price - b.item_price); break;
      case "priceHighLow": sorted.sort((a, b) => b.item_price - a.item_price); break;
      case "nameAZ": sorted.sort((a, b) => a.item_name.localeCompare(b.item_name)); break;
      case "nameZA": sorted.sort((a, b) => b.item_name.localeCompare(a.item_name)); break;
      default: break;
    }
    return sorted;
  };

  const applyFilters = (searchTerm, category, priceMin, priceMax, sortOverride) => {
    let result = foods;
    if (searchTerm) {
      result = result.filter(f => f.item_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (category !== 'All') {
      result = result.filter(f => f.category_name === category);
    }
    const min = typeof priceMin === "number" ? priceMin : minPrice;
    const max = typeof priceMax === "number" ? priceMax : maxPrice;
    result = result.filter(f => f.item_price >= min && f.item_price <= max);

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
      overflow: "visible" 
    }),
    ratingTooltip: {
      position: "absolute",
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      width: "220px",
      backgroundColor: "white",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      borderRadius: "15px",
      padding: "15px",
      zIndex: 10,
      marginBottom: "10px",
      border: "1px solid #eee"
    }
  };

  return (
    <PublicLayout>
      <div className="container-fluid py-5 px-lg-5" style={{ backgroundColor: "#fcfcfc" }}>
        <div className="row">
          
          {/* --- LEFT SIDEBAR (FILTERS) --- */}
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
                <select className="form-select border-0 bg-light rounded-3 shadow-none" value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); applyFilters(search, e.target.value); }}>
                  <option value="All">All Categories</option>
                  {categories.map(cat => <option key={cat.id} value={cat.category_name}>{cat.category_name}</option>)}
                </select>
              </div>

              {/* Price Slider */}
              <div className="mb-4">
                <label className="small fw-bold text-muted mb-2 d-block">PRICE: ₹{minPrice} - ₹{maxPrice}</label>
                <div className="px-2 mt-3">
                  <Slider range min={0} max={1000} value={[minPrice, maxPrice]}
                    trackStyle={[{ backgroundColor: '#ffc107' }]}
                    handleStyle={[{ borderColor: '#ffc107' }, { borderColor: '#ffc107' }]}
                    onChange={(val) => { setMinPrice(val[0]); setMaxPrice(val[1]); applyFilters(search, selectedCategory, val[0], val[1]); }}
                  />
                </div>
              </div>

              <button className="btn btn-outline-dark btn-sm w-100 rounded-pill mt-3" onClick={() => {
                setSearch(""); setSelectedCategory("All"); setMinPrice(0); setMaxPrice(500); setSortBy("relevance"); setFilteredFoods(foods);
              }}>
                <FaUndoAlt className="me-1" /> Reset All
              </button>
            </div>
          </div>

          {/* --- MAIN CONTENT (FOOD GRID) --- */}
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold m-0">Fresh <span className="text-warning">Cuisine</span></h3>
              <div className="d-flex align-items-center">
                <FaSortAmountDown className="me-2 text-muted" />
                <select className="form-select border-0 shadow-sm rounded-pill px-3" style={{ width: "200px" }}
                  value={sortBy} onChange={(e) => { setSortBy(e.target.value); applyFilters(search, selectedCategory, minPrice, maxPrice, e.target.value); }}>
                  <option value="relevance">Sort: Relevance</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="nameAZ">Name: A-Z</option>
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
                  <div className="col-md-6 col-xl-4" key={food.id}>
                    <div style={styles.foodCard(hoveredId === food.id)}
                      onMouseEnter={() => setHoveredId(food.id)} onMouseLeave={() => setHoveredId(null)}>
                      
                      {/* Image Area */}
                      <div className="position-relative" style={{ height: "200px", overflow: "hidden", borderRadius: "25px 25px 0 0" }}>
                        <img src={`http://127.0.0.1:8000${food.image}`} alt={food.item_name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.6s", transform: hoveredId === food.id ? "scale(1.1)" : "scale(1)" }}
                        />
                      </div>

                      <div className="p-4 d-flex flex-column flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0" style={{ fontSize: "1.1rem" }}>{food.item_name}</h6>
                          
                          {/* Rating with Hover Breakdown */}
                          <div className="position-relative" 
                            onMouseEnter={() => setShowRatingId(food.id)} onMouseLeave={() => setShowRatingId(null)}
                            style={{ cursor: "pointer", color: "#ffc107", fontWeight: "bold" }}>
                            4.2 <FaStar size={14} className="mb-1" />
                            
                            {showRatingId === food.id && (
                              <div style={styles.ratingTooltip}>
                                <h6 className="small fw-bold text-dark border-bottom pb-2">Reviews Summary</h6>
                                {[5, 4, 3, 2, 1].map(star => (
                                  <div key={star} className="d-flex align-items-center mb-1">
                                    <span className="small text-muted" style={{ width: "35px" }}>{star}★</span>
                                    <div className="flex-grow-1 mx-2 bg-light rounded" style={{ height: "6px" }}>
                                      <div style={{ width: star === 5 ? "75%" : "20%", height: "100%", backgroundColor: "#ffc107", borderRadius: "10px" }}></div>
                                    </div>
                                    <span className="small text-muted">{star === 5 ? 15 : 2}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-muted small mb-4">{food.item_description?.slice(0, 60)}...</p>

                        <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top">
                          <div>
                            <span className="text-muted d-block small fw-bold">Price</span>
                            <span className="fs-5 fw-bold text-dark">₹{food.item_price}</span>
                          </div>

                          {food.is_available ? (
                            <Link to={`/food/${food.id}`} className="btn btn-warning rounded-pill px-4 shadow-sm fw-bold">
                              Order <FaChevronRight size={10} className="ms-1" />
                            </Link>
                          ) : (
                            <span className="badge bg-light text-danger border rounded-pill py-2">Unavailable</span>
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