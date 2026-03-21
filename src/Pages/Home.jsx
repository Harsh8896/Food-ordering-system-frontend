import React, { useEffect, useState } from 'react'
import PublicLayout from '../components/PublicLayout'
import "../styles/home.css"
import { Link } from 'react-router-dom'
import { FaCartArrowDown } from 'react-icons/fa'

const Home = () => {

const [foods, setFoods] = useState([])
const [ratings, setRatings] = useState({})
const [hovered, setHovered] = useState(null);

/* ---------- FETCH RANDOM FOODS ---------- */

useEffect(()=>{

fetch(`http://127.0.0.1:8000/api/random_foods/`)
.then(res => res.json())
.then(data => {
setFoods(data)
})

},[])



/* ---------- FETCH RATINGS ---------- */

useEffect(()=>{

const fetchAllRatings = async ()=>{

const allRatings = {}

for(let food of foods){

const res = await fetch(`http://127.0.0.1:8000/api/food_rating_summary/${food.id}/`)
const data = await res.json()

allRatings[food.id] = data

}

setRatings(allRatings)

}

if(foods.length > 0){
fetchAllRatings()
}

},[foods])



return (

<PublicLayout>

{/* ---------- HERO SECTION ---------- */}

<section className='py-5 hero text-center d-flex justify-content-center align-items-center' style={{backgroundImage:"url('/img/food1.png')", height:"500px",}}>

<div style={{background:"rgba(0,0,0,0.5)", padding:"20px 40px",  borderRadius:"10px"}}>

<h1 className='display-4 text-white'>
Quick & Hot Food Delivered to You
</h1>

<p className='text-white fs-4'>
Craving something tasty? Let's get it to your door!
</p>

<form method="GET" action="/search" className='d-flex mt-3' style={{maxWidth:"600px", margin:"0 auto"}}>

<input
type="text"
name='q'
placeholder='I would like to eat...'
className='form-control'
style={{borderTopRightRadius:0, borderBottomRightRadius:0}}
/>

<button
className='btn btn-warning px-4'
style={{borderTopLeftRadius:0, borderBottomLeftRadius:0}}
>
Search
</button>

</form>

</div>

</section>



{/* ---------- FOOD LIST ---------- */}

<section className='py-5'>

<div className='container'>

<h2 className='text-center mb-4'>

Most Loved Dishes This Month

<span className='badge bg-danger ms-2'>
Top Picks
</span>

</h2>

<div className='row mt-4'>

{foods.length === 0 ? (

<p className='text-center'>
No foods found
</p>

) : (

foods.map((item)=>(
    
<div className='col-md-4 mb-4' key={item.id}>

<div className='card hovereffect'>

<img
src={`http://127.0.0.1:8000/${item.image}`}
className='card-img-top object-fit-fill'
alt=""
style={{height:"210px"}}
/>

<div className='card-body'>

<h5 className='card-title'>

<Link to={`/food/${item.id}`}>
{item.item_name}
</Link>

</h5>

<p className='card-text text-muted'>

{item.item_description?.slice(0,50)}...

</p>



{/* ---------- RATING ---------- */}

{ratings[item.id] && (
    <div className="mb-2 rating-summary-wrapper position-relative"
        onMouseEnter={() => setHovered(item.id)}
        onMouseLeave={() => setHovered(null)}
    >
        <div>
            <span className="text-warning">
                {/* Bhari hui stars (Filled Stars) */}
                {Array(Math.round(ratings[item.id].average)).fill().map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                ))}
                {/* Khali stars (Unfilled Stars) */}
                {Array(5 - Math.round(ratings[item.id].average)).fill().map((_, i) => (
                    <i key={i} className="far fa-star"></i>
                ))}
            </span>
            <small className="text-muted ms-2">
                {ratings[item.id].average} ({ratings[item.id].total_reviews} ratings)
            </small>
        </div>

        {/* Hover karne par dikhne wala Popup (Rating Breakdown) */}
        {hovered === item.id && ratings[item.id].breakdown && (
            <div className="hover-popup p-3 border rounded shadow position-absolute bg-white"
                style={{ 
                    bottom: "100%", 
                    width: "100%", 
                    marginBottom: "10px", 
                    zIndex: "1000" 
                }}
            >
                {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratings[item.id].breakdown[star] || 0;
                    const percentage = ratings[item.id].total_reviews 
                        ? (count / ratings[item.id].total_reviews) * 100 
                        : 0;

                    return (
                        <div key={star} className="d-flex align-items-center mb-1">
                            <small style={{ width: "50px" }}>{star} star</small>
                            <div className="progress flex-grow-1" style={{ height: "8px" }}>
                                <div 
                                    className="progress-bar bg-warning" 
                                    role="progressbar" 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                            <small className="ms-2">{count}</small>
                        </div>
                    );
                })}
            </div>
        )}
    </div>
)}



<div className='d-flex justify-content-between align-items-center'>

<span className='fw-bold'>

₹ {item.item_price}

</span>

{item.is_available ? (

<Link
to={`/food/${item.id}`}
className='btn btn-warning btn-sm text-white d-flex align-items-center'
>

<FaCartArrowDown className='me-2'/>

Order now

</Link>

) : (

<div title='This food item is not available right now. Please try again later.'>

<button className='btn btn-outline-primary btn-sm'>

Currently Unavailable

</button>

</div>

)}

</div>
<p className="text-muted small mb-1">
    🍽️ {item.restaurant_name || 'Local Restaurant'}
</p>
</div>

</div>

</div>

))

)}

</div>

</div>

</section>



{/* ---------- STEPS SECTION ---------- */}

<section className='py-5 bg-dark text-white'>

<div className='container text-center'>

<h2>
Ordering in 3 simple Steps
</h2>

<div className='row mt-4'>

<div className="col-md-4">

<h4>
1. Pick a dish you love
</h4>

<p>
Explore hundreds of mouth-watering options and choose what crave!
</p>

</div>

<div className="col-md-4">

<h4>
2. Share your Location
</h4>

<p>
Tell us where you are, we'll handle the rest.
</p>

</div>

<div className="col-md-4">

<h4>
3. Enjoy doorstep delivery
</h4>

<p>
Relax while your meal arrives fast and fresh.
</p>

</div>

</div>

<p>
Pay easily with online and cash on Delivery.
</p>

</div>

</section>



{/* ---------- CTA ---------- */}

<section className='py-5 bg-warning text-center text-dark'>

<h4>
Ready to Satisfy Your Hunger?
</h4>

<Link className='btn btn-dark btn-lg' to="/menu">

Browse Full Menu

</Link>

</section>

</PublicLayout>

)

}

export default Home