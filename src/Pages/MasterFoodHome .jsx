import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { FaStore, FaSearch, FaFire } from "react-icons/fa";


const MasterFoodHome = () => {
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/master-foods/`)
      .then(res => res.json())
      .then(data => {
        setFoods(data);
        setFiltered(data);
        // Unique categories
        const cats = ["All", ...new Set(data.map(f => f.category))];
        setCategories(cats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter by category + search
  useEffect(() => {
    let result = foods;
    if (activeCategory !== "All") {
      result = result.filter(f => f.category === activeCategory);
    }
    if (search) {
      result = result.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    }
    setFiltered(result);
  }, [activeCategory, search, foods]);

  return (
    <PublicLayout>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .food-card {
          border-radius: 20px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: fadeUp 0.5s ease both;
          text-decoration: none;
          display: block;
          color: inherit;
        }
        .food-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.13);
          color: inherit;
        }
        .food-card img {
          transition: transform 0.4s ease;
        }
        .food-card:hover img {
          transform: scale(1.06);
        }
        .cat-btn {
          border: 2px solid #e2e8f0;
          background: #fff;
          border-radius: 30px;
          padding: 8px 20px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }
        .cat-btn.active {
          background: #f59e0b;
          border-color: #f59e0b;
          color: #fff;
        }
        .cat-btn:hover:not(.active) {
          border-color: #f59e0b;
          color: #f59e0b;
        }
        .search-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border-radius: 50px;
          padding: 10px 20px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          max-width: 500px;
          margin: 0 auto;
        }
        .search-wrap input {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
          color: #1e293b;
        }
        .hero-section {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e293b 100%);
          padding: 70px 0 50px;
          text-align: center;
        }
        .price-badge {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #fff;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
        }
        .restaurant-count {
          background: rgba(99,102,241,0.1);
          color: #6366f1;
          border: 1px solid rgba(99,102,241,0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
      `}</style>

      {/* ── HERO ── */}
      <div className="hero-section">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: '20px', padding: '6px 16px',
          color: '#f59e0b', fontSize: '13px', fontWeight: '700',
          marginBottom: '20px',
        }}>
          <FaFire /> Curated Menu
        </div>

        <h1 style={{
          color: '#fff', fontWeight: '800',
          fontSize: 'clamp(28px, 4vw, 48px)',
          marginBottom: '12px',
        }}>
          What are you craving today?
        </h1>
        <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '16px' }}>
          Choose a dish and find the best restaurant near you
        </p>

        {/* Search */}
        <div className="search-wrap">
          <FaSearch color="#94a3b8" />
          <input
            type="text"
            placeholder="Search for a dish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ background: '#f8fafc', minHeight: '60vh', padding: '40px 0' }}>
        <div className="container">

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '36px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Food Grid */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p>Koi item nahi mila</p>
            </div>
          ) : (
            <div className="row g-4">
              {filtered.map((food, index) => (
                <div className="col-md-6 col-lg-4 col-xl-3" key={food.id}>
                  <Link
                    to={`/master-food/${food.id}`}
                    className="food-card"
                    style={{ animationDelay: `${index * 0.07}s` }}
                  >
                    {/* Image */}
                    <div style={{ overflow: 'hidden', height: '200px', position: 'relative' }}>
                      <img
                        src={food.image}
                        alt={food.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Category tag */}
                      <div style={{
                        position: 'absolute', top: '12px', left: '12px',
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                        color: '#fff', fontSize: '11px', fontWeight: '700',
                        padding: '3px 10px', borderRadius: '20px',
                        letterSpacing: '0.5px', textTransform: 'uppercase',
                      }}>
                        {food.category}
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{ padding: '18px' }}>
                      <h5 style={{ fontWeight: '700', color: '#1e293b', marginBottom: '6px', fontSize: '16px' }}>
                        {food.name}
                      </h5>
                      <p style={{
                        color: '#64748b', fontSize: '13px',
                        marginBottom: '14px', lineHeight: '1.5',
                        display: '-webkit-box', WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {food.description}
                      </p>

                      {/* Price + Restaurant count */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="price-badge">
                          From ₹{food.min_price}
                        </span>
                        <span className="restaurant-count">
                          <FaStore size={11} className="me-1" />
                          {food.restaurant_count} {food.restaurant_count === 1 ? 'place' : 'places'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default MasterFoodHome;