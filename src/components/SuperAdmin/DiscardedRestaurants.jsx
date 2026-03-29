import { useState, useEffect } from "react";
import "./superadmin.css";

const BASE_URL = "http://127.0.0.1:8000";

export default function DiscardedRestaurants({ showToast }) {
  const [discarded, setDiscarded] = useState([]);
  const [deleteId, setDeleteId]   = useState(null);

  const fetchDiscarded = async () => {
    try {
      const res  = await fetch(`${BASE_URL}/api/restaurants/`);
      const data = await res.json();
      // Sirf discarded restaurants filter karo
      setDiscarded(
        data
          .filter((r) => r.is_discarded)
          .map((r) => ({
            id:          r.id,
            name:        r.name || "N/A",
            owner:       r.owner_email?.split("@")[0] || "Owner",
            email:       r.owner_email,
            location:    r.location,
          }))
      );
    } catch (err) {
      console.error(err);
      showToast?.("Fetch failed ❌", "error");
    }
  };

  useEffect(() => { fetchDiscarded(); }, []);

  const handleRestore = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/restaurants/${id}/discard/`, { method: "PUT" });
      if (res.ok) {
        showToast?.("Restaurant restored ✅", "success");
        fetchDiscarded();
      }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/restaurants/${id}/`, { method: "DELETE" });
      if (res.ok) {
        showToast?.("Permanently deleted 🗑️", "error");
        fetchDiscarded();
      }
    } catch (err) { console.error(err); }
    setDeleteId(null);
  };

  return (
    <>
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">
              <i className="fa-solid fa-box-archive" style={{ color: "var(--orange)", marginRight: 8 }} />
              Discarded Restaurants
            </div>
            <div className="sa-card-sub">
              {discarded.length} archived — restorable or permanently deletable
            </div>
          </div>
        </div>

        {discarded.length === 0 ? (
          <div className="sa-empty">
            <i className="fa-solid fa-box-archive" />
            <p>No discarded restaurants</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Owner</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discarded.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="sa-rest-cell">
                        <div className="sa-rest-avatar" style={{ background: "var(--muted)" }}>
                          {r.name[0]}
                        </div>
                        <div className="sa-rest-name">{r.name}</div>
                      </div>
                    </td>
                    <td>{r.owner}</td>
                    <td>{r.location}</td>
                    <td>
                      <div className="sa-action-group">
                        <button
                          className="sa-icon-btn restore"
                          title="Restore — user UI pe wapas dikhega"
                          onClick={() => handleRestore(r.id)}
                        >
                          <i className="fa-solid fa-rotate-left" />
                        </button>
                        <button
                          className="sa-icon-btn delete"
                          title="Permanently delete"
                          onClick={() => setDeleteId(r.id)}
                        >
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="sa-modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="sa-modal sa-confirm-modal">
            <div className="sa-confirm-icon danger">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="sa-confirm-title">Permanently Delete?</div>
            <div className="sa-confirm-msg">
              Ye restaurant <strong>completely erase</strong> ho jayega. Restore nahi kar sakte. Sure hain?
            </div>
            <div className="sa-confirm-footer">
              <button className="sa-btn sa-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="sa-btn sa-btn-red" onClick={() => handleDelete(deleteId)}>
                <i className="fa-solid fa-trash" /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}