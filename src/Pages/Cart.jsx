import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaMinus, FaPlus, FaShoppingCart, FaTrash } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function Cart() {

  const userId = localStorage.getItem("userId");

  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);

  const { cartCount, setCartCount } = useCart();

  const navigate = useNavigate();

  const fetchCart = async () => {

    const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`);
    const data = await res.json();

    setCartItems(data);
    setCartCount(data.length);

    const total = data.reduce(
      (sum, item) => sum + item.food.item_price * item.quantity,
      0
    );

    setGrandTotal(total);
  };

  useEffect(() => {

    if (!userId) {
      navigate("/login");
      return;
    }

    fetchCart();

  }, [userId]);



  const updateQuantity = async (orderId, newQty) => {

    if (newQty < 1) return;

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/cart/update_quantity/",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderId,
            quantity: newQty,
          }),
        }
      );

      if (response.status === 200) {

        fetchCart();

      } else {
        toast.error("Something went wrong");
      }

    } catch (error) {
      toast.error("Server error");
    }

  };



  const deleteCartItem = async (orderId) => {

    const confirmDelete = window.confirm("Are you sure you want delete this item");

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/api/cart/delete/${orderId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 200) {

        toast.success("Item removed");

        fetchCart();

      } else {
        toast.error("Something went wrong");
      }

    } catch (error) {
      toast.error("Server error");
    }

  };



  return (
    <PublicLayout>

      <ToastContainer position="top-center" autoClose={2000} />

      <div className="container py-5">

        <h2 className="mb-4 text-center d-flex justify-content-center align-items-center">
          <FaShoppingCart className="me-2" /> Your Cart
        </h2>

        {cartItems.length === 0 ? (

          <p className="text-center text-muted">Your Cart is empty</p>

        ) : (

          <>
            <div className="row">

              {cartItems.map((item) => (

                <div key={item.id} className="col-md-6 mb-4">

                  <div className="card shadow-sm">

                    <div className="row">

                      <div className="col-md-4">

                        <img
                          src={`http://127.0.0.1:8000/${item.food.image}`}
                          style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          className="img-fluid rounded-start"
                          alt=""
                        />

                      </div>

                      <div className="col-md-8">

                        <div className="card-body">

                          <h5 className="card-title">
                            {item.food.item_name}
                          </h5>

                          <p className="card-text text-muted small">
                            {item.food.item_description.slice(0, 120)}...
                          </p>

                          <p className="fw-bold text-success">
                            ₹ {item.food.item_price}
                          </p>

                          <div className="d-flex align-items-center mb-2">

                            <button
                              className="btn btn-sm btn-outline-secondary me-2"
                              disabled={item.quantity <= 1}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <FaMinus />
                            </button>

                            <span className="fw-bold px-2">
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <FaPlus />
                            </button>

                          </div>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteCartItem(item.id)}
                          >
                            <FaTrash /> Remove
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

            <div className="card p-4 mt-4 shadow-sm border-0">

              <h4 className="text-end">
                Total: ₹ {grandTotal.toFixed(2)}
              </h4>

              <div className="text-end">

                <button
                  className="btn btn-primary mt-3 px-4 py-2"
                  onClick={() => navigate("/payment")}
                >
                  <FaShoppingCart className="me-2" />
                  Proceed to payment
                </button>

              </div>

            </div>
          </>
        )}

      </div>

    </PublicLayout>
  );
}

export default Cart;