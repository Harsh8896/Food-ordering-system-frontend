import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // Backup for searching

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setAllUsers(data);
            });
    }, []);

    // Search logic
    const handleSearch = (s) => {
        const keyword = s.toLowerCase();
        if (!keyword) {
            setUsers(allUsers);
        } else {
            const filtered = allUsers.filter(u => 
                u.first_name.toLowerCase().includes(keyword) || 
                u.last_name.toLowerCase().includes(keyword) || 
                u.email.toLowerCase().includes(keyword)
            );
            setUsers(filtered);
        }
    };

    // Delete logic
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/delete_user/${id}/`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                toast.success(data.message);
                // State update taaki turant UI se hat jaye
                const updatedList = users.filter(u => u.id !== id);
                setUsers(updatedList);
                setAllUsers(updatedList);
            })
            .catch(err => console.error(err));
        }
    };

    return (
        <AdminLayout>
            <ToastContainer position="top-right" autoClose={2000} />
            <h3 className="text-center text-primary mb-4">User List</h3>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <input 
                    type="text" 
                    className="form-control w-50" 
                    placeholder="Search by name or email..." 
                    onChange={(e) => handleSearch(e.target.value)} 
                />
                <h5>Total Users: <span className="badge bg-success">{users.length}</span></h5>
            </div>
            <table className="table table-bordered table-hover table-striped">
                <thead className="table-dark text-center">
                    <tr>
                        <th>S.No</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u, index) => (
                        <tr key={u.id}>
                            <td className="text-center">{index + 1}</td>
                            <td>{u.first_name}</td>
                            <td>{u.last_name}</td>
                            <td>{u.mobile}</td>
                            <td>{u.email}</td>
                            <td className="text-center">
                                <button onClick={() => handleDelete(u.id)} className="btn btn-sm btn-danger">
                                    <i className="fas fa-trash-alt me-1"></i> Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default ManageUser;