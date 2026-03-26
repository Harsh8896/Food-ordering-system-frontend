// RestaurantListTable.jsx
import { useState } from "react";
import { ac } from "./superadminData";
import RestaurantOnboardingForm from "./RestaurantOnboardingForm";
import "./superadmin.css";

function Stars({ n }) {
  return (
    <span className="sa-stars">
      {[1,2,3,4,5].map((i) => (
        <i key={i} className={`fa-${i <= Math.round(n) ? "solid" : "regular"} fa-star`} style={{ fontSize: 12 }} />
      ))}
    </span>
  );
}

export default function RestaurantListTable({ restaurants, onDiscard, onDelete, onAdd, showToast }) {
  const [search,      setSearch]      = useState("");
  const [filterTab,   setFilterTab]   = useState("all");
  const [showAdd,     setShowAdd]     = useState(false);
  const [discardId,   setDiscardId]   = useState(null);
  const [deleteId,    setDeleteId]    = useState(null);

  const filtered = restaurants.filter((r) => {
    const matchTab = filterTab === "all" || r.status === filterTab;
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.owner.toLowerCase().includes(q) || r.city.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const statusBadge = (s) => {
    if (s === "active")  return <span className="sa-badge sa-badge-green">● Active</span>;
    if (s === "pending") return <span className="sa-badge sa-badge-orange">⏳ Pending</span>;
    return                      <span className="sa-badge sa-badge-grey">○ Inactive</span>;
  };

  return (
    <>
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">All Restaurants</div>
            <div className="sa-card-sub">{restaurants.length} restaurants on platform</div>
          </div>
          <div className="sa-card-actions">
            <div className="sa-search-box">
              <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--muted)", fontSize: 13 }} />
              <input
                placeholder="Search restaurant…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="sa-btn sa-btn-gold" onClick={() => setShowAdd(true)}>
              <i className="fa-solid fa-plus" /> Add Restaurant
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding: "14px 22px 0" }}>
          <div className="sa-tab-bar">
            {[
              { id: "all",     label: `All (${restaurants.length})` },
              { id: "active",  label: `Active (${restaurants.filter(r=>r.status==="active").length})` },
              { id: "pending", label: `Pending (${restaurants.filter(r=>r.status==="pending").length})` },
              { id: "inactive",label: `Inactive (${restaurants.filter(r=>r.status==="inactive").length})` },
            ].map((t) => (
              <button
                key={t.id}
                className={`sa-tab${filterTab === t.id ? " active" : ""}`}
                onClick={() => setFilterTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Owner</th>
                <th>phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>
                    <div className="sa-empty">
                      <i className="fa-solid fa-store" />
                      <p>No restaurants found</p>
                    </div>
                  </td>
                </tr>
              )}
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <div className="sa-rest-cell">
                      <div className="sa-rest-avatar" style={{ background: ac(i) }}>
                        {r.name[0]}
                      </div>
                      <div>
                        <div className="sa-rest-name">{r.name}</div>
                        <div className="sa-rest-cat">{r.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{r.owner}</td>
                  <td>{r.phone}</td>
                  <td>{r.city}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div className="sa-action-group">
                      <button className="sa-icon-btn edit" title="Edit" onClick={() => showToast("Edit feature coming soon", "warning")}>
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button className="sa-icon-btn discard" title="Discard (Soft Remove)" onClick={() => setDiscardId(r.id)}>
                        <i className="fa-solid fa-box-archive" />
                      </button>
                      <button className="sa-icon-btn delete" title="Delete Permanently" onClick={() => setDeleteId(r.id)}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info banner */}
      <div className="sa-info-banner">
        <i className="fa-solid fa-circle-info" style={{ color: "var(--gold)" }} />
        <span>
          <strong>Discard</strong> = soft-remove (hides from user app, restorable). &nbsp;
          <strong>Delete</strong> = permanently removed and cannot be recovered.
        </span>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <RestaurantOnboardingForm
          onAdd={onAdd}
          onClose={() => setShowAdd(false)}
          showToast={showToast}
        />
      )}

      {/* Discard Confirm */}
      {discardId && (
        <div className="sa-modal-overlay" onClick={(e) => e.target === e.currentTarget && setDiscardId(null)}>
          <div className="sa-modal sa-confirm-modal">
            <div className="sa-confirm-icon warning">
              <i className="fa-solid fa-box-archive" />
            </div>
            <div className="sa-confirm-title">Discard Restaurant?</div>
            <div className="sa-confirm-msg">
              This restaurant will be <strong>hidden from the user app</strong> and moved to Discarded. You can restore it later from the Discarded section.
            </div>
            <div className="sa-confirm-footer">
              <button className="sa-btn sa-btn-outline" onClick={() => setDiscardId(null)}>Cancel</button>
              <button className="sa-btn" style={{ background:"var(--orange)", color:"#fff" }}
                onClick={() => { onDiscard(discardId); setDiscardId(null); }}>
                <i className="fa-solid fa-box-archive" /> Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="sa-modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="sa-modal sa-confirm-modal">
            <div className="sa-confirm-icon danger">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="sa-confirm-title">Permanently Delete?</div>
            <div className="sa-confirm-msg">
              This will <strong>permanently remove</strong> the restaurant and all its data from the system. This action <strong>cannot be undone</strong>.
            </div>
            <div className="sa-confirm-footer">
              <button className="sa-btn sa-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="sa-btn sa-btn-red"
                onClick={() => { onDelete(deleteId); setDeleteId(null); }}>
                <i className="fa-solid fa-trash" /> Yes, Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
