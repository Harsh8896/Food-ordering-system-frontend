import React, { useState } from 'react'
import {FaUser, FaLock, FaSignInAlt} from "react-icons/fa"
import {toast, ToastContainer} from "react-toastify"
import { useNavigate } from 'react-router-dom'
import "react-toastify/dist/ReactToastify.css";
import PublicLayout from '../components/PublicLayout';

const AdminLogin = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()


    const handleLogin = async (e)=> {
        e.preventDefault();

       const response = await fetch("http://127.0.0.1:8000/api/admin-login/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),

        })
        const data = await response.json()
            if (response.status === 200) {
                toast.success(data.message)
                localStorage.setItem("adminUser", username)
                setTimeout(()=>{
                    window.location.href = "/admin-dashboard"
                }, 3000)
            } else {
                toast.error(data.error || "Login Failed")
            }
       
    }

  return (
    <PublicLayout>
    <div className='d-flex justify-content-center align-items-center vh-100' >
        <div className='card p-4 shadow-lg' style={{width:"100%", maxWidth:"400px"}}>
            <h4 className='text-center'>
                <FaUser className='me-2 icon-fix' /> Login
            </h4>
            {
                console.log("Username:", username, "Password:", password)
            }
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">
                      <FaUser className='me-2 icon-fix'/>  Username
                    </label>
                    <input type="text" value={username} onChange={(e)=>setUsername(e.target.value)} className='form-control' placeholder='Enter Admin User' required />
                </div>

                <div className="mb-3">
                    <label className="form-label">
                        <FaLock className='me-2 icon-fix'/> Password
                    </label>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className='form-control' placeholder='Enter Admin password' required />
                </div>
                <button type="submit" className='btn btn-primary w-100 mt-3'>
                    <FaSignInAlt className='me-1 icon-fix'/> Login
                </button>
            </form>
        </div>
      <ToastContainer position='top-center' autoClose={2000}/>
    </div>
    </PublicLayout>
  )
}

export default AdminLogin