import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaCreditCard, FaTruck, FaMapMarkerAlt, FaCrosshairs } from "react-icons/fa";

const PaymentPage = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paymentMode, setPaymentMode] = useState('cod');
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [locating, setLocating] = useState(false);

  const fetchCartDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}/`);
      const data = await res.json();
      setCartItems(data);
      const total = data.reduce((sum, item) => sum + item.food.item_price * item.quantity, 0);
      setGrandTotal(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    fetchCartDetails();
  }, [userId]);

  // Auto location detect karo
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location support nahi hai aapke browser mein");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // OpenStreetMap Nominatim API — free, no key needed
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          // Address parts combine karo
          const addr = data.address;
          const parts = [
            addr.house_number,
            addr.building,
            addr.road || addr.street,
            addr.neighbourhood || addr.quarter,
            addr.suburb || addr.village || addr.hamlet,
            addr.city_district || addr.district,
            addr.city || addr.town || addr.county,
            addr.state_district,
            addr.state,
            addr.postcode,
            addr.country,
          ].filter(Boolean);

          setAddress(parts.join(', '));
          toast.success("Location detect ho gayi!");
        } catch {
          toast.error("Address fetch nahi hua, manually enter karo");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied. Browser settings mein allow karo.");
        } else {
          toast.error("Location detect nahi hua");
        }
      },
      { timeout: 10000 }
    );
  };

  const handlePlaceOrder = async () => {
    if (!address) { toast.error("Please enter delivery address"); return; }
    if (paymentMode === "online") {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv) {
        toast.error("Please fill in full card details");
        return;
      }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/place_order/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId, address, paymentMode,
          totalAmount: grandTotal,
          cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
          expiry: paymentMode === 'online' ? cardDetails.expiry : '',
          cvv: paymentMode === 'online' ? cardDetails.cvv : '',
        }),
      });
      const result = await response.json();
      if (response.status === 200) {
        toast.success(result.message);
        // ✅ Multiple orders handle karo
        setTimeout(() => navigate('/my-orders'), 2000);
      } else {
        toast.error(result.message || "Order failed");
      }
    } catch {
      toast.error("Server error occurred");
    }
};

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5">
        <h3 className="text-center mb-5 fw-bold text-primary">
          <FaLock className="me-2" /> Checkout
        </h3>

        <div className="row g-4">

          {/* Left: Payment Form */}
          <div className="col-lg-8">

            {/* Address Card */}
            <div className="card shadow-sm border-0 p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <FaMapMarkerAlt className="text-danger" />
                  Delivery Address
                </h5>

                {/* Location Button */}
                <button
                  onClick={handleGetLocation}
                  disabled={locating}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '20px',
                    border: '1px solid #0d6efd',
                    background: locating ? '#f0f4ff' : '#fff',
                    color: '#0d6efd', fontSize: '13px', fontWeight: '600',
                    cursor: locating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => !locating && (e.currentTarget.style.background = '#f0f4ff')}
                  onMouseLeave={e => !locating && (e.currentTarget.style.background = '#fff')}
                >
                  <FaCrosshairs
                    size={14}
                    style={{
                      animation: locating ? 'spin 1s linear infinite' : 'none',
                    }}
                  />
                  {locating ? 'Detecting...' : 'Use My Location'}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <FaMapMarkerAlt
                  style={{
                    position: 'absolute', top: '14px', left: '14px',
                    color: '#dc3545', fontSize: '16px', zIndex: 1,
                  }}
                />
                <textarea
                  className="form-control border-primary-subtle"
                  rows="3"
                  placeholder="Enter your full address or click 'Use My Location'..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ paddingLeft: '38px', resize: 'none' }}
                />
              </div>

              {address && (
                <p style={{ color: '#22c55e', fontSize: '12px', marginTop: '6px', marginBottom: 0 }}>
                  ✓ Address set hai
                </p>
              )}
            </div>

            {/* Payment Method Card */}
            <div className="card shadow-sm border-0 p-4">
              <h5 className="mb-4">Select Payment Method</h5>

              <div className={`form-check p-3 border rounded mb-3 ${paymentMode === 'cod' ? 'bg-light border-primary' : ''}`}>
                <input
                  className="form-check-input ms-0 me-3"
                  type="radio" name="pay"
                  checked={paymentMode === 'cod'}
                  onChange={() => setPaymentMode('cod')}
                />
                <label className="form-check-label fw-bold">
                  <FaTruck className="me-2" /> Cash on Delivery
                </label>
              </div>

              <div className={`form-check p-3 border rounded ${paymentMode === 'online' ? 'bg-light border-primary' : ''}`}>
                <input
                  className="form-check-input ms-0 me-3"
                  type="radio" name="pay"
                  checked={paymentMode === 'online'}
                  onChange={() => setPaymentMode('online')}
                />
                <label className="form-check-label fw-bold">
                  <FaCreditCard className="me-2" /> Online Payment
                </label>

                {paymentMode === 'online' && (
                  <div className="row mt-3 g-3">
                    <div className="col-12">
                      <input type="text" className="form-control" placeholder="Card Number"
                        onChange={e => setCardDetails({ ...cardDetails, cardNumber: e.target.value })} />
                    </div>
                    <div className="col-6">
                      <input type="text" className="form-control" placeholder="MM/YY"
                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                    </div>
                    <div className="col-6">
                      <input type="password" className="form-control" placeholder="CVV"
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: '20px' }}>
              <h5 className="mb-4">Order Summary</h5>
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex justify-content-between mb-2 small">
                  <span>{item.food.item_name} (x{item.quantity})</span>
                  <span>₹{item.food.item_price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold h5">Total</span>
                <span className="fw-bold h5 text-success">₹{grandTotal.toFixed(2)}</span>
              </div>
              <button
                className="btn btn-primary w-100 py-3 fw-bold"
                onClick={handlePlaceOrder}
              >
                Confirm Order (₹{grandTotal.toFixed(2)})
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PublicLayout>
  );
};

export default PaymentPage;