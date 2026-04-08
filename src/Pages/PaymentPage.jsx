import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaTruck, FaMapMarkerAlt, FaCrosshairs, FaMobileAlt } from "react-icons/fa";

const RAZORPAY_KEY = "rzp_test_SXX1ULpeISDp4x";

// Razorpay script dynamically load karo
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentPage = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [paymentMode, setPaymentMode] = useState("cod");
  const [address, setAddress] = useState("");
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCartDetails = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}/`
      );
      const data = await res.json();
      setCartItems(data);
      const total = data.reduce(
        (sum, item) => sum + item.food.item_price * item.quantity,
        0
      );
      setGrandTotal(total);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCartDetails();
  }, [userId]);

  // ── Location detect ──
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
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
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
          setAddress(parts.join(", "));
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
          toast.error("Location permission denied.");
        } else {
          toast.error("Location detect nahi hua");
        }
      },
      { timeout: 10000 }
    );
  };

  // ── Final order backend pe place karo (COD & Razorpay dono ke liye) ──
  const placeOrderOnBackend = async (paymentModeOverride, razorpayPaymentId = "") => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/place_order/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          address,
          paymentMode: paymentModeOverride,
          totalAmount: grandTotal,
          // Razorpay payment ID reference ke liye (optional tracking)
          cardNumber: razorpayPaymentId,
          expiry: "",
          cvv: "",
        }),
      }
    );
    return response;
  };

  // ── COD Order ──
  const handleCODOrder = async () => {
    if (!address) {
      toast.error("Please enter delivery address");
      return;
    }
    setLoading(true);
    try {
      const response = await placeOrderOnBackend("cod");
      const result = await response.json();
      if (response.status === 200) {
        toast.success(result.message);
        setTimeout(() => navigate("/my-orders"), 2000);
      } else {
        toast.error(result.message || "Order failed");
      }
    } catch {
      toast.error("Server error occurred");
    } finally {
      setLoading(false);
    }
  };

  // ── Razorpay Online Payment ──
  const handleRazorpayPayment = async () => {
    if (!address) {
      toast.error("Please enter delivery address");
      return;
    }

    setLoading(true);

    // 1. Razorpay SDK load karo
    const sdkLoaded = await loadRazorpayScript();
    if (!sdkLoaded) {
      toast.error("Razorpay load nahi hua. Internet check karo.");
      setLoading(false);
      return;
    }

    try {
      // 2. Backend se Razorpay order create karo
      const orderRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/create_razorpay_order/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal }),
        }
      );
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.error("Payment initiate nahi hua");
        setLoading(false);
        return;
      }

      // 3. Razorpay checkout open karo
      const options = {
        key: RAZORPAY_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "FoodSys",
        description: "Food Order Payment",
        order_id: orderData.razorpay_order_id,

        handler: async function (paymentResponse) {
          // 4. Payment verify karo backend pe
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/verify_razorpay_payment/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: paymentResponse.razorpay_order_id,
                  razorpay_payment_id: paymentResponse.razorpay_payment_id,
                  razorpay_signature: paymentResponse.razorpay_signature,
                }),
              }
            );
            const verifyData = await verifyRes.json();

            if (verifyData.verified) {
              // 5. Verified hone ke baad order place karo
              const orderPlaceRes = await placeOrderOnBackend(
                "online",
                paymentResponse.razorpay_payment_id
              );
              const orderPlaceData = await orderPlaceRes.json();

              if (orderPlaceRes.status === 200) {
                toast.success("Payment successful! " + orderPlaceData.message);
                setTimeout(() => navigate("/my-orders"), 2000);
              } else {
                toast.error(orderPlaceData.message || "Order place nahi hua");
              }
            } else {
              toast.error("Payment verification failed. Support se contact karo.");
            }
          } catch {
            toast.error("Verification error. Support se contact karo.");
          }
          setLoading(false);
        },

        prefill: {
          name: localStorage.getItem("userName") || "",
          email: "",
          contact: "",
        },

        theme: { color: "#0d6efd" },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error("Payment failed: " + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  // ── Main handler ──
  const handlePlaceOrder = () => {
    if (paymentMode === "cod") {
      handleCODOrder();
    } else {
      handleRazorpayPayment();
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
          {/* Left: Form */}
          <div className="col-lg-8">

            {/* Address Card */}
            <div className="card shadow-sm border-0 p-4 mb-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2">
                  <FaMapMarkerAlt className="text-danger" />
                  Delivery Address
                </h5>
                <button
                  onClick={handleGetLocation}
                  disabled={locating}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", borderRadius: "20px",
                    border: "1px solid #0d6efd",
                    background: locating ? "#f0f4ff" : "#fff",
                    color: "#0d6efd", fontSize: "13px", fontWeight: "600",
                    cursor: locating ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <FaCrosshairs
                    size={14}
                    style={{ animation: locating ? "spin 1s linear infinite" : "none" }}
                  />
                  {locating ? "Detecting..." : "Use My Location"}
                </button>
              </div>

              <div style={{ position: "relative" }}>
                <FaMapMarkerAlt
                  style={{
                    position: "absolute", top: "14px", left: "14px",
                    color: "#dc3545", fontSize: "16px", zIndex: 1,
                  }}
                />
                <textarea
                  className="form-control border-primary-subtle"
                  rows="3"
                  placeholder="Enter your full address or click 'Use My Location'..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ paddingLeft: "38px", resize: "none" }}
                />
              </div>
              {address && (
                <p style={{ color: "#22c55e", fontSize: "12px", marginTop: "6px", marginBottom: 0 }}>
                  ✓ Address set hai
                </p>
              )}
            </div>

            {/* Payment Method Card */}
            <div className="card shadow-sm border-0 p-4">
              <h5 className="mb-4">Select Payment Method</h5>

              {/* COD Option */}
              <div
                className={`p-3 border rounded mb-3 ${paymentMode === "cod" ? "bg-light border-primary" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setPaymentMode("cod")}
              >
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="radio" name="pay"
                    checked={paymentMode === "cod"}
                    onChange={() => setPaymentMode("cod")}
                  />
                  <FaTruck className="text-success" size={20} />
                  <div>
                    <div className="fw-bold">Cash on Delivery</div>
                    <small className="text-muted">Delivery ke waqt cash dein</small>
                  </div>
                </div>
              </div>

              {/* Razorpay Option */}
              <div
                className={`p-3 border rounded ${paymentMode === "online" ? "bg-light border-primary" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => setPaymentMode("online")}
              >
                <div className="d-flex align-items-center gap-3">
                  <input
                    type="radio" name="pay"
                    checked={paymentMode === "online"}
                    onChange={() => setPaymentMode("online")}
                  />
                  <FaMobileAlt className="text-primary" size={20} />
                  <div>
                    <div className="fw-bold">Online Payment</div>
                    <small className="text-muted">
                      UPI, Cards, Net Banking — Razorpay se secure payment
                    </small>
                  </div>
                </div>

                {paymentMode === "online" && (
                  <div
                    className="mt-3 p-3 rounded"
                    style={{ background: "#f8faff", border: "1px dashed #0d6efd" }}
                  >
                    <div className="d-flex align-items-center gap-2 text-primary">
                      <FaLock size={13} />
                      <small className="fw-semibold">
                        "Confirm Order" click karne par Razorpay secure checkout khulega.
                        UPI / Card / Net Banking sab accept hote hain.
                      </small>
                    </div>
                    {/* Razorpay badge */}
                    <div className="mt-2 d-flex align-items-center gap-2">
                      <img
                        src="https://razorpay.com/assets/razorpay-logo.svg"
                        alt="Razorpay"
                        style={{ height: "20px", opacity: 0.8 }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                      <small className="text-muted">Powered by Razorpay</small>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 p-4 sticky-top" style={{ top: "20px" }}>
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
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Processing...
                  </>
                ) : (
                  `Confirm Order (₹${grandTotal.toFixed(2)})`
                )}
              </button>

              {paymentMode === "online" && (
                <p className="text-center text-muted mt-2" style={{ fontSize: "11px" }}>
                  <FaLock size={10} className="me-1" />
                  256-bit SSL encrypted secure payment
                </p>
              )}
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