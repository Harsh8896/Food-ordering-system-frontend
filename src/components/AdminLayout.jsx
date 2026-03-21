import React, { useEffect, useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import ".././styles/admin.css"

const AdminLayout = ({children}) => {
  const [sideBarOpen, setSidebarOpen] = useState(true)
  const [newOrders, setNewOrders] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const rid = localStorage.getItem('restaurantId');
    const restaurantId = rid && rid !== 'null' ? rid : null;
    const url = restaurantId
      ? `http://127.0.0.1:8000/api/dashboard_metrics/?restaurant_id=${restaurantId}`
      : `http://127.0.0.1:8000/api/dashboard_metrics/`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setNewOrders(data.new_orders);
      });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  return (
    <div className='d-flex'>
      {sideBarOpen && <AdminSidebar />}
      <div id='page-content-wrapper' className={`w-100 ${sideBarOpen ? "full-width" : "width-sidebar"}`}>
        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sideBarOpen} newOrders={newOrders} />
        <div className='container-fluid mt-4'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout