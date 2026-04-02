import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { FaSignInAlt, FaUser } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddFood = () => {
  const restaurantId = localStorage.getItem('restaurantId');

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    item_price: "",
    item_description: "",
    item_quantity: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("restaurant", restaurantId);
    data.append("category", formData.category);
    data.append("item_name", formData.item_name);
    data.append("item_price", formData.item_price);
    data.append("item_description", formData.item_description);
    data.append("item_quantity", formData.item_quantity);
    data.append("image", formData.image);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/add-food-item/`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.message);
        setFormData({
          category: "",
          item_name: "",
          item_price: "",
          item_description: "",
          item_quantity: "",
          image: null,
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Server error: " + error.message);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories/?restaurant_id=${restaurantId}`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ File size check
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image 5MB se badi nahi honi chahiye!");
      e.target.value = "";
      return;
    }
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-8">
          <div className="p-4 shadow-sm rounded">
            <h4 className="mb-4">
              <i className="fas fa-plus-circle text-primary me-2"></i> Add Food Item
            </h4>
            <form onSubmit={handleSubmit} encType="multipart/form-data">

              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Food Category
                </label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((item, index) => (
                    <option value={item.id} key={index}>
                      {item.category_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Food Item Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Food Item Name"
                  required
                  name="item_name"
                  onChange={handleChange}
                  value={formData.item_name}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Description
                </label>
                <textarea
                  className="form-control"
                  placeholder="Enter description"
                  required
                  name="item_description"
                  onChange={handleChange}
                  value={formData.item_description}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Quantity
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2 pcs / Large"
                  required
                  name="item_quantity"
                  onChange={handleChange}
                  value={formData.item_quantity}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Price ₹
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Food Price"
                  required
                  name="item_price"
                  onChange={handleChange}
                  step=".01"
                  value={formData.item_price}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  <FaUser className="me-2 icon-fix" /> Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  required
                  name="image"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <small className="text-muted">Max size: 5MB</small>
              </div>

              <button type="submit" className="btn btn-primary w-100 mt-3">
                <FaSignInAlt className="me-1 icon-fix" /> Add Food Item
              </button>
            </form>
          </div>
        </div>
        <div className="col-md-4">
          <i className="fas fa-pizza-slice" style={{ fontSize: "200px" }}></i>
        </div>
        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </AdminLayout>
  );
};

export default AddFood;