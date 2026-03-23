import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUtensils } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.status === 200) {
        toast.success("Welcome back! 🎉");
        localStorage.setItem("userId", result.userId);
        localStorage.setItem("userName", result.userName);
        setFormData({ email: "", password: "" });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(result.message || "Invalid Credentials");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: '1.5px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: '#f8fafc',
    color: '#1e293b',
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff 100%)',
        display: 'flex', alignItems: 'center', padding: '40px 0'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div style={{
                background: '#fff', borderRadius: '24px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                overflow: 'hidden', display: 'flex', minHeight: '520px'
              }}>

                {/* LEFT — Decorative Panel */}
                <div style={{
                  flex: '0 0 42%',
                  background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
                  padding: '50px 40px',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'center', alignItems: 'center',
                  textAlign: 'center', position: 'relative', overflow: 'hidden',
                }}>
                  {/* Decorative circles */}
                  <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(245,158,11,0.08)' }} />
                  <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(245,158,11,0.05)' }} />

                  <div style={{
                    width: '70px', height: '70px',
                    background: 'rgba(245,158,11,0.15)',
                    borderRadius: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '24px'
                  }}>
                    <FaUtensils size={30} color="#f59e0b" />
                  </div>

                  <h2 style={{ color: '#fff', fontWeight: '800', fontSize: '26px', marginBottom: '12px', lineHeight: '1.3' }}>
                    Welcome Back!
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.7', marginBottom: '36px' }}>
                    Login to your account and enjoy delicious meals delivered fresh to your doorstep.
                  </p>

                  {['Fast & Secure Login', 'Track Your Orders', 'Exclusive Deals & Offers', 'Multiple Payment Options'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', width: '100%' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'rgba(245,158,11,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: '700' }}>✓</span>
                      </div>
                      <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{item}</span>
                    </div>
                  ))}

                  <div style={{ marginTop: '36px', color: '#64748b', fontSize: '13px' }}>
                    Don't have an account?{' '}
                    <span
                      onClick={() => navigate('/register')}
                      style={{ color: '#f59e0b', fontWeight: '700', cursor: 'pointer' }}
                    >
                      Sign Up
                    </span>
                  </div>
                </div>

                {/* RIGHT — Form */}
                <div style={{
                  flex: 1, padding: '50px 48px',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center'
                }}>
                  <div style={{ marginBottom: '36px' }}>
                    <h3 style={{ fontWeight: '800', fontSize: '24px', color: '#1e293b', marginBottom: '6px' }}>
                      Sign In
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                      Enter your credentials to continue
                    </p>
                  </div>

                  <form onSubmit={handleSubmit}>

                    {/* Email field */}
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                      <div style={{
                        position: 'absolute', left: '14px', top: '50%',
                        transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1
                      }}>
                        <FaEnvelope size={16} />
                      </div>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email or Mobile Number"
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#f59e0b'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>

                    {/* Password field */}
                    <div style={{ position: 'relative', marginBottom: '24px' }}>
                      <div style={{
                        position: 'absolute', left: '14px', top: '50%',
                        transform: 'translateY(-50%)', color: '#94a3b8', zIndex: 1
                      }}>
                        <FaLock size={16} />
                      </div>
                      <input
                        type={showPass ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#f59e0b'}
                        onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        style={{
                          position: 'absolute', right: '14px', top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8',
                        }}
                      >
                        {showPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                      </button>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%', padding: '14px',
                        background: loading ? '#fcd34d' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        border: 'none', borderRadius: '12px',
                        color: '#fff', fontSize: '15px', fontWeight: '700',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', gap: '8px',
                      }}
                    >
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm" /> Signing In...</>
                      ) : (
                        'Sign In →'
                      )}
                    </button>

                    {/* Register link */}
                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
                      New here?{' '}
                      <span
                        onClick={() => navigate('/register')}
                        style={{ color: '#f59e0b', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Create an account
                      </span>
                    </p>

                  </form>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;