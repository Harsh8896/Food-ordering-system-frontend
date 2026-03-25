// SuperAdminSidebar.jsx
import "./superadmin.css";

const NAV = [
  {
    section: "Overview",
    items: [
      { id: "dashboard", icon: "fa-gauge-high",    label: "Dashboard" },
    ],
  },
  {
    section: "Management",
    items: [
      { id: "restaurants", icon: "fa-store",       label: "Restaurants" },
      { id: "users",       icon: "fa-users",       label: "All Users" },
      { id: "orders",      icon: "fa-bag-shopping", label: "All Orders",    badge: "12" },
    ],
  },
  {
    section: "Insights",
    items: [
      { id: "feedbacks", icon: "fa-star",          label: "User Feedbacks", badge: "5" },
      { id: "sales",     icon: "fa-chart-line",    label: "Sales Report" },
    ],
  },
  {
    section: "System",
    items: [
      { id: "discarded",    icon: "fa-box-archive", label: "Discarded" },
      { id: "onboarding",   icon: "fa-circle-plus", label: "Onboard Restaurant" },
      { id: "credentials",  icon: "fa-key",         label: "Credentials" },
      { id: "settings",     icon: "fa-gear",        label: "Settings" },
    ],
  },
];

export default function SuperAdminSidebar({ active, setActive, onLogout }) {
  return (
    <aside className="sa-sidebar">
      {/* Logo */}
      <div className="sa-sidebar-logo">
        <div className="sa-logo-icon">
          <i className="fa-solid fa-utensils" />
        </div>
        <span className="sa-logo-text">
          FOO<span>DOS</span>
        </span>
        <span className="sa-logo-badge">SUPER</span>
      </div>

      {/* Profile */}
      <div className="sa-profile">
        <div className="sa-profile-avatar">S</div>
        <div>
          <div className="sa-profile-name">Super Admin</div>
          <div className="sa-profile-role">System Administrator</div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 3 }}>
            <span className="sa-online-dot" />
            <span className="sa-online-text">Online</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sa-nav">
        {NAV.map((group) => (
          <div key={group.section}>
            <div className="sa-nav-section">{group.section}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`sa-nav-item${active === item.id ? " active" : ""}`}
                onClick={() => setActive(item.id)}
              >
                <i className={`fa-solid ${item.icon}`} />
                {item.label}
                {item.badge && (
                  <span className="sa-nav-badge">{item.badge}</span>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="sa-sidebar-footer">
        <button className="sa-logout-btn" onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket" />
          Logout
        </button>
      </div>
    </aside>
  );
}
