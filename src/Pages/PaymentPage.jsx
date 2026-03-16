import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentPage = () => {
    
    const userId = localStorage.getItem('userId');

const [paymentMode, setPaymentMode] = useState('');
const [address, setAddress] = useState('');

const [cardDetails, setCardDetails] = useState({
  cardNumber: '',
  expiry: '',
  cvv: ''
});

const navigate = useNavigate();

const handlePlaceOrder = async () => {
    if (!address) {
  toast.error("Please enter delivery address");
  return;
}
    if(paymentMode === "online"){
        const {cardNumber, expiry, cvv} = cardDetails
        if(!cardNumber || !expiry || !cvv){
            toast.error("Please fill in full card detail")
            return;
        }
        };

        try {
                    const response = await fetch("http://127.0.0.1:8000/api/place_order/", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userId: userId,
                        address: address,
                        paymentMode: paymentMode,
                        cardNumber: paymentMode === 'online' ? cardDetails.cardNumber : '',
                        expiry: paymentMode === 'online' ? cardDetails.expiry : '',
                        cvv: paymentMode === 'online' ? cardDetails.cvv : '',
                      }),
                    });
                    const result = await response.json();
                    if (response.status === 200) {
                      toast.success(result.message);
                      setTimeout(() => {
                        navigate('/my-orders');
                      },2000)
                    } else {
                      toast.error(result.message || "Invalid Credentials");
                    }
                  } catch (error) {
                    toast.error("error", error);
                  }

    }


  return (
    <PublicLayout>
        <ToastContainer position="top-center" autoClose={2000}/>
        <div className="container py-5">

  <h3 className="text-center text-primary mb-4">
    <i className="fas fa-credit-card me-2"></i> Checkout & Payment
  </h3>

  <div className="card p-4 shadow-sm">
    
    <div className="mb-3">
      <label className="form-label fw-semibold">
        Delivery Address
      </label>

      <textarea
        className="form-control border-primary-subtle"
        rows="3"
        placeholder="Enter your full delivery address"
        value={address}
        required
        onChange={(e) => setAddress(e.target.value)}
      ></textarea>
    </div>

  </div>

    <div className="form-check mb-3">
          <label className="form-check-label">
    Cash on Delivery
  </label>
  <input
    className="form-check-input"
    type="radio"
    name="paymentMode"
    value="cod"
    required
    checked={paymentMode === 'cod'}
    onChange={() => setPaymentMode('cod')}
  />


</div>

<div className="form-check mb-3">
  <label className="form-check-label">
    Online Payment
  </label>
  <input
    className="form-check-input"
    type="radio"
    name="paymentMode"
    value="online"
    checked={paymentMode === 'online'}
    onChange={() => setPaymentMode('online')}
  />



  {paymentMode === 'online' && (
  <div className="row">

    <div className="col-md-6">
      <label className="form-label">Card Number</label>

      <input
        className="form-control"
        type="text"
        placeholder="1234 **** **** ****"
        value={cardDetails.cardNumber}
        onChange={(e) =>
          setCardDetails({
            ...cardDetails,
            cardNumber: e.target.value
          })
        }
      />
    </div>

    <div className="col-md-6">
      <label className="form-label">Expiry</label>

      <input
        className="form-control"
        type="text"
        placeholder="MM/YY"
        value={cardDetails.expiry}
        onChange={(e) =>
          setCardDetails({
            ...cardDetails,
            expiry: e.target.value
          })
        }
      />
    </div>


    <div className="col-md-6">
      <label className="form-label">CVV</label>

      <input
        className="form-control"
        type="password"
        value={cardDetails.cvv}
        onChange={(e) =>
          setCardDetails({
            ...cardDetails,
            cvv: e.target.value
          })
        }
      />
    </div>

  </div>
)}

<button className="btn btn-success mt-4 w-100" onClick={handlePlaceOrder}>
    <i className="fas fa-check-circle me-2"></i> Confirm & Place Order
</button>

</div>

</div>
    </PublicLayout>
  )
}

export default PaymentPage