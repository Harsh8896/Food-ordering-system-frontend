import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";

const EditFood = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    category: "",
    item_name: "",
    item_price: "",
    item_description: "",
    item_quantity: "",
    is_available: true,
    image: null,
  });

  const [preview, setPreview] = useState("");



  useEffect(() => {

    // categories load
    fetch("http://127.0.0.1:8000/api/categories/")
      .then(res => res.json())
      .then(data => setCategories(data));


    // food detail load
    fetch(`http://127.0.0.1:8000/api/edit-food/${id}/`)
      .then(res => res.json())
      .then(data => {

        setFormData({
          category: data.category,
          item_name: data.item_name,
          item_price: data.item_price,
          item_description: data.item_description,
          item_quantity: data.item_quantity,
          is_available: data.is_available,
          image: null,
        });

        if (data.image) {
          setPreview(`http://127.0.0.1:8000${data.image}`);
        }

      });

  }, [id]);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };



  const handleFileChange = (e) => {

    const file = e.target.files[0];

    setFormData({
      ...formData,
      image: file,
    });

    if (file) {
      setPreview(URL.createObjectURL(file));
    }

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    const data = new FormData();

    data.append("category", formData.category);
    data.append("item_name", formData.item_name);
    data.append("item_price", formData.item_price);
    data.append("item_description", formData.item_description);
    data.append("item_quantity", formData.item_quantity);
    data.append("is_available", formData.is_available);

    if (formData.image) {
      data.append("image", formData.image);
    }

    try {

      const response = await fetch(`http://127.0.0.1:8000/api/edit-food/${id}/`, {
        method: "PUT",
        body: data,
      });

      const result = await response.json();

      if (response.status === 200) {

        toast.success(result.message);

        setTimeout(() => {
          navigate("/manage-food");
        }, 1200);

      } else {
        toast.error("Update failed");
      }

    } catch (error) {
      toast.error("Server Error");
    }

  };



  return (

    <AdminLayout>

      <div className="row">

        <div className="col-md-8">

          <div className="p-4 shadow-sm rounded">

            <h4 className="mb-4 text-center">
              Edit Food Item
            </h4>

            <form onSubmit={handleSubmit}>

              {/* Category */}

              <div className="mb-3">

                <label className="form-label">
                  <FaUser className="me-2" />
                  Food Category
                </label>

                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >

                  <option value="">Select Category</option>

                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </option>
                  ))}

                </select>

              </div>



              {/* Food Name */}

              <div className="mb-3">

                <label className="form-label">
                  Food Name
                </label>

                <input
                  type="text"
                  name="item_name"
                  className="form-control"
                  value={formData.item_name}
                  onChange={handleChange}
                  required
                />

              </div>



              {/* Description */}

              <div className="mb-3">

                <label>Description</label>

                <textarea
                  className="form-control"
                  name="item_description"
                  value={formData.item_description}
                  onChange={handleChange}
                />

              </div>



              {/* Quantity */}

              <div className="mb-3">

                <label>Quantity</label>

                <input
                  type="text"
                  className="form-control"
                  name="item_quantity"
                  value={formData.item_quantity}
                  onChange={handleChange}
                />

              </div>



              {/* Price */}

              <div className="mb-3">

                <label>Price ₹</label>

                <input
                  type="number"
                  step=".01"
                  className="form-control"
                  name="item_price"
                  value={formData.item_price}
                  onChange={handleChange}
                />

              </div>



              {/* Availability */}

              <div className="mb-3 form-check">

                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={formData.is_available}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_available: e.target.checked,
                    })
                  }
                />

                <label className="form-check-label">
                  Food Available
                </label>

              </div>



              {/* Image */}

              <div className="mb-3">

                <label>Image</label>

                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  accept="image/*"
                />

                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    width="120"
                    className="mt-2"
                  />
                )}

              </div>



              <button className="btn btn-primary w-100">
                Update Food
              </button>

            </form>

          </div>

        </div>

      </div>

      <ToastContainer />

    </AdminLayout>

  );

};

export default EditFood;