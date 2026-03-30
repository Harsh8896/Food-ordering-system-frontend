import React, { useState, useEffect } from "react";

const TopProducts = () => {
  const [topFoods, setTopFoods] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/top_selling_foods/`)
      .then((res) => res.json())
      .then((data) => {
        setTopFoods(data);
      });
  }, []);

  return (
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <i className="fas fa-star me-2"></i> Top 5 Selling Foods
      </div>

      <div className="card-body">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Food Item</th>
              <th>Total Sold</th>
            </tr>
          </thead>

          <tbody>
            {topFoods.map((food, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{food.food__item_name}</td>
                <td>{food.total_sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopProducts;