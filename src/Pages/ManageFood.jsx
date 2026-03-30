import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { CSVLink } from "react-csv";
import { toast } from "react-toastify";

const ManageFood = () => {
  const restaurantId = localStorage.getItem('restaurantId');

  const [foods, setFoods] = useState([]);
  const [allFoods, setAllFoods] = useState([]);

  useEffect(() => {
    // Sirf is restaurant ke foods fetch karo
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/food/?restaurant_id=${restaurantId}`)
      .then(res => res.json())
      .then(data => {
        setFoods(data);
        setAllFoods(data);
      });
  }, []);

  const handleSearch = (value) => {
    const keyword = value.toLowerCase();
    if (!keyword) {
      setFoods(allFoods);
    } else {
      setFoods(allFoods.filter(item =>
        item.item_name.toLowerCase().includes(keyword)
      ));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delete-food/${id}/`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
          toast.success(data.message);
          setFoods(foods.filter(food => food.id !== id));
        })
        .catch(err => console.error(err));
    }
  };

  return (
    <AdminLayout>
      <div>
        <h3 className='text-center text-primary mb-4'>
          <i className='fas fa-list-alt me-2'></i>
          Manage Food Item
        </h3>

        <h5 className='text-end text-muted'>
          <i className='fas fa-database me-1'></i>
          Total Food Items
          <span className='ms-1 badge bg-success'>{foods.length}</span>
        </h5>

        <div className='mb-3 d-flex justify-content-between p-2'>
          <input
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            className='form-control w-50'
            placeholder='Search By Food Item Name ...'
          />
          <CSVLink data={foods} filename='food_list.csv' className='btn btn-success'>
            <i className='fas fa-file-csv me-1'></i>
            Export to CSV
          </CSVLink>
        </div>

        <table className='table table-bordered table-hover table-striped'>
          <thead className='table-dark'>
            <tr>
              <th>S.N</th>
              <th>Category Name</th>
              <th>Food Item Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.category_name}</td>
                <td>{item.item_name}</td>
                <td>
                  <Link to={`/edit_food/${item.id}`} className="btn btn-sm btn-primary me-2">
                    <i className="fas fa-edit me-1"></i> Edit
                  </Link>
                  <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-danger">
                    <i className="fas fa-trash-alt me-1"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageFood;