// // UsersTable.jsx
// import { useState } from "react";
// import { ac } from "./superadminData";
// import "./superadmin.css";

// export default function UsersTable({ users, showToast }) {
  
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");

//   const filtered = users.filter((u) => {
//     const matchFilter = filter === "all" || u.status === filter;
//     const q = search.toLowerCase();
//     const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
//     return matchFilter && matchSearch;
//   });

//   return (
//     <div className="sa-card">
//       <div className="sa-card-header">
//         <div>
//           <div className="sa-card-title">All Users</div>
//           <div className="sa-card-sub">{users.length} registered users</div>
//         </div>
//         <div className="sa-card-actions">
//           <div className="sa-search-box">
//             <i className="fa-solid fa-magnifying-glass" style={{ color:"var(--muted)", fontSize:13 }} />
//             <input placeholder="Search user…" value={search} onChange={(e) => setSearch(e.target.value)} />
//           </div>
//           <div className="sa-tab-bar" style={{ marginBottom:0 }}>
//             {["all","active","inactive"].map((s) => (
//               <button key={s} className={`sa-tab sa-btn-sm${filter===s?" active":""}`}
//                 onClick={() => setFilter(s)} style={{ padding:"6px 14px" }}>
//                 {s.charAt(0).toUpperCase()+s.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div style={{ overflowX:"auto" }}>
//         <table className="sa-table">
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Email</th>
//               <th>Phone</th>
//               <th>Orders</th>
//               <th>Joined</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.length === 0 && (
//               <tr><td colSpan={7}><div className="sa-empty"><i className="fa-solid fa-users" /><p>No users found</p></div></td></tr>
//             )}
//             {filtered.map((u, i) => (
//               <tr key={u.id}>
//                 <td>
//                   <div className="sa-user-cell">
//                     <div className="sa-user-avatar" style={{ background: ac(i) }}>{u.name[0]}</div>
//                     <strong>{u.name}</strong>
//                   </div>
//                 </td>
//                 <td>{u.email}</td>
//                 <td>{u.phone}</td>
//                 <td><strong>{u.orders}</strong></td>
//                 <td>{u.joined}</td>
//                 <td>
//                   <span className={`sa-badge ${u.status==="active" ? "sa-badge-green" : "sa-badge-grey"}`}>
//                     {u.status==="active" ? "● Active" : "○ Inactive"}
//                   </span>
//                 </td>
//                 <td>
//                   <div className="sa-action-group">
//                     <button className="sa-icon-btn view" title="View profile" onClick={() => showToast(`Viewing ${u.name}`, "success")}>
//                       <i className="fa-solid fa-eye" />
//                     </button>
//                     <button className="sa-icon-btn ban" title="Suspend user" onClick={() => showToast(`${u.name} suspended`, "warning")}>
//                       <i className="fa-solid fa-ban" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
