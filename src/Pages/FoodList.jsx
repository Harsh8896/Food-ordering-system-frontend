import React, { useEffect, useState } from "react";
import PublicLayout from "../components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/home.css";

const FoodList = () => {

  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
const [minPrice, setMinPrice] = useState(0);
const [maxPrice, setMaxPrice] = useState(200);
const [sortBy, setSortBy] = useState("relevance");
const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {

    fetch("http://127.0.0.1:8000/api/foods/")
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredFoods(data);
      });

    fetch("http://127.0.0.1:8000/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data));

  }, []);

  const sortFoods = (list, sortValue) => {
    const sorted = [...list]; // Shallow copy to avoid mutation
    switch (sortValue) {
        case "priceLowHigh":
            sorted.sort((a, b) => a.item_price - b.item_price);
            break;
        case "priceHighLow":
            sorted.sort((a, b) => b.item_price - a.item_price);
            break;
        case "nameAZ":
            sorted.sort((a, b) => a.item_name.localeCompare(b.item_name));
            break;
        case "nameZA":
            sorted.sort((a, b) => b.item_name.localeCompare(a.item_name));
            break;
        default:
            // "relevance" - Backend ka default order
            break;
    }
    return sorted;
};

  const applyFilters = (searchTerm, category, priceMin, priceMax, sortOverride) => {
    let result = foods;

    // 1. Search Filter
    if (searchTerm) {
        result = result.filter(food =>
            food.item_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // 2. Category Filter
    if (category !== 'All') {
        result = result.filter(food => food.category_name === category);
    }

    // 3. Price Range Filter
    const min = typeof priceMin === "number" ? priceMin : minPrice;
    const max = typeof priceMax === "number" ? priceMax : maxPrice;
    result = result.filter(food => food.item_price >= min && food.item_price <= max);

    // 4. Sorting
    const sortValue = sortOverride || sortBy;
    result = sortFoods(result, sortValue);

    setFilteredFoods(result);
    setCurrentPage(1);
};

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters(search, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    applyFilters(search, category);
  };

  const handleMinPriceInput = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMinPrice(value);
    applyFilters(search, selectedCategory, value, maxPrice);
};

const handleMaxPriceInput = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMaxPrice(value);
    applyFilters(search, selectedCategory, minPrice, value);
};

const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    applyFilters(search, selectedCategory, minPrice, maxPrice, value);
};

  return (
    <PublicLayout>

      <div className="container py-5">

        <h2 className="text-center mb-4">
          Find Your Delicious Food Here 🍔
        </h2>

        {/* Search */}

        <div className="row mb-4">

          <div className="col-md-8">

            <form onSubmit={handleSearch}>

              <div className="input-group">

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search your favourite food"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <button className="btn btn-primary">
                  Search
                </button>

              </div>

            </form>

          </div>

          <div className="col-md-4">

            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >

              <option value="All">All Categories</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}

            </select>

          </div>

        </div>


        <div className="card mb-3 border-0 shadow-sm">
    <div className="card-body py-2">
        <div className="row g-2">
            {/* Sort Dropdown */}
            <div className="col-md-4">
                <label className="form-label small mb-1">Sort</label>
                <select className="form-select form-select-sm" value={sortBy} onChange={handleSortChange}>
                    <option value="relevance">Relevance</option>
                    <option value="priceLowHigh">Price: Low to High</option>
                    <option value="priceHighLow">Price: High to Low</option>
                    <option value="nameAZ">Name: A - Z</option>
                    <option value="nameZA">Name: Z - A</option>
                </select>
            </div>

            {/* Min Price Input */}
            <div className="col-md-4">
                <label className="form-label small mb-1">Min Price (₹)</label>
                <input type="number" className="form-control form-control-sm" value={minPrice} onChange={handleMinPriceInput} min="0" />
            </div>

            {/* Max Price Input */}
            <div className="col-md-4">
                <label className="form-label small mb-1">Max Price (₹)</label>
                <input type="number" className="form-control form-control-sm" value={maxPrice} onChange={handleMaxPriceInput} min="0" />
            </div>
        </div>

        {/* Clear Filter Button */}
        <button className="btn btn-outline-secondary btn-sm w-100 mt-3" onClick={() => {
            setSearch("");
            setSelectedCategory("All");
            setMinPrice(0);
            setMaxPrice(200);
            setSortBy("relevance");
            setFilteredFoods(foods);
            setCurrentPage(1);
        }}>
            Clear Filter
        </button>
    </div>
</div>


        {/* Price Filter */}

        <div className="row mb-4">

          <div className="col-md-12">

            <label className="fw-bold mb-2">
              Price: ₹{minPrice} - ₹{maxPrice}
            </label>

            <Slider
              range
              min={0}
              max={500}
              defaultValue={[0, 500]}
              onChange={(value) => {
                setMinPrice(value[0]);
                setMaxPrice(value[1]);
                applyFilters(search, selectedCategory);
              }}
            />

          </div>

        </div>


        {/* Food Cards */}

        <div className="row">

          {filteredFoods.length === 0 ? (
            <p className="text-center">No foods found</p>
          ) : (

            filteredFoods.map((food) => (

              <div className="col-md-4 mb-4" key={food.id}>

                <div className="card food-card h-100 shadow-sm position-relative">

                 

                  <div className="food-img-wrapper">

                    <img
                      src={`http://127.0.0.1:8000${food.image}`}
                      alt={food.item_name}
                      className="food-img"
                    />

                  </div>

                  <div className="card-body text-center d-flex flex-column">

                    <h5 className="food-title">
                      {food.item_name}
                    </h5>

                    <p className="food-desc">
                      {food.item_description?.slice(0, 80)}...
                    </p>

                    <h6 className="food-price">
                      ₹ {food.item_price}
                    </h6>

                    {food.is_available ? (

                      <Link
                        to={`/food/${food.id}`}
                        className="btn btn-warning mt-auto order-btn"
                      >
                        Order Now
                      </Link>

                    ) : (

                      <button
                        className="btn btn-secondary mt-auto"
                        disabled
                      >
                        Currently Unavailable
                      </button>

                    )}

                  </div>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </PublicLayout>
  );
};

export default FoodList;