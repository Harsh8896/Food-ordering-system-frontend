import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaLock, FaCreditCard, FaTruck, FaShoppingCart } from "react-icons/fa";

const PaymentPage = () => {
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // States for Cart Data
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // States for Form
  const [paymentMode, setPaymentMode] = useState('cod');
  const [address, setAddress] = useState('');
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '' });

  // --- Naya Logic: Cart Data Fetch karne ke liye ---
  const fetchCartDetails = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`);
      const data = await res.json();
      setCartItems(data);
      
      // Total Calculate karna
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
    fetchCartDetails(); // Page load hote hi cart ka data mangwao
  }, [userId]);
  // -----------------------------------------------

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error("Please enter delivery address");
      return;
    }
    if (paymentMode === "online") {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv) {
        toast.error("Please fill in full card details");
        return;
      }
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/place_order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          address: address,
          paymentMode: paymentMode,
          totalAmount: grandTotal, // Humne total amount bhi bhej diya
          cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
          expiry: paymentMode === 'online' ? cardDetails.expiry : '',
          cvv: paymentMode === 'online' ? cardDetails.cvv : '',
        }),
      });
      const result = await response.json();
      if (response.status === 200) {
        toast.success(result.message);
        setTimeout(() => navigate('/my-orders'), 2000);
      } else {
        toast.error(result.message || "Order failed");
      }
    } catch (error) {
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
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h5 className="mb-3">Delivery Address</h5>
              <textarea
                className="form-control border-primary-subtle"
                rows="3"
                placeholder="Enter your full address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <div className="card shadow-sm border-0 p-4">
              <h5 className="mb-4">Select Payment Method</h5>
              
              <div className={`form-check p-3 border rounded mb-3 ${paymentMode === 'cod' ? 'bg-light border-primary' : ''}`}>
                <input className="form-check-input ms-0 me-3" type="radio" name="pay" checked={paymentMode === 'cod'} onChange={() => setPaymentMode('cod')} />
                <label className="form-check-label fw-bold"><FaTruck className="me-2"/> Cash on Delivery</label>
              </div>

              <div className={`form-check p-3 border rounded ${paymentMode === 'online' ? 'bg-light border-primary' : ''}`}>
                <input className="form-check-input ms-0 me-3" type="radio" name="pay" checked={paymentMode === 'online'} onChange={() => setPaymentMode('online')} />
                <label className="form-check-label fw-bold"><FaCreditCard className="me-2"/> Online Payment</label>

                {paymentMode === 'online' && (
                  <div className="row mt-3 g-3">
                    <div className="col-12">
                      <input type="text" className="form-control" placeholder="Card Number" onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <input type="text" className="form-control" placeholder="MM/YY" onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <input type="password" className="form-control" placeholder="CVV" onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Order Summary (Yahan Cart API ka data dikhega) */}
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
              <button className="btn btn-primary w-100 py-3 fw-bold" onClick={handlePlaceOrder}>
                Confirm Order (₹{grandTotal.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PaymentPage;