import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.status === 200) {

        toast.success(result.message || "Login successfully");

        localStorage.setItem("userId", result.userId);
        localStorage.setItem("userName", result.userName);

        setFormData({
          email: "",
          password: "",
        });

        setTimeout(() => {
          navigate("/");
        }, 2000);

      } else {
        toast.error(result.message || "Invalid Credentials");
      }

    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <PublicLayout>

      <div className="container py-5">

        <div className="row justify-content-center shadow-lg rounded-4 overflow-hidden">

          {/* LEFT SIDE IMAGE */}

          <div className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center bg-light p-4">

            <img
              src="/img/login.jpg"
              className="img-fluid mb-3"
              style={{ maxHeight: "320px" }}
              alt="login"
            />

            <h5 className="fw-bold">Login is fast, secure and free</h5>

            <p className="text-muted text-center small">
              Join our food family and enjoy delicious food delivered to your door!
            </p>

          </div>

          {/* RIGHT SIDE FORM */}

          <div className="col-md-6 bg-white p-5">

            <h3 className="text-center fw-bold mb-4">
              User Login
            </h3>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label fw-semibold">
                  Email or Mobile
                </label>

                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.email}
                  name="email"
                  className="form-control form-control-lg"
                  placeholder="Enter email or mobile number"
                  required
                />

              </div>

              <div className="mb-4">

                <label className="form-label fw-semibold">
                  Password
                </label>

                <input
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  name="password"
                  className="form-control form-control-lg"
                  placeholder="Enter password"
                  required
                />

              </div>

              <button className="btn btn-primary w-100 btn-lg">
                Login
              </button>

            </form>

          </div>

        </div>

        <ToastContainer position="top-right" autoClose={2000} />

      </div>

    </PublicLayout>
  );
};

export default Login;