import React, { useEffect, useState } from 'react'
import { FaShoppingCart, FaUtensils } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import "../styles/PublicLayout.css"

const PublicLayout = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
   const {cartCount, setCartCount} = useCart();

   const location = useLocation();

  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")
  const name = localStorage.getItem("userName")


   const fetchCartCount = async () => {
  if (userId) {
    const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`);
    const data = await res.json();
    setCartCount(data.length);
  }
};

  useEffect(()=>{
    if(userId){
      setIsLoggedIn(true)
      setUserName(true)
      fetchCartCount()
    }
  },[userId])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    setIsLoggedIn(false)
    setCartCount(0)
    navigate("/login")
  }

 

  return (
    <div>


        <nav className="navbar navbar-expand-lg navbar-dark bg-dark position-sticky top-0 left-0 z-3">
  <div className="container">
    <Link className="navbar-brand fw-bold" href="#"><FaUtensils className='me-1'/> Food Ordering System</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item mx-1">
           <Link className={`nav-link ${location.pathname === '/' ? 'active-nav-link' : ''}`} to="/">Home</Link>
        </li>
        <li className="nav-item mx-1">
           <Link className={`nav-link ${location.pathname === '/food-menu' ? 'active-nav-link' : ''}`} to="/food-menu">Menu</Link>
        </li>
        
        {
          !isLoggedIn ? (
            <>
            <li className="nav-item mx-1">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
         <li className="nav-item mx-1">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item mx-1">
          <Link className="nav-link" to="/admin-login">Admin</Link>
        </li>
        
            </>
          ) : (
            <>

            <li className="nav-item mx-1">
          <Link className="nav-link" to="/track-order">Track</Link>
        </li>

        {/* <li className="nav-item mx-1">
          <Link className="nav-link" to="/order-details">Order Detail</Link>
        </li> */}

            <li className="nav-item mx-1">
  <Link className="nav-link position-relative" to="/cart">

    <span className="me-1">Cart</span>
    <FaShoppingCart size={20} />


    {cartCount > 0 && (
      <span className="cart-badge">
        {cartCount}
      </span>
    )}

  </Link>
</li>

         

             <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle text-capitalize" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown">
            {name}
          </a>
          <ul class="dropdown-menu">
            <li><Link className={`dropdown-item ${location.pathname === '/profile' ? 'active-dropdown' : ''}`} to="/profile">Profile</Link></li>
            <li><Link className="dropdown-item" to="/change-password">Setting</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
          </ul>
        </li>
            </>
          )
        }
         
      </ul>
      
    </div>
  </div>
</nav>

        <div>
            {children}
        </div>

    <footer className='text-center py-3 mt-5'>
      <div className='container'>
        <p>&copy; 2026 AI Recommendation Based Food Ordering System. All Right Reserved</p>
      </div>
    </footer>

    </div>
  )
}

export default PublicLayout