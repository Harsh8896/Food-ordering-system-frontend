import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUtensils } from "react-icons/fa";

// ── JWT helpers ──────────────────────────────────────────
export const saveAuthTokens = (access, refresh) => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
};
export const getAccessToken  = () => localStorage.getItem('accessToken');
export const clearAuthTokens = () => {
  ['accessToken','refreshToken','userId','userName'].forEach(k => localStorage.removeItem(k));
};
export const authFetch = async (url, options = {}) => {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  let res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    const refresh = localStorage.getItem('refreshToken');
    if (refresh) {
      try {
        const rr = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/token/refresh/`,
          { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ refresh }) }
        );
        if (rr.ok) {
          const d = await rr.json();
          localStorage.setItem('accessToken', d.access);
          res = await fetch(url, { ...options, headers: { ...headers, Authorization: `Bearer ${d.access}` } });
        } else {
          clearAuthTokens();
          window.location.href = '/login';
        }
      } catch {
        clearAuthTokens();
        window.location.href = '/login';
      }
    }
  }
  return res;
};

// ── Validation ───────────────────────────────────────────
const validateLoginForm = ({ email, password }) => {
  const errors = {};
  if (!email.trim())         errors.email    = 'Email or mobile number is required';
  if (!password)             errors.password = 'Password is required';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
  return errors;
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors,   setErrors]   = useState({});
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const frontendErrors = validateLoginForm(formData);
    if (Object.keys(frontendErrors).length > 0) { setErrors(frontendErrors); return; }
    setLoading(true);
    try {
      const res    = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email.trim(), password: formData.password }),
      });
      const result = await res.json();
      if (res.ok) {
        saveAuthTokens(result.access, result.refresh);
        localStorage.setItem('userId',   result.userId);
        localStorage.setItem('userName', result.userName);
        toast.success('Welcome back! 🎉');
        setFormData({ email: '', password: '' });
        setTimeout(() => navigate('/'), 1800);
      } else {
        if (result.errors) setErrors(result.errors);
        else toast.error(result.message || 'Login failed');
      }
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: '100%',
    padding: '12px 12px 12px 44px',
    border: `1.5px solid ${errors[name] ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: '#f8fafc',
    color: '#1e293b',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  });

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2200} />

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff 100%);
          display: flex;
          align-items: center;
          padding: 40px 16px;
          box-sizing: border-box;
        }
        .login-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          overflow: hidden;
          display: flex;
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          min-height: 520px;
        }
        .login-left {
          flex: 0 0 42%;
          background: linear-gradient(145deg, #1e293b, #0f172a);
          padding: 50px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .login-right {
          flex: 1;
          padding: 50px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .login-input-wrap {
          position: relative;
          margin-bottom: 4px;
        }
        .login-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 1;
        }
        .login-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
        }
        .login-error {
          color: #ef4444;
          font-size: 12px;
          margin: 3px 0 8px;
        }
        .login-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 24px;
          transition: opacity 0.2s;
        }
        .login-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-feature-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          width: 100%;
        }
        .login-feature-dot {
          width: 22px; height: 22px;
          border-radius: 50%;
          background: rgba(245,158,11,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .login-card {
            flex-direction: column;
            min-height: unset;
            border-radius: 20px;
          }
          .login-left {
            flex: unset;
            width: 100%;
            padding: 36px 24px 30px;
            border-radius: 0;
          }
          .login-left h2  { font-size: 20px !important; }
          .login-left p   { font-size: 13px !important; margin-bottom: 20px !important; }
          .login-features { display: none; }
          .login-right {
            padding: 32px 24px 36px;
          }
        }
        @media (max-width: 400px) {
          .login-wrapper { padding: 20px 10px; }
          .login-right   { padding: 24px 16px 28px; }
        }
      `}</style>

      <div className="login-wrapper">
        <div style={{ width: '100%' }}>
          <div className="login-card">

            {/* ── LEFT ── */}
            <div className="login-left">
              <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(245,158,11,0.08)' }}/>
              <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(245,158,11,0.05)' }}/>

              <div style={{ width:'64px', height:'64px', background:'rgba(245,158,11,0.15)', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'20px', position:'relative', zIndex:1 }}>
                <FaUtensils size={28} color="#f59e0b"/>
              </div>

              <h2 style={{ color:'#fff', fontWeight:'800', fontSize:'24px', marginBottom:'10px', lineHeight:'1.3', position:'relative', zIndex:1 }}>
                Welcome Back!
              </h2>
              <p style={{ color:'#94a3b8', fontSize:'14px', lineHeight:'1.7', marginBottom:'32px', position:'relative', zIndex:1 }}>
                Login to enjoy delicious meals delivered fresh to your doorstep.
              </p>

              <div className="login-features" style={{ width:'100%', position:'relative', zIndex:1 }}>
                {['Fast & Secure Login','Track Your Orders','Exclusive Deals & Offers','Multiple Payment Options'].map((item,i) => (
                  <div key={i} className="login-feature-row">
                    <div className="login-feature-dot">
                      <span style={{ color:'#f59e0b', fontSize:'11px', fontWeight:'700' }}>✓</span>
                    </div>
                    <span style={{ color:'#cbd5e1', fontSize:'13px' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:'28px', color:'#64748b', fontSize:'13px', position:'relative', zIndex:1 }}>
                Don't have an account?{' '}
                <span onClick={() => navigate('/register')} style={{ color:'#f59e0b', fontWeight:'700', cursor:'pointer' }}>
                  Sign Up
                </span>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="login-right">
              <div style={{ marginBottom:'32px' }}>
                <h3 style={{ fontWeight:'800', fontSize:'22px', color:'#1e293b', marginBottom:'6px' }}>Sign In</h3>
                <p style={{ color:'#94a3b8', fontSize:'14px', margin:0 }}>Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Email */}
                <div className="login-input-wrap">
                  <div className="login-icon" style={{ color: errors.email ? '#ef4444' : '#94a3b8' }}>
                    <FaEnvelope size={15}/>
                  </div>
                  <input
                    type="text" name="email"
                    value={formData.email} onChange={handleChange}
                    placeholder="Email or Mobile Number"
                    style={inputStyle('email')}
                    onFocus={e => { if (!errors.email) e.target.style.borderColor='#f59e0b'; }}
                    onBlur={e  => { if (!errors.email) e.target.style.borderColor='#e2e8f0'; }}
                  />
                </div>
                {errors.email && <p className="login-error">⚠ {errors.email}</p>}

                {/* Password */}
                <div className="login-input-wrap" style={{ marginTop:'12px' }}>
                  <div className="login-icon" style={{ color: errors.password ? '#ef4444' : '#94a3b8' }}>
                    <FaLock size={15}/>
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'} name="password"
                    value={formData.password} onChange={handleChange}
                    placeholder="Password"
                    style={inputStyle('password')}
                    onFocus={e => { if (!errors.password) e.target.style.borderColor='#f59e0b'; }}
                    onBlur={e  => { if (!errors.password) e.target.style.borderColor='#e2e8f0'; }}
                  />
                  <button type="button" className="login-toggle" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <FaEyeSlash size={15}/> : <FaEye size={15}/>}
                  </button>
                </div>
                {errors.password && <p className="login-error">⚠ {errors.password}</p>}

                <button type="submit" className="login-submit" disabled={loading}
                  style={{ background: loading ? '#fcd34d' : 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                  {loading
                    ? <><span className="spinner-border spinner-border-sm"/> Signing In...</>
                    : 'Sign In →'}
                </button>

                <p style={{ textAlign:'center', marginTop:'20px', fontSize:'14px', color:'#94a3b8' }}>
                  New here?{' '}
                  <span onClick={() => navigate('/register')} style={{ color:'#f59e0b', fontWeight:'700', cursor:'pointer' }}>
                    Create an account
                  </span>
                </p>
              </form>
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;