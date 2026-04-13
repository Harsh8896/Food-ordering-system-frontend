import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaCartArrowDown, FaStore, FaStar, FaRegStar } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";


// ── Star renderer ──
const Stars = ({ rating, size = 14 }) => (
  <span style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i =>
      i <= Math.round(rating)
        ? <FaStar key={i} style={{ color: "#f59e0b", fontSize: size }} />
        : <FaRegStar key={i} style={{ color: "#d1d5db", fontSize: size }} />
    )}
  </span>
);

// ── Rating breakdown bar ──
const RatingBar = ({ star, count, total }) => {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 5 }}>
      <span style={{ width: 14, textAlign: "right", color: "#6b7280" }}>{star}</span>
      <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: "#f59e0b", borderRadius: 3 }} />
      </div>
      <span style={{ width: 24, color: "#9ca3af", fontSize: 12 }}>{count}</span>
    </div>
  );
};

const buildReviewSummary = (list = []) => {
  const total_reviews = list.length;
  if (!total_reviews) {
    return {
      average: 0,
      total_reviews: 0,
      breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  list.forEach((r) => {
    const rating = Math.max(1, Math.min(5, Number(r.rating) || 0));
    const rounded = Math.round(rating);
    breakdown[rounded] += 1;
    sum += rating;
  });

  return {
    average: (sum / total_reviews).toFixed(1),
    total_reviews,
    breakdown,
  };
};

// ── Single review card ──
const ReviewCard = ({ review }) => {
  const initials = review.user_name
    ? review.user_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{
      background: "#fff", border: "0.5px solid #e5e7eb",
      borderRadius: 12, padding: "1rem 1.25rem", marginBottom: 12
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "#eff6ff", display: "flex", alignItems: "center",
          justifyContent: "center", fontWeight: 500, fontSize: 13,
          color: "#3b82f6", flexShrink: 0
        }}>{initials}</div>

        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>{review.user_name || "Anonymous"}</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>{timeAgo(review.created_at)}</p>
        </div>
      </div>

      <Stars rating={review.rating} size={13} />
      {review.comment && (
        <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.6, marginTop: 6 }}>
          {review.comment}
        </p>
      )}
    </div>
  );
};

// ── Review Summary Section ──
const ReviewSection = ({ foodId, staticSummary = null, staticReviews = [] }) => {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (staticSummary || staticReviews.length > 0) {
      setSummary(staticSummary || buildReviewSummary(staticReviews));
      setReviews(staticReviews);
      return;
    }

    if (!foodId) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food_rating_summary/${foodId}/`)
      .then(r => r.json()).then(setSummary).catch(() => {});

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${foodId}/`)
      .then(r => r.json()).then(setReviews).catch(() => {});
  }, [foodId, staticSummary, staticReviews]);

  if (!summary || summary.total_reviews === 0) return (
    <div style={{ borderTop: "0.5px solid #e5e7eb", marginTop: "2rem", paddingTop: "1.5rem" }}>
      <h5 style={{ fontWeight: 500, marginBottom: 8 }}>Customer reviews</h5>
      <p style={{ color: "#9ca3af", fontSize: 14 }}>No reviews yet. Be the first to review!</p>
    </div>
  );

  const displayed = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div style={{ borderTop: "0.5px solid #e5e7eb", marginTop: "2rem", paddingTop: "1.5rem" }}>
      <h5 style={{ fontWeight: 500, fontSize: 18, marginBottom: "1.25rem" }}>Customer reviews</h5>

      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, fontWeight: 500, lineHeight: 1 }}>{summary.average}</div>
          <div style={{ margin: "6px 0 4px" }}><Stars rating={summary.average} size={16} /></div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>{summary.total_reviews} reviews</div>
        </div>

        <div>
          {[5, 4, 3, 2, 1].map(star => (
            <RatingBar
              key={star}
              star={star}
              count={summary.breakdown?.[star] || 0}
              total={summary.total_reviews}
            />
          ))}
        </div>
      </div>

      {displayed.map(review => <ReviewCard key={review.id} review={review} />)}

      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{
            background: "none", border: "0.5px solid #d1d5db",
            borderRadius: 8, padding: "8px 20px", fontSize: 14,
            cursor: "pointer", color: "#374151", marginTop: 4
          }}
        >
          {showAll ? "Show less" : `Show all ${reviews.length} reviews`}
        </button>
      )}
    </div>
  );
};

// ── Main FoodDetail Component ──
const FoodDetail = () => {
  const { id, productId, restaurantId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const isComparisonFlow = Boolean(productId && restaurantId);

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [staticReviews, setStaticReviews] = useState([]);
  const [staticSummary, setStaticSummary] = useState(null);

  useEffect(() => {
    if (isComparisonFlow) {
      const selectedProduct = location.state?.selectedProduct || {};
      const selectedRestaurant = location.state?.selectedRestaurant || {};

      const productData = {
        id: selectedRestaurant.food_id || selectedProduct.id || productId,
        item_name: selectedProduct.name || "Selected Dish",
        item_description: selectedProduct.description || "Tasty dish from selected restaurant.",
        item_price: selectedRestaurant.price || selectedProduct.price || 0,
        image: selectedProduct.image || "",
        restaurant_name: selectedRestaurant.restaurant_name || `Restaurant #${restaurantId}`,
        is_available: selectedRestaurant.is_available !== false,
      };

      setFood(productData);

      // ✅ Real food_id se API se reviews fetch karo — no hardcoded data
      const realFoodId = selectedRestaurant.food_id || selectedProduct.id || productId;

      if (realFoodId) {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${realFoodId}/`)
          .then(r => r.json())
          .then(reviews => {
            const reviewList = Array.isArray(reviews) ? reviews : [];
            setStaticReviews(reviewList);
            setStaticSummary(buildReviewSummary(reviewList));
          })
          .catch(() => {
            setStaticReviews([]);
            setStaticSummary(buildReviewSummary([]));
          });
      } else {
        setStaticReviews([]);
        setStaticSummary(buildReviewSummary([]));
      }

      setLoading(false);
      return;
    }

    // Normal flow
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/foods/${id}/`)
      .then(res => res.json())
      .then(data => {
        setFood(data.food || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, productId, restaurantId, isComparisonFlow, location.state]);

  const handleAddToCart = async () => {
    if (!userId) { navigate("/login"); return; }

    const targetFoodId = isComparisonFlow
      ? (food?.id || productId)
      : id;

    setAddingToCart(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, foodId: targetFoodId }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Item added to cart!");
        setTimeout(() => navigate("/cart"), 1500);
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setAddingToCart(false);
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

  const imageUrl = food.image
    ? (food.image.startsWith("http") ? food.image : `${import.meta.env.VITE_BACKEND_URL}${food.image}`)
    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80";

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5">
        <div className="row align-items-center">

          {/* Image */}
          <div className="col-md-5 text-center mb-4 mb-md-0">
            <Zoom>
              <img
                src={imageUrl}
                style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "20px" }}
                alt={food.item_name || food.name}
              />
            </Zoom>
          </div>

          {/* Details */}
          <div className="col-md-7">
            <h2 className="fw-bold mb-2">{food.item_name || food.name}</h2>
            <p className="text-muted mb-3" style={{ lineHeight: "1.7" }}>
              {food.item_description || food.description}
            </p>

            <h4 className="text-success fw-bold mb-3">
              ₹ {food.item_price || food.price}
            </h4>

            {food.restaurant_name && (
              <p className="text-muted mb-4">
                <FaStore className="me-2" />
                {food.restaurant_name}
              </p>
            )}

            {food.is_available !== false ? (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-warning text-white mt-2 px-5 py-3 fw-bold"
                style={{ borderRadius: "12px", fontSize: "16px" }}
              >
                {addingToCart ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Adding...</>
                ) : (
                  <><FaCartArrowDown className="me-2" />Add to Cart</>
                )}
              </button>
            ) : (
              <button className="btn btn-secondary mt-2 px-5 py-3" disabled style={{ borderRadius: "12px" }}>
                Currently Unavailable
              </button>
            )}
          </div>
        </div>

        {/* ✅ Comparison flow mein bhi real food ID pass ho rahi hai */}
        <ReviewSection
          foodId={isComparisonFlow ? (food?.id || null) : id}
          staticSummary={isComparisonFlow ? staticSummary : null}
          staticReviews={isComparisonFlow ? staticReviews : []}
        />
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;