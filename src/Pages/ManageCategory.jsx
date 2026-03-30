import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import "../styles/ManageCategory.css";

const ManageCategory = () => {
  const restaurantId = localStorage.getItem('restaurantId');

  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    // Sirf is restaurant ki categories fetch karo
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/?restaurant_id=${restaurantId}`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/category/${id}/`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          toast.success(data.message);
          setCategories(categories.filter(cat => cat.id !== id));
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="container-fluid mt-4">
        <h3 className="mb-4">Manage Categories</h3>

        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat, index) => (
              <tr key={cat.id}>
                <td>{indexOfFirstCategory + index + 1}</td>
                <td>{cat.category_name}</td>
                <td>{new Date(cat.creation_date).toLocaleString()}</td>
                <td>
                  <Link to={`/edit_category/${cat.id}`} className="btn btn-sm btn-primary me-2">
                    <i className="fas fa-edit me-1"></i> Edit
                  </Link>
                  <button onClick={() => handleDelete(cat.id)} className="btn btn-sm btn-danger">
                    <i className="fas fa-trash-alt me-1"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 d-flex justify-content-center">
          <nav>
            <ul className="custom-pagination">
              <li className={currentPage === 1 ? "disabled" : ""}>
                <button onClick={() => handlePageChange(currentPage - 1)}>←</button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <li key={page} className={page === currentPage ? "active" : ""}>
                  <button onClick={() => handlePageChange(page)}>{page}</button>
                </li>
              ))}
              <li className={currentPage === totalPages ? "disabled" : ""}>
                <button onClick={() => handlePageChange(currentPage + 1)}>→</button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageCategory;