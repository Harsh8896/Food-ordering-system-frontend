// PlatformOverviewChart.jsx
import "./superadmin.css";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const VALS = [1200, 1800, 900, 2400, 3100, 4200, 2800];
const MAX  = Math.max(...VALS);

const LEGEND = [
  { label: "Active Restaurants", val: "5",   color: "#F5A623" },
  { label: "Pending Approval",   val: "1",   color: "#F2994A" },
  { label: "Discarded",          val: "2",   color: "#8A94B2" },
];

// simple SVG donut
function Donut({ segments, size = 90, stroke = 14 }) {
  const r   = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, g) => s + g.value, 0);
  let offset  = 0;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle
            key={i}
            cx={size / 2}  cy={size / 2}  r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

export default function PlatformOverviewChart({ restaurants = [], orders = [] }) {
  const active   = restaurants.filter(r => r.status === "active").length;
  const pending  = restaurants.filter(r => r.status === "pending").length;
  const totalRev = orders.length * 230; // mock

  return (
    <div className="sa-analytics-row">
      {/* Bar Chart – Weekly Revenue */}
      <div className="sa-chart-card">
        <div className="sa-chart-title">
          <i className="fa-solid fa-chart-bar" style={{ color: "var(--gold)", marginRight: 8 }} />
          Weekly Revenue
        </div>
        <div className="sa-bar-chart">
          {VALS.map((v, i) => (
            <div className="sa-bar-wrap" key={i}>
              <div className="sa-bar-val">₹{(v / 1000).toFixed(1)}k</div>
              <div className="sa-bar" style={{ height: Math.round((v / MAX) * 90) + "px" }} title={`${DAYS[i]}: ₹${v}`} />
            </div>
          ))}
        </div>
        <div className="sa-bar-labels">
          {DAYS.map((d) => (
            <span className="sa-bar-label" key={d}>{d}</span>
          ))}
        </div>
      </div>

      {/* Donut – Restaurant Status */}
      <div className="sa-chart-card">
        <div className="sa-chart-title">
          <i className="fa-solid fa-chart-pie" style={{ color: "var(--gold)", marginRight: 8 }} />
          Restaurant Status
        </div>
        <div className="sa-pie-wrap">
          <div className="sa-donut">
            <Donut
              segments={[
                { value: active  || 5, color: "#F5A623" },
                { value: pending || 1, color: "#F2994A" },
                { value: 2,            color: "#8A94B2" },
              ]}
            />
            <div className="sa-donut-text">
              <span className="sa-donut-num">{restaurants.length || 8}</span>
              <span className="sa-donut-lbl">Total</span>
            </div>
          </div>
          <div className="sa-pie-legend">
            {LEGEND.map((l) => (
              <div className="sa-legend-item" key={l.label}>
                <span className="sa-legend-dot" style={{ background: l.color }} />
                <span>{l.label}</span>
                <span className="sa-legend-val">{l.val}</span>
              </div>
            ))}
            <div className="sa-legend-item" style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>Platform Revenue</span>
              <span className="sa-legend-val" style={{ color: "var(--gold)" }}>₹{(totalRev || 16750).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
