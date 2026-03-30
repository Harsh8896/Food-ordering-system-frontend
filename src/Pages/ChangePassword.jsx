import React, { useState, useEffect } from 'react';
import PublicLayout from '../components/PublicLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const ChangePassword = () => {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!userId) { navigate('/login'); }
    }, [userId, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend validation: match check
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/change_password/${userId}/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    current_password: formData.currentPassword,
                    new_password: formData.newPassword
                })
            });
            const result = await response.json();
            if (response.status === 200) {
                toast.success(result.message);
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <PublicLayout>
            <ToastContainer position="top-center" autoClose={2000} />
            <div className="container py-5">
                <h3 className="text-center text-primary mb-4">
                    <i className="fas fa-key me-1"></i> Change Password
                </h3>
                <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0 mx-auto" style={{maxWidth: '500px'}}>
                    <div className="mb-3">
                        <label>Current Password</label>
                        <input type="password" name="currentPassword" value={formData.currentPassword} className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>New Password</label>
                        <input type="password" name="newPassword" value={formData.newPassword} className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label>Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} className="form-control" onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        <i className="fas fa-check-circle me-2"></i> Update Password
                    </button>
                </form>
            </div>
        </PublicLayout>
    );
};

export default ChangePassword;