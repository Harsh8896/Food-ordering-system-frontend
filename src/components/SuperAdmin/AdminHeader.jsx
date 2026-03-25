// AdminHeader.jsx
import "./superadmin.css";

const TITLES = {
  dashboard:   { title: "Business Overview",        sub: "Welcome back, Super Admin! Here's what's happening today." },
  restaurants: { title: "Manage Restaurants",       sub: "Add, discard, or permanently remove restaurants." },
  users:       { title: "All Users",                sub: "View and manage all registered users." },
  orders:      { title: "All Orders",               sub: "Monitor every order across all restaurants." },
  feedbacks:   { title: "User Feedbacks",           sub: "Read and filter all customer reviews." },
  sales:       { title: "Sales Report",             sub: "Revenue analytics across the platform." },
  discarded:   { title: "Discarded Restaurants",    sub: "Restore or permanently delete archived restaurants." },
  onboarding:  { title: "Onboard New Restaurant",   sub: "Add a new restaurant to the platform." },
  credentials: { title: "Credentials Management",   sub: "Manage admin logins and API keys." },
  settings:    { title: "System Settings",          sub: "Configure platform-wide preferences." },
};

export default function AdminHeader({ active, onNotif }) {
  const { title, sub } = TITLES[active] || TITLES.dashboard;
  return (
    <div className="sa-topbar">
      <div>
        <div className="sa-topbar-title">{title}</div>
        <div className="sa-topbar-sub">{sub}</div>
      </div>
      <div className="d-flex align-items-center gap-3">
        <button className="sa-topbar-btn" onClick={onNotif}>
          <i className="fa-solid fa-bell" />
          <span className="sa-notif-dot" />
        </button>
        <button className="sa-topbar-btn">
          <i className="fa-solid fa-magnifying-glass" />
        </button>
        <div className="d-flex align-items-center gap-2">
          <div className="sa-t-avatar">SA</div>
          <div>
            <div className="sa-t-name">Super Admin</div>
            <div className="sa-t-role">System Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}
