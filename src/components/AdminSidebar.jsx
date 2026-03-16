import React, { useState } from 'react'
import ".././styles/admin.css"
import { Link } from 'react-router-dom'
import { FaChevronDown, FaChevronUp, FaEdit, FaThLarge, FaUsers } from 'react-icons/fa'


const AdminSidebar = () => {
    const [openMenus, setOpenMenus] = useState({
        category: false,
        food: false,
        orders: false,
    });  

    const toggleMenu = (menu) => {
        setOpenMenus((prevState) => ({
            ...prevState,
            [menu]: !prevState[menu],
        }));
    }
  return (
    <div className='bg-dark text-white sidebar'>
        <div className='text-center p-3 border-bottom mb-3'>
            <img src="/img/admin.png" className='rounded mb-2' width={70} height={70} alt="" />
            <h6>Admin</h6>
        </div>
        <div className="list-group list-group-flush">
            <Link to="/admin-dashboard" className="list-group-item list-group-item-action bg-dark text-white"><FaThLarge className="icon-fix"/> Dashboard</Link>
        </div>
        <div className="list-group list-group-flush">
            <Link to="/manage_users" className="list-group-item list-group-item-action bg-dark text-white"><FaUsers className="icon-fix"/> Reg User</Link>
        </div>
        <div className="list-group list-group-flush border-none">
            <button onClick={()=>toggleMenu("category")} className="list-group-item list-group-item-action bg-dark text-white border-0">
            <FaEdit/> Add Category {openMenus.category ? <FaChevronUp/> : <FaChevronDown/>}
        </button>
        <div className={openMenus.category ? "d-block" : "d-none"}>
            <Link to="/add-category" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-none border-0"> Add Category</Link>
            <Link to="/manage-category" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0"> Manage Category</Link>
        </div>



        <button onClick={()=>toggleMenu("food")} className="list-group-item list-group-item-action bg-dark text-white border-0">
            <FaEdit/> Food Items {openMenus.food ? <FaChevronUp/> : <FaChevronDown/>}
        </button>
        <div className={`${openMenus.food ? "d-block" : "d-none"} pl-3`}>
            <Link to="/add-food" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0"> Add Food Item</Link>
            <Link to="/manage-food" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0"> Manage Food Items</Link>
        </div>


        <button onClick={()=>toggleMenu("orders")} className="list-group-item list-group-item-action bg-dark text-white border-0">
            <FaEdit/> Orders {openMenus.orders ? <FaChevronUp/> : <FaChevronDown/>}
        </button>
        <div className={`${openMenus.orders ? "d-block" : "d-none"} me-3`}>
            <Link to="/order-not-confirmed" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">Not Confirmed</Link>
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">Confirmed</Link>
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">Being Prepared</Link>
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">Food Pickup</Link>
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">Food Delivered</Link>
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">Cancelled</Link>
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white ps-4 border-0">All Ordered</Link>

        </div>


        </div>
        <div className="list-group list-group-flush">
            <Link to="/search-order" className="list-group-item list-group-item-action bg-dark text-white"><FaThLarge className="icon-fix"/> Search</Link>
        </div>
        <div className="list-group list-group-flush">
            <Link to="/order-report" className="list-group-item list-group-item-action bg-dark text-white"><FaThLarge className="icon-fix"/> B/w Dates Reports</Link>
        </div>
        <div className="list-group list-group-flush">
            <Link to="/manage-review" className="list-group-item list-group-item-action bg-dark text-white"><FaThLarge className="icon-fix"/> Manage Reviews</Link>
        </div>
        <div className="list-group list-group-flush">
            <Link to="#" className="list-group-item list-group-item-action bg-dark text-white"><FaThLarge className="icon-fix"/> Dashboard</Link>
        </div>
    </div>
  )
}

export default AdminSidebar