import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    password: "",
    repeatPassword: "",
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

    const { firstname, lastname, email, mobile, password, repeatPassword } =
      formData;

    if (password !== repeatPassword) {
      toast.error("Password and confirm password do not match");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname, lastname, email, mobile, password }),
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message || "You have successfully registered");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          mobile: "",
          password: "",
          repeatPassword: "",
        });
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("error", error);
      console.log(error)
    }
  };

  return (
    <PublicLayout>
      <div className="container py-5 ">
        <div className="row shadow-lg rounded-4 d-flex justify-content-between align-items-center">
          <div className="col-md-6 p-4">
            <h3 className="text-center mb-4">
              <i className="fas-fa-user-plus me-2 ">User Registration</i>
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.firstname}
                  name="firstname"
                  className="form-control"
                  placeholder="First Name"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  onChange={handleChange}
                  value={formData.lastname}
                  name="lastname"
                  className="form-control"
                  placeholder="Last Name"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  onChange={handleChange}
                  value={formData.email}
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  onChange={handleChange}
                  value={formData.mobile}
                  name="mobile"
                  className="form-control"
                  placeholder="Mobile No"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  onChange={handleChange}
                  value={formData.password}
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  onChange={handleChange}
                  value={formData.repeatPassword}
                  name="repeatPassword"
                  className="form-control"
                  placeholder="Repeat Password"
                  required
                />
              </div>

              <button className="btn btn-primary mx-auto">Submit</button>
            </form>
          </div>
          <div className="col-md-6">
            <div className="text-center mt-4">
              <img
                src="/img/registration.jpg"
                className="img-fluid"
                style={{ maxHeight: "400px" }}
                alt=""
              />
              <h5 className=" pt-2">Registration is fast secure and free.</h5>
              <p className="text-muted small">
                Join our food family and enjoy delicious food delivered to your
                door!
              </p>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </PublicLayout>
  );
};

export default Register;
