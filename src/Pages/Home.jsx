import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import "../styles/home.css"
import { Link } from 'react-router-dom'
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronRight, FaStore, FaCrown } from 'react-icons/fa'

const BASE_URL = "http://127.0.0.1:8000"

// ⭐ Star renderer
const renderStars = (avg, size = 14) => {
return [1, 2, 3, 4, 5].map(i => {
const filled = i <= Math.floor(avg)
const half = !filled && i === Math.ceil(avg) && avg % 1 >= 0.5
return filled
? <FaStar key={i} color="#fbbf24" size={size} />
: half
? <FaStarHalfAlt key={i} color="#fbbf24" size={size} />
: <FaRegStar key={i} color="#d1d5db" size={size} />
})
}

const Home = () => {
const [restaurantFoods, setRestaurantFoods] = useState([])
const [masterFoods, setMasterFoods] = useState([])
const [hoveredId, setHoveredId] = useState(null)
const [activeTab, setActiveTab] = useState('all')

useEffect(() => {
fetch(`${BASE_URL}/api/home-feed/`)
.then(res => res.json())
.then(data => {
setRestaurantFoods(data.restaurant_foods || [])
setMasterFoods(data.master_foods || [])
})
}, [])

const foodCardStyle = (isHovered) => ({
borderRadius: '25px',
backgroundColor: '#fff',
transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.1)' : '0 5px 15px rgba(0,0,0,0.03)',
border: '1px solid #f0f0f0',
height: '100%',
overflow: 'visible',
})

const totalCount = restaurantFoods.length + masterFoods.length

return ( <PublicLayout>

```
  {/* HERO */}
  <section
    className='py-5 hero text-center d-flex justify-content-center align-items-center'
    style={{ backgroundImage: "url('/img/food1.png')", height: '500px' }}
  >
    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px 40px', borderRadius: '10px' }}>
      <h1 className='display-4 text-white'>Quick & Hot Food Delivered to You</h1>
      <p className='text-white fs-4'>Craving something tasty? Let's get it to your door!</p>
    </div>
  </section>

  {/* FOOD LIST */}
  <section className='py-5' style={{ backgroundColor: '#fcfcfc' }}>
    <div className='container-fluid px-lg-5'>

      <h2 className='text-center mb-3'>
        Most Loved Dishes This Month
        <span className='badge bg-danger ms-2'>Top Picks</span>
      </h2>

      {/* Tabs */}
      <div className='d-flex justify-content-center gap-2 mb-4 flex-wrap'>
        {[
          { key: 'all', label: `All (${totalCount})` },
          { key: 'restaurant', label: `Restaurant Items (${restaurantFoods.length})` },
          { key: 'master', label: `Multi-Restaurant (${masterFoods.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`btn btn-sm rounded-pill px-4 ${
              activeTab === tab.key ? 'btn-warning fw-bold' : 'btn-outline-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className='row g-4'>

        {/* RESTAURANT FOODS */}
        {(activeTab === 'all' || activeTab === 'restaurant') &&
          restaurantFoods.map((item) => {
            const key = `restaurant-${item.id}`
            const isHovered = hoveredId === key

            return (
              <div className='col-md-4' key={key}>
                <div
                  style={foodCardStyle(isHovered)}
                  onMouseEnter={() => setHoveredId(key)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* IMAGE */}
                  <div className='position-relative' style={{ height: '200px', overflow: 'hidden', borderRadius: '25px 25px 0 0' }}>
                    <img
                      src={item.image ? `${BASE_URL}${item.image}` : "/img/no-image.png"}
                      alt={item.item_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: '0.6s',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />

                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}>
                      {item.category_name || 'Food'}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className='p-4 d-flex flex-column'>
                    <div className='d-flex justify-content-between align-items-start mb-2'>
                      <h6 className='fw-bold mb-0'>{item.item_name}</h6>

                      <span style={{
                        background: 'rgba(16,185,129,0.1)',
                        color: '#059669',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        🍽️ {item.restaurant_name}
                      </span>
                    </div>

                    <p className='text-muted small mb-2'>
                      {item.item_description?.slice(0, 60)}...
                    </p>

                    <div className='mb-2'>
                      {renderStars(item.average_rating || 0)}
                    </div>

                    <div className='d-flex justify-content-between align-items-center mt-auto pt-3 border-top'>
                      <span className='fw-bold fs-5'>₹{item.item_price}</span>

                      <Link to={`/food/${item.id}`} className='btn btn-warning rounded-pill px-4'>
                        Order <FaChevronRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

        {/* MASTER FOODS (NO COMPARISON UI) */}
        {(activeTab === 'all' || activeTab === 'master') &&
          masterFoods.map((item) => {
            const key = `master-${item.id}`
            const isHovered = hoveredId === key

            return (
              <div className='col-md-4' key={key}>
                <div
                  style={foodCardStyle(isHovered)}
                  onMouseEnter={() => setHoveredId(key)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* IMAGE */}
                  <div className='position-relative' style={{ height: '200px', overflow: 'hidden', borderRadius: '25px 25px 0 0' }}>
                    <img
                      src={item.image ? `${BASE_URL}${item.image}` : "/img/no-image.png"}
                      alt={item.item_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: '0.6s',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />

                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '20px'
                    }}>
                      <FaCrown size={9} /> Multi-Restaurant
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className='p-4 d-flex flex-column'>
                    <div className='d-flex justify-content-between align-items-start mb-2'>
                      <h6 className='fw-bold mb-0'>{item.item_name}</h6>

                      <span style={{
                        background: 'rgba(99,102,241,0.1)',
                        color: '#6366f1',
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        <FaStore size={10} /> {item.restaurant_count} places
                      </span>
                    </div>

                    <p className='text-muted small mb-2'>
                      {item.item_description?.slice(0, 60)}...
                    </p>

                    <div className='d-flex justify-content-between align-items-center mt-auto pt-3 border-top'>
                      <span className='fw-bold fs-5'>₹{item.min_price}</span>

                      <Link to={`/master-food/${item.id}`} className='btn btn-warning rounded-pill px-4'>
                        View <FaChevronRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

      </div>
    </div>
  </section>

</PublicLayout>


)
}

export default Home