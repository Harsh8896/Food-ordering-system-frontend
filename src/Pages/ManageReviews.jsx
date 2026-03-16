import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) { navigate('/admin-login'); return; }
    fetch('http://127.0.0.1:8000/api/all-reviews/')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      fetch(`http://127.0.0.1:8000/api/delete_review/${id}/`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          toast.success(data.message || "Review deleted successfully");
          setReviews(reviews.filter(r => r.id !== id));
        });
    }
  };

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h3 className="text-center text-primary mb-4"><i className="fas fa-star me-1"></i> Manage Reviews</h3>
        <h5 className="text-end text-muted">Total <span className="badge bg-success">{reviews.length}</span></h5>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>S.No</th><th>Food Item</th><th>User</th><th>Rating</th><th>Comment</th><th>Date</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r, index) => (
              <tr key={r.id}>
                <td>{index + 1}</td>
                <td>{r.food_name}</td>
                <td>{r.user_name}</td>
                <td>
    {/* 5 stars ka array banakar loop chalana */}
    {[...Array(5)].map((_, i) => (
        <i 
            key={i} 
            className={`${i < r.rating ? 'fas' : 'far'} fa-star text-warning`}
        ></i>
    ))}
</td>
                <td>{r.comment}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td><button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-danger">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </AdminLayout>
  );
};

export default ManageReviews