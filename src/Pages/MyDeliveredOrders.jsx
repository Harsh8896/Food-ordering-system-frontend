import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';

const MyDeliveredOrders = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReview, setActiveReview] = useState(null); // konsa food review ho raha hai
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchDeliveredOrders();
  }, [userId]);

  const fetchDeliveredOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delivered-orders/${userId}/`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (order) => {
    setActiveReview(order);
    setRating(order.my_rating || 0);
    setComment(order.my_comment || '');
    setHoveredRating(0);
  };

  const handleSubmitReview = async () => {
    if (rating < 1) {
      toast.error('Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/add/${activeReview.food_id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          rating: rating,
          comment: comment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Review submitted!');
        setActiveReview(null);
        setRating(0);
        setComment('');
        fetchDeliveredOrders(); // refresh list
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count, interactive = false) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        size={interactive ? 28 : 16}
        style={{
          cursor: interactive ? 'pointer' : 'default',
          color: star <= (interactive ? (hoveredRating || rating) : count)
            ? '#ffc107'
            : '#dee2e6',
          marginRight: '4px',
          transition: '0.15s',
        }}
        onClick={interactive ? () => setRating(star) : undefined}
        onMouseEnter={interactive ? () => setHoveredRating(star) : undefined}
        onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
      />
    ));
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5">
        <h3 className="text-center mb-5 fw-bold">
          <FaBoxOpen className="text-warning me-2" size={36} />
          My Delivered Orders
        </h3>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <FaBoxOpen size={60} className="mb-3 text-warning" />
            <p>Koi delivered order nahi mila abhi tak.</p>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order, index) => (
              <div className="col-md-6" key={index}>
                <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>

                  {/* Food Image */}
                  <div style={{ position: 'relative' }}>
                    <img
                      src={order.food_image}
                      alt={order.food_name}
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                    />
                    <span
                      className="badge bg-success"
                      style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '12px', padding: '6px 12px', borderRadius: '20px' }}
                    >
                      <FaCheckCircle className="me-1" /> Delivered
                    </span>
                  </div>

                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-1">{order.food_name}</h5>
                    <p className="text-muted small mb-1">Order # {order.order_number}</p>
                    <p className="text-muted small mb-3">
                      Qty: {order.quantity} &nbsp;|&nbsp;
                      <span className="text-success fw-bold">₹{order.food_price}</span>
                    </p>

                    {/* Already reviewed */}
                    {order.already_reviewed ? (
                      <div className="bg-light rounded p-3">
                        <p className="mb-1 small fw-bold text-success">
                          <FaCheckCircle className="me-1" /> Aapne review diya hai
                        </p>
                        <div className="mb-1">{renderStars(order.my_rating)}</div>
                        <p className="text-muted small mb-0">"{order.my_comment}"</p>
                      </div>
                    ) : (
                      <button
                        className="btn btn-warning w-100 fw-bold"
                        style={{ borderRadius: '10px' }}
                        onClick={() => handleOpenReview(order)}
                      >
                        <FaStar className="me-2" />
                        Rate this item
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {activeReview && (
          <div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 9999,
            }}
            onClick={(e) => e.target === e.currentTarget && setActiveReview(null)}
          >
            <div
              className="bg-white p-4 shadow-lg"
              style={{ borderRadius: '20px', width: '100%', maxWidth: '420px' }}
            >
              <h5 className="fw-bold mb-1">{activeReview.food_name}</h5>
              <p className="text-muted small mb-4">Order # {activeReview.order_number}</p>

              {/* Star Rating */}
              <p className="fw-bold mb-2">Rating do:</p>
              <div className="mb-3 d-flex">
                {renderStars(rating, true)}
              </div>

              {/* Comment */}
              <div className="mb-4">
                <label className="fw-bold mb-1 small">Comment (optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Aapka experience kaisa raha?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ borderRadius: '10px' }}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary flex-grow-1"
                  onClick={() => setActiveReview(null)}
                  style={{ borderRadius: '10px' }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-warning flex-grow-1 fw-bold"
                  onClick={handleSubmitReview}
                  disabled={submitting}
                  style={{ borderRadius: '10px' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default MyDeliveredOrders;