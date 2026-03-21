  import React from 'react'
  import {BrowserRouter, Routes, Route} from "react-router-dom"
  import Home from './Pages/Home'
  import AdminLogin from './Pages/AdminLogin'
  import AdminDashboard from './Pages/AdminDashboard'
  import AddCategory from './Pages/AddCategory'
  import ManageCategory from './Pages/ManageCategory'
  import AddFood from './Pages/AddFood'
  import ManageFood from './Pages/ManageFood'
  import SearchPage from './Pages/SearchPage'
  import Register from './components/Register'
  import Login from './components/Login'
  import FoodDetail from './Pages/FoodDetail'
  import Cart from './Pages/Cart'
  import PaymentPage from './Pages/PaymentPage'
  import MyOrders from './Pages/MyOrders'
  import OrderDetail from './Pages/OrderDetail'
  import ProfilePage from './Pages/ProfilePage'
  import ChangePassword from './Pages/ChangePassword'
  import OrdersNotConfirmed from './Pages/OrdersNotConfirmed'
  import OrderReport from './Pages/OrderReport'
  import ViewFoodOrder from './Pages/ViewFoodOrder'
  import SearchOrder from './Pages/SearchOrder '
  import EditCategory from './Pages/EditCategory '
  import EditFood from './Pages/EditFood '
  import ManageUser from './Pages/ManageUser '
  import { CartProvider } from './context/CartContext'
  import FoodList from './Pages/FoodList'
  import TrackOrder from "./Pages/TrackOrder"
  import ManageReviews from "./Pages/ManageReviews"
import SuperAdminDashboard from './components/SuperAdmin/SuperAdminDashboard'
import ConfirmOrder from './Pages/ConfirmOrder'
import OrderDelivered from './Pages/OrderDelivered'
import RestaurantOwnerLogin from './components/RestaurantOwnerLogin '
import RestaurantDashboard from './Pages/RestaurantDashboard'
import MyDeliveredOrders from "./Pages/MyDeliveredOrders";

  const App = () => {
    return (
      <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/admin-login' element={<AdminLogin/>}/>
          <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
          <Route path='/add-category' element={<AddCategory/>}/>
          <Route path='/manage-category' element={<ManageCategory/>}/>
          <Route path='/add-food' element={<AddFood/>}/>
          <Route path='/manage-food' element={<ManageFood/>}/>
          <Route path='/search' element={<SearchPage/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/food/:id' element={<FoodDetail/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/payment' element={<PaymentPage/>}/>
          <Route path='/my-orders' element={<MyOrders/>}/>
          <Route path='/order-details/:order_number' element={<OrderDetail/>}/>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/order-not-confirmed" element={<OrdersNotConfirmed />} />
          <Route path="/order-report" element={<OrderReport />} />
          <Route path="/admin-view-order-detail/:order_number" element={<ViewFoodOrder />} />
          <Route path="/search-order" element={<SearchOrder />} />
          <Route path="/edit_category/:id" element={<EditCategory />} />
          <Route path="/edit_food/:id" element={<EditFood />} />
          <Route path="/manage_users" element={<ManageUser />} />
          <Route path="/food-menu" element={<FoodList />} />
          <Route path="/track-order/:paramOrderNumber" element={<TrackOrder/>} />
          <Route path="/manage-review" element={<ManageReviews/>} />
          <Route path="/confirm-order" element={<ConfirmOrder/>} />
          <Route path="/order-delivered" element={<OrderDelivered/>} />





          <Route path="/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/restaurant-login" element={<RestaurantOwnerLogin />} />
          <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
          <Route path="/my-orders" element={<MyDeliveredOrders />} />

        </Routes>
      </BrowserRouter>
      </CartProvider>
    )
  }

  export default App