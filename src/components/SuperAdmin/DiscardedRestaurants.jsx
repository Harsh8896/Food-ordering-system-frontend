// DiscardedRestaurants.jsx
import { useState } from "react";
import "./superadmin.css";

export default function DiscardedRestaurants({ discarded, onRestore, onDelete }) {
  const [deleteId, setDeleteId] = useState(null);

  return (
    <>
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">
              <i className="fa-solid fa-box-archive" style={{ color:"var(--orange)", marginRight:8 }} />
              Discarded Restaurants
            </div>
            <div className="sa-card-sub">{discarded.length} archived — restorable or permanently deletable</div>
          </div>
        </div>

        {discarded.length === 0 ? (
          <div className="sa-empty">
            <i className="fa-solid fa-box-archive" />
            <p>No discarded restaurants</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Restaurant</th>
                  <th>Owner</th>
                  <th>Discarded On</th>
                  <th>Reason</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discarded.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="sa-rest-cell">
                        <div className="sa-rest-avatar" style={{ background:"var(--muted)" }}>{r.name[0]}</div>
                        <div className="sa-rest-name">{r.name}</div>
                      </div>
                    </td>
                    <td>{r.owner}</td>
                    <td>{r.discardedOn}</td>
                    <td><span className="sa-badge sa-badge-orange">{r.reason}</span></td>
                    <td>
                      <div className="sa-action-group">
                        <button className="sa-icon-btn restore" title="Restore" onClick={() => onRestore(r.id)}>
                          <i className="fa-solid fa-rotate-left" />
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
        )}
      </div>

      {/* Permanent Delete Confirm */}
      {deleteId && (
        <div className="sa-modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}>
          <div className="sa-modal sa-confirm-modal">
            <div className="sa-confirm-icon danger">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>
            <div className="sa-confirm-title">Permanently Delete?</div>
            <div className="sa-confirm-msg">
              This restaurant will be <strong>completely erased</strong> from the system. You will not be able to restore it. Are you sure?
            </div>
            <div className="sa-confirm-footer">
              <button className="sa-btn sa-btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="sa-btn sa-btn-red" onClick={() => { onDelete(deleteId); setDeleteId(null); }}>
                <i className="fa-solid fa-trash" /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
