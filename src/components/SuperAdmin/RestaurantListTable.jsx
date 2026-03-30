import { useState, useEffect } from "react";
import RestaurantOnboardingForm from "./RestaurantOnboardingForm";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  .rlt-wrap * { box-sizing: border-box; font-family: 'Inter', sans-serif; }

  .rlt-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
    overflow: hidden;
  }

  .rlt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 24px 18px;
    border-bottom: 1px solid #f5f5f5;
    flex-wrap: wrap;
    gap: 14px;
  }
  .rlt-title {
    font-size: 17px;
    font-weight: 700;
    color: #111;
    letter-spacing: -0.3px;
  }
  .rlt-subtitle {
    margin-top: 3px;
    font-size: 13px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .rlt-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .rlt-dot-green  { background: #22c55e; }
  .rlt-dot-grey   { background: #d1d5db; }
  .rlt-dot-orange { background: #f97316; }

  .rlt-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .rlt-tabs {
    display: flex;
    gap: 4px;
    background: #f5f5f7;
    border-radius: 10px;
    padding: 3px;
  }
  .rlt-tab {
    border: none;
    background: transparent;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12.5px;
    color: #777;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.15s ease;
    white-space: nowrap;
  }
  .rlt-tab.active {
    background: #fff;
    color: #111;
    box-shadow: 0 1px 5px rgba(0,0,0,0.1);
    font-weight: 600;
  }

  .rlt-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f7f7f8;
    border: 1.5px solid #ebebeb;
    border-radius: 10px;
    padding: 7px 12px;
    transition: border-color 0.15s;
  }
  .rlt-search:focus-within {
    border-color: #d4a843;
    background: #fff;
  }
  .rlt-search input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 13px;
    color: #111;
    width: 180px;
  }
  .rlt-search input::placeholder { color: #bbb; }

  .rlt-add-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #d4a843 0%, #c49535 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(212,168,67,0.35);
    transition: all 0.18s ease;
    white-space: nowrap;
  }
  .rlt-add-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(212,168,67,0.45);
  }

  .rlt-table-wrap { overflow-x: auto; }
  .rlt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .rlt-table thead tr {
    background: #fafafa;
    border-bottom: 1.5px solid #f0f0f0;
  }
  .rlt-table th {
    padding: 11px 16px;
    text-align: left;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #aaa;
    white-space: nowrap;
  }
  .rlt-table tbody tr {
    border-bottom: 1px solid #f7f7f7;
    transition: background 0.12s;
  }
  .rlt-table tbody tr:last-child { border-bottom: none; }
  .rlt-table tbody tr:hover { background: #fdfaf3; }
  .rlt-table tbody tr.rlt-discarded-row { background: #fafafa; opacity: 0.7; }
  .rlt-table tbody tr.rlt-discarded-row:hover { background: #f5f5f5; }
  .rlt-table td {
    padding: 13px 16px;
    color: #333;
    vertical-align: middle;
  }

  .rlt-rest-cell { display: flex; align-items: center; gap: 12px; }
  .rlt-avatar {
    width: 40px; height: 40px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .rlt-avatar.discarded { filter: grayscale(1); opacity: 0.6; }
  .rlt-rest-name { font-weight: 600; color: #111; font-size: 14px; }
  .rlt-rest-sub  { font-size: 12px; color: #bbb; margin-top: 2px; }

  .rlt-email-cell { color: #666; font-size: 13px; }

  .rlt-city {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f5f5f7; border-radius: 20px;
    padding: 4px 10px; font-size: 12.5px; color: #555; font-weight: 500;
  }

  .rlt-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 20px;
    font-size: 12px; font-weight: 600;
  }
  .rlt-badge-active    { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .rlt-badge-inactive  { background: #fafafa; color: #999;    border: 1px solid #e5e7eb; }
  .rlt-badge-discarded { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
  .rlt-badge-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

  .rlt-actions { display: flex; align-items: center; gap: 6px; justify-content: center; }
  .rlt-btn {
    width: 32px; height: 32px; border-radius: 8px;
    border: 1.5px solid transparent;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 13px;
    transition: all 0.15s ease;
  }
  .rlt-btn:hover { transform: scale(1.1); }
  .rlt-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
  .rlt-btn-edit     { background: #eff6ff; color: #3b82f6; border-color: #dbeafe; }
  .rlt-btn-edit:hover { background: #dbeafe; color: #2563eb; }
  .rlt-btn-suspend  { background: #fffbeb; color: #f59e0b; border-color: #fde68a; }
  .rlt-btn-suspend:hover { background: #fef3c7; color: #d97706; }
  .rlt-btn-activate { background: #f0fdf4; color: #22c55e; border-color: #bbf7d0; }
  .rlt-btn-activate:hover { background: #dcfce7; color: #16a34a; }
  .rlt-btn-discard  { background: #fff7ed; color: #f97316; border-color: #fed7aa; }
  .rlt-btn-discard:hover { background: #ffedd5; color: #ea580c; }
  .rlt-btn-restore  { background: #f0fdf4; color: #16a34a; border-color: #bbf7d0; }
  .rlt-btn-restore:hover { background: #dcfce7; color: #15803d; }
  .rlt-btn-delete   { background: #fff5f5; color: #ef4444; border-color: #fecaca; }
  .rlt-btn-delete:hover { background: #fee2e2; color: #dc2626; }

  .rlt-tip { position: relative; }
  .rlt-tip-label {
    position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%);
    background: #1f2937; color: #fff; font-size: 11px; font-weight: 500;
    padding: 4px 8px; border-radius: 6px; white-space: nowrap;
    opacity: 0; pointer-events: none; transition: opacity 0.15s; z-index: 10;
  }
  .rlt-tip:hover .rlt-tip-label { opacity: 1; }

  .rlt-empty { text-align: center; padding: 48px 20px; }
  .rlt-empty-icon { font-size: 36px; margin-bottom: 12px; }
  .rlt-empty-text { font-size: 14px; color: #ccc; }

  .rlt-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
  }
  .rlt-modal {
    background: #fff; border-radius: 18px;
    width: 440px; max-width: 95vw;
    box-shadow: 0 24px 64px rgba(0,0,0,0.16);
    overflow: hidden;
    animation: rlt-pop 0.2s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes rlt-pop {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .rlt-modal-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 22px 16px; border-bottom: 1px solid #f3f3f3;
  }
  .rlt-modal-head h3 { margin: 0; font-size: 16px; font-weight: 700; color: #111; letter-spacing: -0.3px; }
  .rlt-modal-close {
    background: #f5f5f7; border: none; color: #888;
    width: 30px; height: 30px; border-radius: 8px;
    cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .rlt-modal-close:hover { background: #ebebeb; color: #333; }
  .rlt-modal-body { padding: 22px; display: flex; flex-direction: column; gap: 16px; }
  .rlt-field { display: flex; flex-direction: column; gap: 6px; }
  .rlt-field-label {
    font-size: 11.5px; font-weight: 700; color: #999;
    text-transform: uppercase; letter-spacing: 0.07em;
  }
  .rlt-field-input {
    padding: 10px 13px; border: 1.5px solid #ebebeb; border-radius: 10px;
    font-size: 14px; color: #111; outline: none;
    transition: all 0.15s; width: 100%; background: #fafafa;
  }
  .rlt-field-input:focus { border-color: #d4a843; background: #fff; box-shadow: 0 0 0 3px rgba(212,168,67,0.12); }
  .rlt-modal-foot {
    display: flex; gap: 10px; justify-content: flex-end;
    padding: 16px 22px; border-top: 1px solid #f3f3f3; background: #fafafa;
  }
  .rlt-cancel-btn {
    background: #fff; border: 1.5px solid #e5e7eb; color: #555;
    border-radius: 10px; padding: 9px 18px; font-size: 13.5px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .rlt-cancel-btn:hover { background: #f5f5f7; }
  .rlt-save-btn {
    background: linear-gradient(135deg, #d4a843, #c49535);
    color: #fff; border: none; border-radius: 10px;
    padding: 9px 20px; font-size: 13.5px; font-weight: 600;
    cursor: pointer; box-shadow: 0 2px 8px rgba(212,168,67,0.3); transition: all 0.15s;
  }
  .rlt-save-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(212,168,67,0.4); }

  /* Discard confirm modal */
  .rlt-confirm-icon {
    width: 52px; height: 52px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin: 0 auto 14px;
  }
  .rlt-confirm-icon.warn { background: #fff7ed; color: #f97316; }
  .rlt-confirm-title { text-align: center; font-size: 16px; font-weight: 700; color: #111; margin-bottom: 8px; }
  .rlt-confirm-msg   { text-align: center; font-size: 13.5px; color: #666; line-height: 1.6; }
  .rlt-confirm-body  { padding: 28px 24px 8px; }
  .rlt-confirm-foot  {
    display: flex; gap: 10px; justify-content: center;
    padding: 20px 24px 24px;
  }
  .rlt-btn-outline-grey {
    background: #fff; border: 1.5px solid #e5e7eb; color: #555;
    border-radius: 10px; padding: 9px 20px; font-size: 13.5px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
  }
  .rlt-btn-outline-grey:hover { background: #f5f5f7; }
  .rlt-btn-orange {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: #fff; border: none; border-radius: 10px;
    padding: 9px 20px; font-size: 13.5px; font-weight: 600;
    cursor: pointer; box-shadow: 0 2px 8px rgba(249,115,22,0.3); transition: all 0.15s;
  }
  .rlt-btn-orange:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(249,115,22,0.4); }
`;

const AVATAR_COLORS = ["#f97316","#8b5cf6","#3b82f6","#10b981","#ec4899","#14b8a6","#f43f5e","#6366f1"];

export default function RestaurantListTable({ showToast }) {
  const [restaurants, setRestaurants]   = useState([]);
  const [search, setSearch]             = useState("");
  const [filterTab, setFilterTab]       = useState("all");
  const [showAdd, setShowAdd]           = useState(false);
  const [editData, setEditData]         = useState(null);
  const [togglingId, setTogglingId]     = useState(null);
  const [discardTarget, setDiscardTarget] = useState(null); // restaurant to discard

  // ── Fetch ──
  const fetchRestaurants = async () => {
    try {
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/`);
      const data = await res.json();
      setRestaurants(
        data.map((r) => ({
          id:           r.id,
          name:         r.name || "N/A",
          owner:        r.owner_email?.split("@")[0] || "Owner",
          city:         r.location || "India",
          status:       r.status === "suspended" ? "inactive" : "active",
          email:        r.owner_email,
          is_discarded: r.is_discarded ?? false,
        }))
      );
    } catch (err) {
      console.error(err);
      showToast?.("Fetch failed ❌", "error");
    }
  };

  useEffect(() => { fetchRestaurants(); }, []);

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant permanently?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${id}/`, { method: "DELETE" });
      res.ok
        ? (showToast?.("Deleted ✅", "success"), fetchRestaurants())
        : showToast?.("Delete failed ❌", "error");
    } catch (err) { console.error(err); }
  };

  // ── Suspend / Activate ──
  const handleToggleStatus = async (r) => {
    const newStatus = r.status === "active" ? "suspended" : "active";
    setTogglingId(r.id);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${r.id}/`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast?.(
          newStatus === "suspended" ? "Suspended 🔴" : "Activated 🟢",
          newStatus === "suspended" ? "error" : "success"
        );
        fetchRestaurants();
      } else showToast?.("Status update failed ❌", "error");
    } catch (err) { console.error(err); }
    finally { setTogglingId(null); }
  };

  // ── Discard / Restore ──
  const handleDiscard = async (r) => {
    // If already discarded → restore directly (no confirmation needed)
    if (r.is_discarded) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${r.id}/discard/`, { method: "PUT" });
        if (res.ok) {
          showToast?.("Restaurant restored ✅ — now visible on user UI", "success");
          fetchRestaurants();
        } else showToast?.("Restore failed ❌", "error");
      } catch (err) { console.error(err); }
      return;
    }
    // If active → show confirmation modal first
    setDiscardTarget(r);
  };

  const confirmDiscard = async () => {
    if (!discardTarget) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${discardTarget.id}/discard/`, { method: "PUT" });
      if (res.ok) {
        showToast?.(`"${discardTarget.name}" discarded 🗃️ — hidden from user UI`, "error");
        fetchRestaurants();
      } else showToast?.("Discard failed ❌", "error");
    } catch (err) { console.error(err); }
    setDiscardTarget(null);
  };

  // ── Edit / Update ──
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants/${editData.id}/`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name: editData.name, owner_email: editData.email, location: editData.city }),
      });
      if (res.ok) {
        showToast?.("Updated ✅", "success");
        setEditData(null);
        fetchRestaurants();
      } else showToast?.("Update failed ❌", "error");
    } catch (err) { console.error(err); }
  };

  // ── Filter ──
  const filtered = restaurants.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [r.name, r.owner, r.city, r.email].some((v) => v?.toLowerCase().includes(q));

    if (filterTab === "all")       return matchSearch;
    if (filterTab === "active")    return matchSearch && r.status === "active"   && !r.is_discarded;
    if (filterTab === "inactive")  return matchSearch && r.status === "inactive" && !r.is_discarded;
    if (filterTab === "discarded") return matchSearch && r.is_discarded;
    return matchSearch;
  });

  const activeCount    = restaurants.filter((r) => r.status === "active"   && !r.is_discarded).length;
  const inactiveCount  = restaurants.filter((r) => r.status === "inactive" && !r.is_discarded).length;
  const discardedCount = restaurants.filter((r) => r.is_discarded).length;

  return (
    <>
      <style>{styles}</style>

      <div className="rlt-wrap">
        <div className="rlt-card">

          {/* ── Header ── */}
          <div className="rlt-header">
            <div>
              <div className="rlt-title">All Restaurants</div>
              <div className="rlt-subtitle">
                <span className="rlt-dot rlt-dot-green" />
                <span style={{ color: "#22c55e", fontWeight: 600 }}>{activeCount} active</span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span className="rlt-dot rlt-dot-grey" />
                <span style={{ color: "#aaa" }}>{inactiveCount} inactive</span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span className="rlt-dot rlt-dot-orange" />
                <span style={{ color: "#f97316" }}>{discardedCount} discarded</span>
                <span style={{ color: "#e5e7eb" }}>·</span>
                <span style={{ color: "#bbb" }}>{restaurants.length} total</span>
              </div>
            </div>

            <div className="rlt-controls">
              {/* Filter tabs */}
              <div className="rlt-tabs">
                {["all", "active", "inactive", "discarded"].map((tab) => (
                  <button
                    key={tab}
                    className={`rlt-tab ${filterTab === tab ? "active" : ""}`}
                    onClick={() => setFilterTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="rlt-search">
                <input
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Add */}
              <button className="rlt-add-btn" onClick={() => setShowAdd(true)}>
                <i className="fas fa-plus" style={{ fontSize: 11 }} />
                Add Restaurant
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="rlt-table-wrap">
            <table className="rlt-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Owner</th>
                  <th>Email</th>
                  <th>City</th>
                  <th>Status</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className="rlt-empty">
                        <div className="rlt-empty-icon">🍽️</div>
                        <div className="rlt-empty-text">No restaurants found</div>
                      </div>
                    </td>
                  </tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} className={r.is_discarded ? "rlt-discarded-row" : ""}>

                    {/* Restaurant */}
                    <td>
                      <div className="rlt-rest-cell">
                        <div
                          className={`rlt-avatar ${r.is_discarded ? "discarded" : ""}`}
                          style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                        >
                          {r.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="rlt-rest-name" style={r.is_discarded ? { color: "#aaa", textDecoration: "line-through" } : {}}>
                            {r.name}
                          </div>
                          <div className="rlt-rest-sub">ID #{r.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Owner */}
                    <td>{r.owner}</td>

                    {/* Email */}
                    <td>
                      <div className="rlt-email-cell">{r.email || "—"}</div>
                    </td>

                    {/* City */}
                    <td>
                      <span className="rlt-city">{r.city}</span>
                    </td>

                    {/* Status */}
                    <td>
                      {r.is_discarded ? (
                        <span className="rlt-badge rlt-badge-discarded">
                          <span className="rlt-badge-dot" style={{ background: "#f97316" }} /> Discarded
                        </span>
                      ) : r.status === "active" ? (
                        <span className="rlt-badge rlt-badge-active">
                          <span className="rlt-badge-dot" style={{ background: "#22c55e" }} /> Active
                        </span>
                      ) : (
                        <span className="rlt-badge rlt-badge-inactive">
                          <span className="rlt-badge-dot" style={{ background: "#d1d5db" }} /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="rlt-actions">

                        {/* Edit — disabled when discarded */}
                        <div className="rlt-tip">
                          <button
                            className="rlt-btn rlt-btn-edit"
                            onClick={() => setEditData(r)}
                            disabled={r.is_discarded}
                          >✏️</button>
                          <span className="rlt-tip-label">Edit</span>
                        </div>

                        {/* Suspend / Activate — disabled when discarded */}
                        <div className="rlt-tip">
                          <button
                            className={`rlt-btn ${r.status === "active" ? "rlt-btn-suspend" : "rlt-btn-activate"}`}
                            onClick={() => handleToggleStatus(r)}
                            disabled={togglingId === r.id || r.is_discarded}
                          >
                            {togglingId === r.id
                              ? <i className="fa-solid fa-spinner fa-spin" />
                              : r.status === "active" ? "🛑" : "✅"}
                          </button>
                          <span className="rlt-tip-label">{r.status === "active" ? "Suspend" : "Activate"}</span>
                        </div>

                        {/* Discard / Restore */}
                        <div className="rlt-tip">
                          <button
                            className={`rlt-btn ${r.is_discarded ? "rlt-btn-restore" : "rlt-btn-discard"}`}
                            onClick={() => handleDiscard(r)}
                          >
                            {r.is_discarded ? "♻️" : "🗃️"}
                          </button>
                          <span className="rlt-tip-label">{r.is_discarded ? "Restore" : "Discard"}</span>
                        </div>

                        {/* Delete */}
                        <div className="rlt-tip">
                          <button className="rlt-btn rlt-btn-delete" onClick={() => handleDelete(r.id)}>
                            🗑️
                          </button>
                          <span className="rlt-tip-label">Delete</span>
                        </div>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Add Form ── */}
      {showAdd && (
        <RestaurantOnboardingForm
          onClose={() => { setShowAdd(false); fetchRestaurants(); }}
          showToast={showToast}
        />
      )}

      {/* ── Edit Modal ── */}
      {editData && (
        <div className="rlt-overlay">
          <div className="rlt-modal">
            <div className="rlt-modal-head">
              <h3>✏️ Edit Restaurant</h3>
              <button className="rlt-modal-close" onClick={() => setEditData(null)}>
                <i className="fa-solid fa-xmark" />
              </button>
            </div>
            <div className="rlt-modal-body">
              <div className="rlt-field">
                <label className="rlt-field-label">Restaurant Name</label>
                <input
                  className="rlt-field-input"
                  placeholder="e.g. Pizza Palace"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                />
              </div>
              <div className="rlt-field">
                <label className="rlt-field-label">Owner Email</label>
                <input
                  className="rlt-field-input"
                  placeholder="owner@email.com"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                />
              </div>
              <div className="rlt-field">
                <label className="rlt-field-label">City / Location</label>
                <input
                  className="rlt-field-input"
                  placeholder="e.g. Mumbai"
                  value={editData.city}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                />
              </div>
            </div>
            <div className="rlt-modal-foot">
              <button className="rlt-cancel-btn" onClick={() => setEditData(null)}>Cancel</button>
              <button className="rlt-save-btn" onClick={handleUpdate}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Discard Confirmation Modal ── */}
      {discardTarget && (
        <div className="rlt-overlay" onClick={(e) => e.target === e.currentTarget && setDiscardTarget(null)}>
          <div className="rlt-modal">
            <div className="rlt-confirm-body">
              <div className="rlt-confirm-icon warn">🗃️</div>
              <div className="rlt-confirm-title">Discard Restaurant?</div>
              <div className="rlt-confirm-msg">
                <strong>"{discardTarget.name}"</strong> user UI se hide ho jayega.<br />
                Iske saare products / menu items users ko nahi dikhenge.<br /><br />
                Aap baad mein ise restore kar sakte hain.
              </div>
            </div>
            <div className="rlt-confirm-foot">
              <button className="rlt-btn-outline-grey" onClick={() => setDiscardTarget(null)}>Cancel</button>
              <button className="rlt-btn-orange" onClick={confirmDiscard}>
                🗃️ Yes, Discard
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}