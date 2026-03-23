import React, { useEffect, useState } from 'react'
import { FaShoppingCart, FaUtensils } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import "../styles/PublicLayout.css"

const PublicLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [hasActiveOrders, setHasActiveOrders] = useState(false)

  const { cartCount, setCartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  const name = localStorage.getItem("userName")

  const fetchCartCount = async () => {
    if (userId) {
      const res = await fetch(`http://127.0.0.1:8000/api/cart/${userId}/`)
      const data = await res.json()
      setCartCount(data.length)
    }
  }

  const checkActiveOrders = async () => {
    if (userId) {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/orders/${userId}/`)
        const data = await res.json()
        setHasActiveOrders(data.length > 0)
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true)
      setUserName(name) // ✅ FIX
      fetchCartCount()
      checkActiveOrders()
    }
  }, [userId])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    setIsLoggedIn(false)
    setCartCount(0)
    setHasActiveOrders(false)
    navigate("/login")
  }

  return (
    <div>

      {/* 🔥 NAVBAR */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container">

          <Link className="navbar-brand brand-logo" to="/">
            <FaUtensils className="me-2" />
            Foodie
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto align-items-center">

              <li className="nav-item mx-2">
                <Link className={`nav-link ${location.pathname === '/' ? 'active-link' : ''}`} to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item mx-2">
                <Link className={`nav-link ${location.pathname === '/food-menu' ? 'active-link' : ''}`} to="/food-menu">
                  Menu
                </Link>
              </li>

              {isLoggedIn && hasActiveOrders && (
                <li className="nav-item mx-2">
                  <Link className={`nav-link ${location.pathname === '/my-orders' ? 'active-link' : ''}`} to="/my-orders">
                    Orders
                  </Link>
                </li>
              )}

              {/* 🛒 CART */}
              <li className="nav-item mx-2">
                <Link className="nav-link cart-icon" to="/cart">
                  <FaShoppingCart />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
              </li>

              {/* 🔐 AUTH */}
              {!isLoggedIn ? (
                <>
                  <li className="nav-item mx-2">
                    <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                  </li>
                  <li className="nav-item mx-2">
                    <Link className="btn btn-warning btn-sm" to="/register">Register</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown mx-2">
                  <a
                    className="nav-link dropdown-toggle user-dropdown"
                    href="#"
                    data-bs-toggle="dropdown"
                  >
                    👋 {userName}
                  </a>

                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                    <li><Link className="dropdown-item" to="/change-password">Settings</Link></li>
                    <li><hr /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={handleLogout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div>{children}</div>

      {/* 🔥 FOOTER */}
      <footer className="footer">
        <div className="container text-center">
          <p>© 2026 Food Ordering System | All Rights Reserved</p>
        </div>
      </footer>

    </div>
  )
}

export default PublicLayout