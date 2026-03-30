import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const { id } = useParams(); // URL se ID lene ke liye
    const navigate = useNavigate();

    // Page load hone par existing category data fetch karna
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category/${id}/`)
            .then(res => res.json())
            .then(data => {
                setCategoryName(data.category_name);
            })
            .catch(err => console.error(err));
    }, [id]);

    // Update process handle karne ke liye function
    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category_name: categoryName }),
        })
        .then(res => res.json())
        .then(data => {
            toast.success(data.message);
            // 2 second baad wapas Manage Category page par bhejna
            setTimeout(() => {
                navigate('/manage-category');
            }, 2000);
        })
        .catch(err => console.error(err));
    };

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={2000} />
            <div className="container mt-4">
                <div className="row justify-content-center">
                    <div className="col-md-8 card p-4 shadow-sm rounded">
                        <h4><i className="fas fa-pen-square text-primary me-2"></i> Edit Food Category</h4>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Category Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={categoryName} 
                                    onChange={(e) => setCategoryName(e.target.value)} 
                                    required 
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">
                                <i className="fas fa-save me-2"></i> Update Category
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EditCategory;