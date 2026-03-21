import React, { useState } from "react";
import {toast, ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "../components/AdminLayout";
import { FaSignInAlt, FaUser } from "react-icons/fa";

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async (e)=> {
          e.preventDefault();

          try{

          
  
         const response = await fetch("http://127.0.0.1:8000/api/add-category/", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  category_name : categoryName,
                  restaurant: localStorage.getItem('restaurantId')
              }),
  
          })
          const data = await response.json()
              if (response.status === 201) {
                  toast.success(data.message)
              }
              else{
                toast.error("Something went wrong")
              }
            }
            catch(error){
              console.error("error", error)
            }
      }

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4">
              <i className="fas fa-pluse-circle text-primary me-2"></i> Add
              Category
            </h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Category Name
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="form-control"
                  placeholder="Enter Category Name"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3">
                <FaSignInAlt className="me-1 icon-fix" /> Add Category
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <i className="fas fa-utensils" style={{fontSize: "200px"}}></i>
        </div>
        <ToastContainer position="top-right" autoClose={2000}/>
      </div>
    </AdminLayout>
  );
};

export default AddCategory;
