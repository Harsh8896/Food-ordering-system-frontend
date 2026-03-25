// RestaurantOnboardingForm.jsx
import { useState } from "react";
import "./superadmin.css";

const INIT = { name: "", owner: "", email: "", phone: "", city: "", cat: "General", desc: "" };

export default function RestaurantOnboardingForm({ onAdd, onClose, showToast }) {
  const [form, setForm] = useState(INIT);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.owner || !form.email) {
      showToast("Please fill required fields.", "warning");
      return;
    }
    onAdd({ ...form, joined: new Date().toLocaleString("en-IN", { month: "short", year: "numeric" }) });
    setForm(INIT);
    if (onClose) onClose();
  };

  const body = (
    <div>
      <div className="sa-modal-title">
        <i className="fa-solid fa-circle-plus" style={{ color: "var(--gold)", marginRight: 8 }} />
        Onboard New Restaurant
      </div>
      <div className="sa-modal-sub">Fill in the details to register a restaurant on the platform.</div>

      <div className="sa-form-row">
        <div className="sa-form-group">
          <label>Restaurant Name *</label>
          <input placeholder="e.g. Spice Villa" value={form.name} onChange={set("name")} />
        </div>
        <div className="sa-form-group">
          <label>Owner Name *</label>
          <input placeholder="e.g. Raj Kumar" value={form.owner} onChange={set("owner")} />
        </div>
      </div>

      <div className="sa-form-row">
        <div className="sa-form-group">
          <label>Owner Email *</label>
          <input type="email" placeholder="owner@restaurant.com" value={form.email} onChange={set("email")} />
        </div>
        <div className="sa-form-group">
          <label>Phone Number</label>
          <input placeholder="98XXXXXXXX" value={form.phone} onChange={set("phone")} />
        </div>
      </div>

      <div className="sa-form-row">
        <div className="sa-form-group">
          <label>City</label>
          <input placeholder="e.g. Prayagraj" value={form.city} onChange={set("city")} />
        </div>
        <div className="sa-form-group">
          <label>Category</label>
          <select value={form.cat} onChange={set("cat")}>
            {["General", "Fast Food", "South Indian", "North Indian", "Italian", "Beverages", "Chinese", "Multi"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="sa-form-group" style={{ marginBottom: 0 }}>
        <label>Description</label>
        <textarea placeholder="Brief description of the restaurant…" value={form.desc} onChange={set("desc")} />
      </div>

      <div className="sa-modal-footer">
        {onClose && (
          <button className="sa-btn sa-btn-outline" onClick={onClose}>Cancel</button>
        )}
        <button className="sa-btn sa-btn-gold" onClick={handleSubmit}>
          <i className="fa-solid fa-check" /> Add Restaurant
        </button>
      </div>
    </div>
  );

  // Render as modal overlay when onClose provided, else as inline card
  if (onClose) {
    return (
      <div className="sa-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="sa-modal">{body}</div>
      </div>
    );
  }

  return (
    <div className="sa-card">
      <div className="sa-card-header">
        <div>
          <div className="sa-card-title">Onboard New Restaurant</div>
          <div className="sa-card-sub">Register a new restaurant on the FOODOS platform</div>
        </div>
      </div>
      <div style={{ padding: "24px 22px" }}>{body}</div>
    </div>
  );
}
