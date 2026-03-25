// StatCard.jsx
import "./superadmin.css";

/**
 * Props:
 *  icon      – FontAwesome class e.g. "fa-store"
 *  iconColor – CSS class e.g. "ic-gold"
 *  label     – string
 *  value     – string | number
 *  change    – string  e.g. "+12% this month"
 *  up        – bool    (green if true, red if false)
 */
export default function StatCard({ icon, iconColor = "ic-gold", label, value, change, up }) {
  return (
    <div className="sa-stat-card">
      <div className={`sa-stat-icon ${iconColor}`}>
        <i className={`fa-solid ${icon}`} />
      </div>
      <div className="sa-stat-info">
        <div className="sa-stat-label">{label}</div>
        <div className="sa-stat-value">{value}</div>
        {change && (
          <div className={`sa-stat-change ${up ? "sa-change-up" : "sa-change-down"}`}>
            <i className={`fa-solid fa-arrow-${up ? "up" : "down"}`} style={{ fontSize: 9 }} />{" "}
            {change}
          </div>
        )}
      </div>
    </div>
  );
}
