import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaCartArrowDown } from "react-icons/fa";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "react-toastify/dist/ReactToastify.css";

const FoodDetail = () => {

const { id } = useParams();
const navigate = useNavigate();
const userId = localStorage.getItem("userId");

const [food, setFood] = useState(null);
const [reviews, setReviews] = useState([]);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");
const [hoveredRating, setHoveredRating] = useState(0);
const [editId, setEditId] = useState(null);



/* ---------------- FETCH FOOD ---------------- */

useEffect(() => {

fetch(`http://127.0.0.1:8000/api/foods/${id}/`)
.then(res => res.json())
.then(data => setFood(data));

fetchReviews();

}, [id]);



/* ---------------- FETCH REVIEWS ---------------- */

const fetchReviews = async () => {

try {

const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`);
const data = await res.json();
setReviews(data);

} catch {

toast.error("Failed to load reviews");

}

};



/* ---------------- ADD TO CART ---------------- */

const handleAddToCart = async () => {

if (!userId) {
navigate("/login");
return;
}

try {

const res = await fetch("http://127.0.0.1:8000/api/cart/add/", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
userId: userId,
foodId: food.id
})
});

const result = await res.json();

if (res.ok) {

toast.success(result.message || "Item added to cart");

setTimeout(() => {
navigate("/cart");
},1500);

} else {

toast.error(result.message);

}

} catch {

toast.error("Cart error");

}

};



/* ---------------- ADD / UPDATE REVIEW ---------------- */

const handleReviewSubmit = async () => {

if (!userId) {

toast.warning("Please login first");
navigate("/login");
return;

}

if (rating < 1 || rating > 5) {

toast.error("Select rating between 1 to 5");
return;

}

const payload = {
user_id: userId,
food: id,
rating: rating,
comment: comment
};

const url = editId
? `http://127.0.0.1:8000/api/review_edit/${editId}/`
: `http://127.0.0.1:8000/api/reviews/add/${id}/`;

const method = editId ? "PUT" : "POST";

try {

const res = await fetch(url,{
method: method,
headers:{ "Content-Type":"application/json" },
body: JSON.stringify(payload)
});

if(res.ok){

toast.success(editId ? "Review updated" : "Review submitted");

setRating(0);
setComment("");
setEditId(null);

fetchReviews();

}

}catch{

toast.error("Server error");

}

};



/* ---------------- DELETE REVIEW ---------------- */

const handleDeleteReview = async (revId) => {

if(!window.confirm("Delete this review?")) return;

const res = await fetch(`http://127.0.0.1:8000/api/review_edit/${revId}/`,{
method:"DELETE"
});

if(res.ok){

toast.success("Review deleted");
fetchReviews();

}

};



/* ---------------- EDIT REVIEW ---------------- */

const handleEditReview = (rev) => {

setRating(rev.rating);
setComment(rev.comment);
setEditId(rev.id);

window.scrollTo({
top: document.body.scrollHeight,
behavior:"smooth"
});

};



/* ---------------- STAR RENDER ---------------- */

const renderStars = (count, clickable=false) => {

const stars=[];

for(let i=1;i<=5;i++){

stars.push(

<i
key={i}
className={`fa-star ${i <= (hoveredRating || count) ? "fas text-warning" : "far text-secondary"}`}
style={{cursor:clickable?"pointer":"default",fontSize:"20px",marginRight:"4px"}}
onClick={clickable ? ()=>setRating(i):undefined}
onMouseEnter={clickable ? ()=>setHoveredRating(i):undefined}
onMouseLeave={clickable ? ()=>setHoveredRating(0):undefined}
></i>

);

}

return stars;

};



if(!food) return <div className="container p-5">Loading...</div>;



return (

<div className="container py-5">

<ToastContainer/>

<div className="row">

<div className="col-md-5 text-center">

<Zoom>

<img
src={`http://127.0.0.1:8000/${food.image}`}
style={{width:"100%",height:"300px",objectFit:"cover"}}
alt=""
/>

</Zoom>

</div>

<div className="col-md-7">

<h2>{food.item_name}</h2>
<p className="text-muted">{food.item_description}</p>
<h4>₹ {food.item_price}</h4>

{food.is_available ? (

<button
onClick={handleAddToCart}
className="btn btn-warning text-white mt-3"
>

<FaCartArrowDown className="me-2"/>
Add to Cart

</button>

) : (

<button className="btn btn-secondary mt-3">
Currently Unavailable
</button>

)}

</div>

</div>



{/* REVIEWS */}

<div className="mt-5">

<h4 className="mb-3 text-primary">Customer Reviews</h4>

{reviews.length===0 ? (
<p className="text-muted">No reviews yet</p>
) : (

reviews.map((rev)=>(

<div key={rev.id} className="border-bottom pb-3 mb-3">

<div className="d-flex justify-content-between">

<div>

<div className="d-flex align-items-center">

<strong className="text-primary me-2">
{rev.user_name}
</strong>

{renderStars(rev.rating)}

</div>

<p className="mb-1 text-secondary">
{rev.comment}
</p>

<small className="text-muted">
{new Date(rev.created_at).toLocaleString()}
</small>

</div>

{/* EDIT DELETE */}

{rev.user === parseInt(userId) && (

<div className="text-end">

<i
className="fas fa-edit text-primary me-2"
style={{cursor:"pointer"}}
title="Edit"
onClick={()=>handleEditReview(rev)}
></i>

<i
className="fas fa-trash-alt text-danger"
style={{cursor:"pointer"}}
title="Delete"
onClick={()=>handleDeleteReview(rev.id)}
></i>

</div>

)}

</div>

</div>

))

)}



{/* WRITE REVIEW */}

<div className="mt-4">

<h5>
{editId ? "Update Review" : "Write a Review"}
</h5>

<div className="mb-2">
{renderStars(rating,true)}
</div>

<textarea
className="form-control mb-3"
rows="3"
placeholder="Write your review..."
value={comment}
onChange={(e)=>setComment(e.target.value)}
></textarea>

<button
className="btn btn-success"
onClick={handleReviewSubmit}
>
{editId ? "Update Review" : "Submit Review"}
</button>

</div>

</div>

</div>

);

};

export default FoodDetail;