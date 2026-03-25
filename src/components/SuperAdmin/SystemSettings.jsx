// SystemSettings.jsx
import { useState } from "react";
import "./superadmin.css";

export default function SystemSettings({ showToast }) {
  const [general, setGeneral]   = useState({ platformName:"FOODOS", supportEmail:"support@foodos.com", currency:"INR", timezone:"Asia/Kolkata" });
  const [notifs,  setNotifs]    = useState({ newOrder:true, newRestaurant:true, newUser:false, lowRating:true });
  const [maint,   setMaint]     = useState(false);

  const save = (label) => showToast(`${label} saved successfully!`, "success");

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width:44, height:24, borderRadius:12, cursor:"pointer", transition:".2s",
        background: checked ? "var(--green)" : "var(--border)",
        position:"relative", flexShrink:0,
      }}
    >
      <div style={{
        width:18, height:18, borderRadius:"50%", background:"#fff",
        position:"absolute", top:3, transition:".2s",
        left: checked ? 23 : 3,
        boxShadow:"0 1px 4px rgba(0,0,0,.2)",
      }} />
    </div>
  );

  const Input = ({ label, value, onChange, type="text" }) => (
    <div className="sa-form-group" style={{ marginBottom:16 }}>
      <label>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );

  return (
    <>
      {/* General Settings */}
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">
              <i className="fa-solid fa-sliders" style={{ color:"var(--gold)", marginRight:8 }} />
              General Settings
            </div>
            <div className="sa-card-sub">Platform-wide configuration</div>
          </div>
        </div>
        <div style={{ padding:"24px 22px" }}>
          <div className="sa-form-row">
            <Input label="Platform Name" value={general.platformName} onChange={(v) => setGeneral(g=>({...g,platformName:v}))} />
            <Input label="Support Email" value={general.supportEmail} onChange={(v) => setGeneral(g=>({...g,supportEmail:v}))} type="email" />
          </div>
          <div className="sa-form-row">
            <div className="sa-form-group" style={{ marginBottom:16 }}>
              <label>Currency</label>
              <select value={general.currency} onChange={(e) => setGeneral(g=>({...g,currency:e.target.value}))}>
                {["INR","USD","EUR","GBP"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sa-form-group" style={{ marginBottom:16 }}>
              <label>Timezone</label>
              <select value={general.timezone} onChange={(e) => setGeneral(g=>({...g,timezone:e.target.value}))}>
                {["Asia/Kolkata","Asia/Dubai","UTC","America/New_York","Europe/London"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <button className="sa-btn sa-btn-gold" onClick={() => save("General settings")}>
            <i className="fa-solid fa-floppy-disk" /> Save Changes
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">
              <i className="fa-solid fa-bell" style={{ color:"var(--blue)", marginRight:8 }} />
              Notification Preferences
            </div>
            <div className="sa-card-sub">Control what alerts the super admin receives</div>
          </div>
        </div>
        <div style={{ padding:"8px 22px 24px" }}>
          {[
            { key:"newOrder",      label:"New Order Placed",       sub:"Notify when any order is placed" },
            { key:"newRestaurant", label:"New Restaurant Request",  sub:"Notify when a restaurant requests onboarding" },
            { key:"newUser",       label:"New User Signup",         sub:"Notify when a new user registers" },
            { key:"lowRating",     label:"Low Rating Alert",        sub:"Notify when a restaurant gets below 3★" },
          ].map((n) => (
            <div key={n.key} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14 }}>{n.label}</div>
                <div style={{ fontSize:12, color:"var(--muted)", marginTop:2 }}>{n.sub}</div>
              </div>
              <Toggle checked={notifs[n.key]} onChange={(v) => setNotifs(p=>({...p,[n.key]:v}))} />
            </div>
          ))}
          <div style={{ marginTop:20 }}>
            <button className="sa-btn sa-btn-gold" onClick={() => save("Notification settings")}>
              <i className="fa-solid fa-floppy-disk" /> Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">
              <i className="fa-solid fa-screwdriver-wrench" style={{ color:"var(--red)", marginRight:8 }} />
              Maintenance Mode
            </div>
            <div className="sa-card-sub">Take the platform offline for maintenance</div>
          </div>
          <Toggle checked={maint} onChange={(v) => { setMaint(v); showToast(`Maintenance mode ${v?"enabled":"disabled"}`, v?"warning":"success"); }} />
        </div>
        {maint && (
          <div style={{ padding:"14px 22px", background:"rgba(255,77,79,.05)", borderTop:"1px solid rgba(255,77,79,.15)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, color:"var(--red)", fontSize:13, fontWeight:600 }}>
              <i className="fa-solid fa-triangle-exclamation" />
              Platform is currently in maintenance mode. Users will see a maintenance page.
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="sa-card" style={{ border:"1px solid rgba(255,77,79,.3)" }}>
        <div className="sa-card-header" style={{ background:"rgba(255,77,79,.04)" }}>
          <div>
            <div className="sa-card-title" style={{ color:"var(--red)" }}>
              <i className="fa-solid fa-skull-crossbones" style={{ marginRight:8 }} />
              Danger Zone
            </div>
            <div className="sa-card-sub">Irreversible actions — proceed with extreme caution</div>
          </div>
        </div>
        <div style={{ padding:"22px", display:"flex", gap:12, flexWrap:"wrap" }}>
          <button className="sa-btn sa-btn-red" onClick={() => showToast("Clear cache action triggered","warning")}>
            <i className="fa-solid fa-broom" /> Clear Platform Cache
          </button>
          <button className="sa-btn" style={{ background:"var(--orange)", color:"#fff" }} onClick={() => showToast("Export initiated","success")}>
            <i className="fa-solid fa-file-export" /> Export All Data
          </button>
          <button className="sa-btn sa-btn-red" onClick={() => showToast("This action requires 2FA confirmation","error")}>
            <i className="fa-solid fa-trash-can" /> Purge All Orders
          </button>
        </div>
      </div>
    </>
  );
}
