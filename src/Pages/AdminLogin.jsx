import React, { useState } from 'react'
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from '../components/PublicLayout';

const AdminLogin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/api/admin-login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.status === 200) {
                toast.success(data.message);

                // Sab fields save karo
                localStorage.setItem("adminUser", data.username);
                localStorage.setItem("restaurantId", data.restaurant_id);
                localStorage.setItem("restaurantName", data.restaurant_name);
                localStorage.setItem("ownerEmail", data.username);

                setTimeout(() => {
                    navigate("/admin-dashboard");
                }, 1500);
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
            <div className='d-flex justify-content-center align-items-center vh-100'>
                <div className='card p-4 shadow-lg' style={{ width: "100%", maxWidth: "400px" }}>
                    <h4 className='text-center mb-4'>
                        <FaUser className='me-2' /> Restaurant Login
                    </h4>

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">
                                <FaUser className='me-2' /> Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='form-control'
                                placeholder='Enter username (email)'
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                <FaLock className='me-2' /> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='form-control'
                                placeholder='Enter password'
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className='btn btn-primary w-100 mt-3'
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Logging in...
                                </>
                            ) : (
                                <><FaSignInAlt className='me-1' /> Login</>
                            )}
                        </button>
                    </form>
                </div>
                <ToastContainer position='top-center' autoClose={2000} />
            </div>
        </PublicLayout>
    )
}

export default AdminLogin;