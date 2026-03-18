import React from 'react';
import { FaBars, FaBell, FaChevronLeft, FaChevronRight, FaSignOutAlt, FaUtensils, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const AdminHeader = ({ toggleSidebar, sideBarOpen, newOrders }) => {
  let navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  const styles = {
    navbar: {
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(12px)", // Modern Glass effect
      borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
      padding: "0.6rem 2rem",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    toggleWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "15px"
    },
    btnIcon: {
      width: "38px",
      height: "38px",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      background: "#f8f9fa",
      border: "1px solid #eee",
      color: "#555",
      cursor: "pointer"
    },
    brandText: {
      fontSize: "1.1rem",
      fontWeight: "800",
      background: "linear-gradient(45deg, #2d3436, #636e72)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      letterSpacing: "-0.5px"
    },
    notificationCircle: {
      width: "42px",
      height: "42px",
      borderRadius: "50%",
      background: newOrders > 0 ? "#fff4e6" : "#f8f9fa",
      color: newOrders > 0 ? "#fd7e14" : "#adb5bd",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      border: "none",
      transition: "0.3s"
    },
    logoutBtn: {
      background: "#fff1f1",
      color: "#fa5252",
      border: "none",
      padding: "8px 18px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "0.85rem",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "0.2s"
    }
  };

  return (
    <nav className='d-flex align-items-center justify-content-between shadow-sm' style={styles.navbar}>
      
      {/* LEFT: Toggle & Logo */}
      <div style={styles.toggleWrapper}>
        <div 
          style={styles.btnIcon} 
          onClick={toggleSidebar}
          className="hover-scale"
        >
          {sideBarOpen ? <FaChevronLeft size={14}/> : <FaChevronRight size={14}/>}
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <div className="bg-dark rounded-3 p-1 d-flex align-items-center justify-content-center" style={{width: "32px", height: "32px"}}>
            <FaUtensils className="text-warning" size={16}/>
          </div>
          <span style={styles.brandText} className="d-none d-md-block">
            FOOD<span className="text-warning">OS</span> 
            <small className="ms-2 fw-normal text-muted" style={{fontSize: '0.7rem', textFillColor: '#999', WebkitTextFillColor: '#999'}}>ADMIN</small>
          </span>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className='d-flex align-items-center gap-4'>
        
        {/* New Orders Bell */}
        <button 
          style={styles.notificationCircle}
          onClick={() => newOrders > 0 && navigate('/order-not-confirmed')}
          className={`btn-hover-effect ${newOrders > 0 ? 'bell-shake' : ''}`}
        >
          <FaBell size={20} />
          {newOrders > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm" style={{fontSize: '0.6rem'}}>
              {newOrders}
            </span>
          )}
        </button>

        <div style={{height: "25px", width: "1px", background: "#eee"}}></div>

        {/* User Info & Logout */}
        <div className="d-flex align-items-center gap-3">
          <div className="text-end d-none d-sm-block">
            <p className="m-0 fw-bold small" style={{lineHeight: 1}}>Administrator</p>
            <span className="text-success small" style={{fontSize: '0.7rem'}}>● Online</span>
          </div>
          
          <button onClick={handleLogout} style={styles.logoutBtn} className="logout-hover">
            <FaSignOutAlt />
            <span className="d-none d-md-inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Minimal CSS for animations */}
      <style>{`
        .hover-scale:hover { transform: scale(1.05); background: #eee !important; }
        .btn-hover-effect:hover { background: #ffe8cc !important; transform: translateY(-2px); }
        .logout-hover:hover { background: #ffe3e3 !important; transform: translateY(-2px); }
        
        @keyframes shake {
          0% { transform: rotate(0); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-15deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          100% { transform: rotate(0); }
        }
        .bell-shake { animation: shake 2s infinite ease-in-out; }
      `}</style>
    </nav>
  );
};

export default AdminHeader;