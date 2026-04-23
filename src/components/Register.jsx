import React, { useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FaUser, FaEnvelope, FaMobileAlt,
  FaLock, FaEye, FaEyeSlash, FaUtensils,
} from "react-icons/fa";
import { saveAuthTokens } from "./Login";

// ── Validation ───────────────────────────────────────────
const validateRegisterForm = ({ firstname, lastname, email, mobile, password, repeatPassword }) => {
  const errors = {};
  if (!firstname.trim())                              errors.firstname = 'First name is required';
  else if (firstname.trim().length < 2)               errors.firstname = 'Min 2 characters required';
  else if (!/^[A-Za-z\s]+$/.test(firstname.trim()))   errors.firstname = 'Only letters allowed';

  if (!lastname.trim())                               errors.lastname = 'Last name is required';
  else if (lastname.trim().length < 2)                errors.lastname = 'Min 2 characters required';
  else if (!/^[A-Za-z\s]+$/.test(lastname.trim()))    errors.lastname = 'Only letters allowed';

  if (!email.trim())                                  errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';

  if (!mobile.trim())                                 errors.mobile = 'Mobile number is required';
  else if (!/^[6-9]\d{9}$/.test(mobile.trim()))       errors.mobile = 'Enter valid 10-digit mobile';

  if (!password)                                      errors.password = 'Password is required';
  else if (password.length < 8)                       errors.password = 'Min 8 characters required';
  else if (!/[A-Z]/.test(password))                   errors.password = 'Add at least one uppercase letter';
  else if (!/[a-z]/.test(password))                   errors.password = 'Add at least one lowercase letter';
  else if (!/\d/.test(password))                      errors.password = 'Add at least one number';
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.password = 'Add at least one special character';

  if (!repeatPassword)                                errors.repeatPassword = 'Please confirm your password';
  else if (password !== repeatPassword)               errors.repeatPassword = 'Passwords do not match';

  return errors;
};

// ── Password strength ────────────────────────────────────
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '#e2e8f0' };
  let score = 0;
  if (pw.length >= 8)                          score++;
  if (/[A-Z]/.test(pw))                        score++;
  if (/[a-z]/.test(pw))                        score++;
  if (/\d/.test(pw))                           score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pw))      score++;
  const map = [
    { label:'',           color:'#e2e8f0' },
    { label:'Weak',       color:'#ef4444' },
    { label:'Fair',       color:'#f97316' },
    { label:'Good',       color:'#eab308' },
    { label:'Strong',     color:'#22c55e' },
    { label:'Very Strong',color:'#10b981' },
  ];
  return { score, ...map[score] };
};

// ── InputField component ─────────────────────────────────
const InputField = ({ icon: Icon, name, type, placeholder, value, onChange, error, showToggle, onToggle, show }) => (
  <div style={{ marginBottom: '4px' }}>
    <div style={{ position: 'relative' }}>
      <div style={{
        position:'absolute', left:'14px', top:'50%',
        transform:'translateY(-50%)',
        color: error ? '#ef4444' : '#94a3b8', zIndex: 1,
      }}>
        <Icon size={15}/>
      </div>
      <input
        type={showToggle ? (show ? 'text' : 'password') : type}
        name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        style={{
          width:'100%',
          padding:'12px 12px 12px 44px',
          border:`1.5px solid ${error ? '#ef4444' : '#e2e8f0'}`,
          borderRadius:'12px',
          fontSize:'14px',
          outline:'none',
          background:'#f8fafc',
          color:'#1e293b',
          transition:'border-color 0.2s',
          boxSizing:'border-box',
        }}
        onFocus={e => { if (!error) e.target.style.borderColor = '#f59e0b'; }}
        onBlur={e  => { if (!error) e.target.style.borderColor = error ? '#ef4444' : '#e2e8f0'; }}
      />
      {showToggle && (
        <button type="button" onClick={onToggle} style={{
          position:'absolute', right:'14px', top:'50%',
          transform:'translateY(-50%)',
          background:'none', border:'none', cursor:'pointer', color:'#94a3b8',
        }}>
          {show ? <FaEyeSlash size={15}/> : <FaEye size={15}/>}
        </button>
      )}
    </div>
    {error && <p style={{ color:'#ef4444', fontSize:'12px', margin:'3px 0 0' }}>⚠ {error}</p>}
  </div>
);

const Register = () => {
  const [formData, setFormData]     = useState({
    firstname:'', lastname:'', email:'', mobile:'', password:'', repeatPassword:'',
  });
  const [errors,     setErrors]     = useState({});
  const [showPass,   setShowPass]   = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading,    setLoading]    = useState(false);
  const navigate = useNavigate();

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const frontendErrors = validateRegisterForm(formData);
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      toast.error('Please fix the errors below');
      return;
    }
    setLoading(true);
    try {
      const { firstname, lastname, email, mobile, password } = formData;
      const res    = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, email: email.trim().toLowerCase(), mobile, password }),
      });
      const result = await res.json();
      if (res.ok) {
        if (result.access && result.refresh) {
          saveAuthTokens(result.access, result.refresh);
          localStorage.setItem('userId',   result.userId);
          localStorage.setItem('userName', result.userName);
        }
        toast.success('Account created successfully! 🎉');
        setFormData({ firstname:'', lastname:'', email:'', mobile:'', password:'', repeatPassword:'' });
        setTimeout(() => navigate('/'), 1800);
      } else {
        if (result.errors) { setErrors(result.errors); toast.error('Please fix the errors below'); }
        else toast.error(result.message || 'Something went wrong');
      }
    } catch {
      toast.error('Network error — please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2200}/>

      <style>{`
        .reg-wrapper {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff 100%);
          display: flex;
          align-items: center;
          padding: 40px 16px;
          box-sizing: border-box;
        }
        .reg-card {
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          overflow: hidden;
          display: flex;
          width: 100%;
          max-width: 920px;
          margin: 0 auto;
        }
        .reg-left {
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
        .reg-right {
          flex: 1;
          padding: 40px 48px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .reg-name-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 4px;
        }
        .reg-feature-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          width: 100%;
        }
        .reg-submit {
          width: 100%;
          padding: 14px;
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
          margin-top: 12px;
          transition: opacity 0.2s;
        }
        .reg-submit:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── Responsive ── */
        @media (max-width: 767px) {
          .reg-card {
            flex-direction: column;
            border-radius: 20px;
          }
          .reg-left {
            flex: unset;
            width: 100%;
            padding: 32px 20px 26px;
          }
          .reg-left h2   { font-size: 20px !important; }
          .reg-left p    { font-size: 13px !important; margin-bottom: 16px !important; }
          .reg-features  { display: none; }
          .reg-right     { padding: 28px 20px 36px; }
          .reg-name-grid { grid-template-columns: 1fr 1fr; gap: 8px; }
        }
        @media (max-width: 480px) {
          .reg-wrapper   { padding: 20px 10px; }
          .reg-name-grid { grid-template-columns: 1fr; }
          .reg-right     { padding: 24px 16px 28px; }
        }
      `}</style>

      <div className="reg-wrapper">
        <div style={{ width:'100%' }}>
          <div className="reg-card">

            {/* ── LEFT ── */}
            <div className="reg-left">
              <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(245,158,11,0.08)' }}/>
              <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(245,158,11,0.05)' }}/>

              <div style={{ width:'64px', height:'64px', background:'rgba(245,158,11,0.15)', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'18px', position:'relative', zIndex:1 }}>
                <FaUtensils size={28} color="#f59e0b"/>
              </div>
              <h2 style={{ color:'#fff', fontWeight:'800', fontSize:'24px', marginBottom:'10px', lineHeight:'1.3', position:'relative', zIndex:1 }}>
                Join Our Food Family
              </h2>
              <p style={{ color:'#94a3b8', fontSize:'14px', lineHeight:'1.7', marginBottom:'28px', position:'relative', zIndex:1 }}>
                Register today and enjoy delicious meals delivered fresh to your doorstep.
              </p>

              <div className="reg-features" style={{ width:'100%', position:'relative', zIndex:1 }}>
                {['Fast & Free Registration','Secure & Private','Track Orders in Real Time','Exclusive Deals & Offers'].map((item,i) => (
                  <div key={i} className="reg-feature-row">
                    <div style={{ width:'22px', height:'22px', borderRadius:'50%', background:'rgba(245,158,11,0.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ color:'#f59e0b', fontSize:'11px', fontWeight:'700' }}>✓</span>
                    </div>
                    <span style={{ color:'#cbd5e1', fontSize:'13px' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop:'28px', color:'#64748b', fontSize:'13px', position:'relative', zIndex:1 }}>
                Already have an account?{' '}
                <span onClick={() => navigate('/login')} style={{ color:'#f59e0b', fontWeight:'700', cursor:'pointer' }}>
                  Sign In
                </span>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="reg-right">
              <div style={{ marginBottom:'24px' }}>
                <h3 style={{ fontWeight:'800', fontSize:'22px', color:'#1e293b', marginBottom:'6px' }}>Create Account</h3>
                <p style={{ color:'#94a3b8', fontSize:'14px', margin:0 }}>Fill in the details below to get started</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>

                {/* Name row */}
                <div className="reg-name-grid">
                  <InputField icon={FaUser} name="firstname" type="text" placeholder="First Name" value={formData.firstname} onChange={handleChange} error={errors.firstname}/>
                  <InputField icon={FaUser} name="lastname"  type="text" placeholder="Last Name"  value={formData.lastname}  onChange={handleChange} error={errors.lastname}/>
                </div>

                <div style={{ marginBottom:'4px' }}>
                  <InputField icon={FaEnvelope}  name="email"  type="email" placeholder="Email Address"  value={formData.email}  onChange={handleChange} error={errors.email}/>
                </div>
                <div style={{ marginBottom:'4px' }}>
                  <InputField icon={FaMobileAlt} name="mobile" type="tel"   placeholder="Mobile Number"  value={formData.mobile} onChange={handleChange} error={errors.mobile}/>
                </div>

                {/* Password + strength */}
                <div style={{ marginBottom:'4px' }}>
                  <InputField
                    icon={FaLock} name="password" type="password"
                    placeholder="Password (min 8 chars)"
                    value={formData.password} onChange={handleChange} error={errors.password}
                    showToggle onToggle={() => setShowPass(!showPass)} show={showPass}
                  />
                  {formData.password && (
                    <div style={{ marginTop:'6px', marginBottom:'4px' }}>
                      <div style={{ display:'flex', gap:'4px', marginBottom:'3px' }}>
                        {[1,2,3,4,5].map(i => (
                          <div key={i} style={{
                            flex:1, height:'3px', borderRadius:'2px',
                            background: i <= strength.score ? strength.color : '#e2e8f0',
                            transition:'background 0.3s',
                          }}/>
                        ))}
                      </div>
                      <span style={{ fontSize:'11px', color: strength.color, fontWeight:'600' }}>
                        {strength.label}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div style={{ marginBottom:'4px' }}>
                  <InputField
                    icon={FaLock} name="repeatPassword" type="password"
                    placeholder="Confirm Password"
                    value={formData.repeatPassword} onChange={handleChange} error={errors.repeatPassword}
                    showToggle onToggle={() => setShowRepeat(!showRepeat)} show={showRepeat}
                  />
                  {formData.repeatPassword && !errors.repeatPassword && (
                    <p style={{ fontSize:'12px', marginTop:'3px', color: formData.password === formData.repeatPassword ? '#10b981' : '#ef4444' }}>
                      {formData.password === formData.repeatPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="reg-submit"
                  disabled={loading}
                  style={{ background: loading ? '#fcd34d' : 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                >
                  {loading
                    ? <><span className="spinner-border spinner-border-sm"/> Creating Account...</>
                    : 'Create Account →'}
                </button>

              </form>
            </div>

          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;