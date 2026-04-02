import React, { useEffect, useState } from 'react'
import { FaShoppingCart, FaUtensils } from 'react-icons/fa'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import "../styles/PublicLayout.css"

const PublicLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")
  const [hasActiveOrders, setHasActiveOrders] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { cartCount, setCartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const userId = localStorage.getItem("userId")
  const name = localStorage.getItem("userName")

  const fetchCartCount = async () => {
    if (userId) {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/${userId}/`)
      const data = await res.json()
      setCartCount(data.length)
    }
  }

  const checkActiveOrders = async () => {
    if (userId) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${userId}/`)
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
      setUserName(name)
      fetchCartCount()
      checkActiveOrders()
    }
  }, [userId])

  // Route change hone par menu aur dropdown band karo
  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  // Bahar click karne par dropdown band karo
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-dropdown-wrapper')) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userId")
    localStorage.removeItem("userName")
    setIsLoggedIn(false)
    setCartCount(0)
    setHasActiveOrders(false)
    setDropdownOpen(false)
    navigate("/login")
  }

  return (
    <div className="site-wrapper">

      {/* NAVBAR */}
      <nav className="custom-navbar">
        <div className="nav-container">

          {/* Brand */}
          <Link className="brand-logo" to="/" onClick={() => setMenuOpen(false)}>
            <FaUtensils className="brand-icon" />
            Foodie
          </Link>

          {/* Right side — cart + hamburger (mobile only) */}
          <div className="nav-right-mobile">
            <Link className="cart-icon-btn" to="/cart">
              <FaShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>

          {/* Nav Links */}
          <div className={`nav-menu ${menuOpen ? 'nav-menu--open' : ''}`}>

            <Link
              className={`nav-link ${location.pathname === '/' ? 'nav-link--active' : ''}`}
              to="/"
            >
              Home
            </Link>

            <Link
              className={`nav-link ${location.pathname === '/food-menu' ? 'nav-link--active' : ''}`}
              to="/food-menu"
            >
              Menu
            </Link>

            {isLoggedIn && hasActiveOrders && (
              <Link
                className={`nav-link ${location.pathname === '/my-orders' ? 'nav-link--active' : ''}`}
                to="/my-orders"
              >
                My Orders
              </Link>
            )}

            {/* Cart — desktop only */}
            <Link className="cart-icon-btn cart-desktop" to="/cart">
              <FaShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Auth */}
            {!isLoggedIn ? (
              <div className="auth-btns">
                <Link className="btn-outline" to="/login">Login</Link>
                <Link className="btn-fill" to="/register">Register</Link>
                <Link className="btn-fill" to="/admin-login">Admin</Link>
              </div>
            ) : (
              <div className="user-dropdown-wrapper">
                <button
                  className="user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  👋 {userName?.split(" ")[0]}
                  <span className={`dropdown-arrow ${dropdownOpen ? 'arrow-up' : ''}`}>▾</span>
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Profile
                    </Link>
                    <Link
                      className="dropdown-item"
                      to="/change-password"
                      onClick={() => setDropdownOpen(false)}
                    >
                      ⚙️ Settings
                    </Link>
                    <hr className="dropdown-divider" />
                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Mobile overlay */}
        {menuOpen && (
          <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
        )}
      </nav>

      {/* CONTENT */}
      <main className="main-content">{children}</main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <FaUtensils className="me-2" />
            Foodie
          </div>
          <p className="footer-copy">© 2026 Food Ordering System | All Rights Reserved</p>
        </div>
      </footer>

    </div>
  )
}

export default PublicLayout