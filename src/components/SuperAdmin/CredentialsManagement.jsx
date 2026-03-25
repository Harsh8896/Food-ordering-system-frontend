// CredentialsManagement.jsx
import { useState } from "react";
import "./superadmin.css";

const INIT_CREDS = [
  { id:1, name:"Super Admin",    email:"admin@foodos.com",      role:"super_admin", lastLogin:"25 Mar 2026", status:"active" },
  { id:2, name:"Ops Manager",   email:"ops@foodos.com",        role:"manager",     lastLogin:"24 Mar 2026", status:"active" },
  { id:3, name:"Support Agent", email:"support@foodos.com",    role:"support",     lastLogin:"22 Mar 2026", status:"inactive" },
];

const ROLES = ["super_admin","manager","support","viewer"];

export default function CredentialsManagement({ showToast }) {
  const [creds,    setCreds]    = useState(INIT_CREDS);
  const [showAdd,  setShowAdd]  = useState(false);
  const [newCred,  setNewCred]  = useState({ name:"", email:"", role:"manager", password:"" });
  const [showPwd,  setShowPwd]  = useState(false);

  const set = (k) => (e) => setNewCred((f) => ({ ...f, [k]: e.target.value }));

  const addCred = () => {
    if (!newCred.name || !newCred.email || !newCred.password) { showToast("Please fill all fields.", "warning"); return; }
    setCreds((prev) => [...prev, { id: Date.now(), ...newCred, lastLogin:"Never", status:"active" }]);
    setNewCred({ name:"", email:"", role:"manager", password:"" });
    setShowAdd(false);
    showToast("Admin credential added!", "success");
  };

  const toggleStatus = (id) => {
    setCreds((prev) => prev.map((c) => c.id===id ? {...c, status: c.status==="active"?"inactive":"active"} : c));
    showToast("Status updated.", "warning");
  };

  const deleteCred = (id) => {
    setCreds((prev) => prev.filter((c) => c.id !== id));
    showToast("Credential removed.", "error");
  };

  const roleBadge = (role) => {
    const map = { super_admin:"sa-badge-gold", manager:"sa-badge-blue", support:"sa-badge-green", viewer:"sa-badge-grey" };
    return <span className={`sa-badge ${map[role]||"sa-badge-grey"}`}>{role.replace("_"," ")}</span>;
  };

  return (
    <>
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">
              <i className="fa-solid fa-key" style={{ color:"var(--gold)", marginRight:8 }} />
              Admin Credentials
            </div>
            <div className="sa-card-sub">{creds.length} admin accounts</div>
          </div>
          <button className="sa-btn sa-btn-gold" onClick={() => setShowAdd(true)}>
            <i className="fa-solid fa-plus" /> Add Admin
          </button>
        </div>

        <div style={{ overflowX:"auto" }}>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {creds.map((c, i) => (
                <tr key={c.id}>
                  <td>
                    <div className="sa-user-cell">
                      <div className="sa-user-avatar" style={{ background: c.role==="super_admin"?"var(--gold)":"var(--blue)", color: c.role==="super_admin"?"var(--dark)":"#fff" }}>
                        {c.name[0]}
                      </div>
                      <strong>{c.name}</strong>
                    </div>
                  </td>
                  <td>{c.email}</td>
                  <td>{roleBadge(c.role)}</td>
                  <td>{c.lastLogin}</td>
                  <td>
                    <span className={`sa-badge ${c.status==="active"?"sa-badge-green":"sa-badge-grey"}`}>
                      {c.status==="active"?"● Active":"○ Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className="sa-action-group">
                      <button className="sa-icon-btn edit" title="Edit" onClick={() => showToast("Edit coming soon","warning")}>
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button className={`sa-icon-btn ${c.status==="active"?"discard":"restore"}`} title="Toggle status" onClick={() => toggleStatus(c.id)}>
                        <i className={`fa-solid fa-${c.status==="active"?"pause":"play"}`} />
                      </button>
                      {c.role !== "super_admin" && (
                        <button className="sa-icon-btn delete" title="Remove" onClick={() => deleteCred(c.id)}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* API Key section */}
      <div className="sa-card">
        <div className="sa-card-header">
          <div className="sa-card-title">
            <i className="fa-solid fa-shield-halved" style={{ color:"var(--blue)", marginRight:8 }} />
            API Keys
          </div>
        </div>
        <div style={{ padding:"22px" }}>
          {[
            { label:"Production API Key", key:"fds_prod_sk_••••••••••••••••••••••••••••••••" },
            { label:"Staging API Key",    key:"fds_stage_sk_••••••••••••••••••••••••••••••" },
          ].map((k) => (
            <div key={k.label} style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:6, textTransform:"uppercase" }}>{k.label}</div>
              <div style={{ display:"flex", alignItems:"center", gap:10, background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:"10px 14px" }}>
                <i className="fa-solid fa-key" style={{ color:"var(--gold)" }} />
                <code style={{ fontSize:13, flex:1, color:"var(--text)" }}>{k.key}</code>
                <button className="sa-btn sa-btn-outline sa-btn-sm" onClick={() => showToast("API Key copied!", "success")}>
                  <i className="fa-solid fa-copy" /> Copy
                </button>
                <button className="sa-btn sa-btn-sm" style={{ background:"var(--red)", color:"#fff" }} onClick={() => showToast("Key regenerated!", "warning")}>
                  <i className="fa-solid fa-rotate" /> Regenerate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Admin Modal */}
      {showAdd && (
        <div className="sa-modal-overlay" onClick={(e) => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="sa-modal">
            <div className="sa-modal-title">
              <i className="fa-solid fa-user-plus" style={{ color:"var(--gold)", marginRight:8 }} />
              Add Admin Credential
            </div>
            <div className="sa-modal-sub">Create a new admin login for the FOODOS Super Admin panel.</div>

            <div className="sa-form-row">
              <div className="sa-form-group">
                <label>Full Name *</label>
                <input placeholder="e.g. Ops Manager" value={newCred.name} onChange={set("name")} />
              </div>
              <div className="sa-form-group">
                <label>Role *</label>
                <select value={newCred.role} onChange={set("role")}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="sa-form-group" style={{ marginBottom:16 }}>
              <label>Email Address *</label>
              <input type="email" placeholder="admin@foodos.com" value={newCred.email} onChange={set("email")} />
            </div>

            <div className="sa-form-group" style={{ marginBottom:0, position:"relative" }}>
              <label>Password *</label>
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Min 8 characters"
                value={newCred.password}
                onChange={set("password")}
                style={{ paddingRight:40 }}
              />
              <i
                className={`fa-solid fa-eye${showPwd?"-slash":""}`}
                onClick={() => setShowPwd((p)=>!p)}
                style={{ position:"absolute", right:14, top:36, color:"var(--muted)", cursor:"pointer" }}
              />
            </div>

            <div className="sa-modal-footer">
              <button className="sa-btn sa-btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="sa-btn sa-btn-gold" onClick={addCred}>
                <i className="fa-solid fa-check" /> Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
