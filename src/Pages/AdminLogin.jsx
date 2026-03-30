import React, { useState } from 'react'
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from '../components/PublicLayout';


const AdminLogin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPass, setShowPass] = useState(false)
    const [focused, setFocused] = useState("")
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin-login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (response.status === 200) {
                toast.success(data.message);
                localStorage.setItem("adminUser", data.username);
                localStorage.setItem("restaurantId", data.restaurant_id);
                localStorage.setItem("restaurantName", data.restaurant_name);
                localStorage.setItem("ownerEmail", data.username);
                setTimeout(() => navigate("/admin-dashboard"), 1500);
            } else {
                toast.error(data.message || "Login Failed");
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PublicLayout>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

                .al-root {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0f0e0c;
                    position: relative;
                    overflow: hidden;
                    font-family: 'DM Sans', sans-serif;
                }

                /* Warm ambient blobs */
                .al-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.18;
                    pointer-events: none;
                }
                .al-blob-1 {
                    width: 420px; height: 420px;
                    background: #f59e0b;
                    top: -80px; left: -100px;
                    animation: blobFloat 8s ease-in-out infinite;
                }
                .al-blob-2 {
                    width: 300px; height: 300px;
                    background: #ef4444;
                    bottom: -60px; right: -60px;
                    animation: blobFloat 10s ease-in-out infinite reverse;
                }
                .al-blob-3 {
                    width: 200px; height: 200px;
                    background: #f97316;
                    top: 50%; right: 20%;
                    animation: blobFloat 12s ease-in-out infinite 2s;
                }
                @keyframes blobFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(20px, -20px) scale(1.05); }
                    66% { transform: translate(-15px, 15px) scale(0.97); }
                }

                /* Grid overlay */
                .al-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                }

                .al-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 420px;
                    margin: 20px;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 24px;
                    padding: 48px 44px;
                    backdrop-filter: blur(20px);
                    box-shadow:
                        0 0 0 1px rgba(245,158,11,0.1),
                        0 40px 80px rgba(0,0,0,0.6),
                        inset 0 1px 0 rgba(255,255,255,0.06);
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
                }
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(30px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Top accent line */
                .al-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 24px; right: 24px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #f59e0b, #ef4444, transparent);
                    border-radius: 0 0 2px 2px;
                }

                .al-icon-wrap {
                    width: 56px; height: 56px;
                    background: linear-gradient(135deg, #f59e0b22, #ef444422);
                    border: 1px solid rgba(245,158,11,0.3);
                    border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 24px;
                    font-size: 22px;
                    color: #f59e0b;
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;
                }

                .al-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    font-weight: 900;
                    color: #fff;
                    letter-spacing: -0.5px;
                    margin-bottom: 4px;
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both;
                }

                .al-sub {
                    font-size: 13px;
                    color: rgba(255,255,255,0.35);
                    margin-bottom: 36px;
                    font-weight: 300;
                    letter-spacing: 0.3px;
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both;
                }

                .al-field {
                    margin-bottom: 20px;
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both;
                }
                .al-field:last-of-type {
                    animation-delay: 0.3s;
                }

                .al-label {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 1.2px;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 8px;
                    display: block;
                }

                .al-input-wrap {
                    position: relative;
                }

                .al-input-icon {
                    position: absolute;
                    left: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.2);
                    font-size: 13px;
                    transition: color 0.2s;
                    pointer-events: none;
                }
                .al-input-wrap.focused .al-input-icon {
                    color: #f59e0b;
                }

                .al-input {
                    width: 100%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    padding: 14px 16px 14px 42px;
                    outline: none;
                    transition: all 0.25s;
                    box-sizing: border-box;
                }
                .al-input::placeholder { color: rgba(255,255,255,0.2); }
                .al-input:focus {
                    background: rgba(245,158,11,0.06);
                    border-color: rgba(245,158,11,0.4);
                    box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
                }

                .al-eye {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.25);
                    cursor: pointer;
                    padding: 4px;
                    font-size: 13px;
                    transition: color 0.2s;
                }
                .al-eye:hover { color: #f59e0b; }

                .al-btn {
                    width: 100%;
                    padding: 15px;
                    border: none;
                    border-radius: 12px;
                    background: linear-gradient(135deg, #f59e0b, #ef4444);
                    color: #fff;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    margin-top: 8px;
                    position: relative;
                    overflow: hidden;
                    transition: opacity 0.2s, transform 0.15s;
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both;
                }
                .al-btn:hover:not(:disabled) {
                    opacity: 0.92;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(245,158,11,0.3);
                }
                .al-btn:active:not(:disabled) { transform: translateY(0); }
                .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .al-btn-shine {
                    position: absolute;
                    top: 0; left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
                    animation: shine 2.5s infinite;
                }
                @keyframes shine {
                    0% { left: -100%; }
                    50%, 100% { left: 150%; }
                }

                .al-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    display: inline-block;
                    animation: spin 0.7s linear infinite;
                    margin-right: 8px;
                    vertical-align: middle;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                .al-footer {
                    margin-top: 28px;
                    text-align: center;
                    font-size: 12px;
                    color: rgba(255,255,255,0.2);
                    animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both;
                }
                .al-footer span {
                    color: rgba(245,158,11,0.6);
                }
            `}</style>

            <div className="al-root">
                <div className="al-blob al-blob-1" />
                <div className="al-blob al-blob-2" />
                <div className="al-blob al-blob-3" />
                <div className="al-grid" />

                <div className="al-card">
                    <div className="al-icon-wrap">🍽️</div>
                    <div className="al-title">Welcome back</div>
                    <div className="al-sub">Sign in to your restaurant dashboard</div>

                    <form onSubmit={handleLogin}>
                        <div className="al-field">
                            <label className="al-label">Username / Email</label>
                            <div className={`al-input-wrap ${focused === 'user' ? 'focused' : ''}`}>
                                <FaUser className="al-input-icon" />
                                <input
                                    className="al-input"
                                    type="text"
                                    placeholder="Enter your email"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    onFocus={() => setFocused('user')}
                                    onBlur={() => setFocused('')}
                                    required
                                />
                            </div>
                        </div>

                        <div className="al-field">
                            <label className="al-label">Password</label>
                            <div className={`al-input-wrap ${focused === 'pass' ? 'focused' : ''}`}>
                                <FaLock className="al-input-icon" />
                                <input
                                    className="al-input"
                                    type={showPass ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocused('pass')}
                                    onBlur={() => setFocused('')}
                                    required
                                />
                                <button
                                    type="button"
                                    className="al-eye"
                                    onClick={() => setShowPass(p => !p)}
                                >
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button className="al-btn" type="submit" disabled={loading}>
                            <div className="al-btn-shine" />
                            {loading ? (
                                <><span className="al-spinner" />Signing in...</>
                            ) : (
                                <><FaSignInAlt style={{ marginRight: 8 }} />Sign In</>
                            )}
                        </button>
                    </form>

                    <div className="al-footer">
                        Powered by <span>FoodSys Platform</span>
                    </div>
                </div>
            </div>

            <ToastContainer position="top-center" autoClose={2000} theme="dark" />
        </PublicLayout>
    )
}

export default AdminLogin;