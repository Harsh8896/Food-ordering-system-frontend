// OrdersSection.jsx
import { useState } from "react";
import "./superadmin.css";

const STATUS_BADGE = {
  delivered: "sa-badge-green",
  confirmed: "sa-badge-blue",
  pending:   "sa-badge-orange",
  cancelled: "sa-badge-red",
};

export default function OrdersSection({ orders }) {
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return !q || o.id.toLowerCase().includes(q) || o.user.toLowerCase().includes(q) || o.rest.toLowerCase().includes(q);
  });

  return (
    <div className="sa-card">
      <div className="sa-card-header">
        <div>
          <div className="sa-card-title">All Orders</div>
          <div className="sa-card-sub">{orders.length} total orders across platform</div>
        </div>
        <div className="sa-card-actions">
          <div className="sa-search-box">
            <i className="fa-solid fa-magnifying-glass" style={{ color:"var(--muted)", fontSize:13 }} />
            <input placeholder="Search order / user…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display:"flex", gap:10, padding:"12px 22px", borderBottom:"1px solid var(--border)", flexWrap:"wrap" }}>
        {["delivered","confirmed","pending","cancelled"].map((s) => (
          <span key={s} className={`sa-badge ${STATUS_BADGE[s]}`} style={{ fontSize:12, padding:"5px 14px" }}>
            {orders.filter(o=>o.status===s).length} {s.charAt(0).toUpperCase()+s.slice(1)}
          </span>
        ))}
      </div>

      <div style={{ overflowX:"auto" }}>
        <table className="sa-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7}><div className="sa-empty"><i className="fa-solid fa-bag-shopping" /><p>No orders found</p></div></td></tr>
            )}
            {filtered.map((o) => (
              <tr key={o.id}>
                <td><strong style={{ color:"var(--gold)" }}>{o.id}</strong></td>
                <td>{o.user}</td>
                <td>{o.rest}</td>
                <td style={{ color:"var(--muted)" }}>{o.items}</td>
                <td><strong>{o.amt}</strong></td>
                <td>{o.date}</td>
                <td>
                  <span className={`sa-badge ${STATUS_BADGE[o.status] || "sa-badge-grey"}`}>
                    {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
