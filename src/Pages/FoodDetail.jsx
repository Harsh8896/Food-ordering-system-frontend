import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaCartArrowDown, FaStore } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from "../components/PublicLayout";

const BASE_URL = "http://127.0.0.1:8000";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/api/foods/${id}/`)
      .then(res => res.json())
      .then(data => {
        // API dono format return kar sakti hai — handle dono
        if (data.food) {
          setFood(data.food);
        } else {
          setFood(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) { navigate("/login"); return; }
    setAddingToCart(true);
    try {
      const res = await fetch(`${BASE_URL}/api/cart/add/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, foodId: id }),
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

  const imageUrl = food.image?.startsWith('http')
    ? food.image
    : `${BASE_URL}/${food.image}`;

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

            {/* Restaurant name */}
            {food.restaurant_name && (
              <p className="text-muted mb-4">
                <FaStore className="me-2" />
                {food.restaurant_name}
              </p>
            )}

            {/* Add to Cart Button */}
            {food.is_available !== false ? (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="btn btn-warning text-white mt-2 px-5 py-3 fw-bold"
                style={{ borderRadius: "12px", fontSize: "16px" }}
              >
                {addingToCart ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <FaCartArrowDown className="me-2" />
                    Add to Cart
                  </>
                )}
              </button>
            ) : (
              <button className="btn btn-secondary mt-2 px-5 py-3" disabled style={{ borderRadius: "12px" }}>
                Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;