// SalesReport.jsx
import "./superadmin.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTHLY = [8200, 11400, 9800, 14200, 16800, 13600, 19200, 21000, 18400, 22800, 25600, 16750];
const MAX = Math.max(...MONTHLY);

export default function SalesReport() {
  const total = MONTHLY.reduce((a,b)=>a+b,0);
  const thisMonth = MONTHLY[2];
  const growth = (((MONTHLY[2]-MONTHLY[1])/MONTHLY[1])*100).toFixed(1);

  return (
    <>
      {/* Stats */}
      <div className="sa-stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)" }}>
        {[
          { label:"Annual Revenue",   value:`₹${(total/1000).toFixed(0)}k`,    icon:"fa-indian-rupee-sign", color:"ic-gold" },
          { label:"This Month",       value:`₹${(thisMonth/1000).toFixed(1)}k`, icon:"fa-calendar-check",    color:"ic-blue" },
          { label:"Month-on-Month",   value:`+${growth}%`,                      icon:"fa-arrow-trend-up",    color:"ic-green" },
        ].map((s) => (
          <div className="sa-stat-card" key={s.label}>
            <div className={`sa-stat-icon ${s.color}`}><i className={`fa-solid ${s.icon}`} /></div>
            <div>
              <div className="sa-stat-label">{s.label}</div>
              <div className="sa-stat-value">{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart – Monthly */}
      <div className="sa-chart-card" style={{ marginBottom:22 }}>
        <div className="sa-chart-title">
          <i className="fa-solid fa-chart-column" style={{ color:"var(--gold)", marginRight:8 }} />
          Monthly Revenue Breakdown
        </div>
        <div className="sa-bar-chart" style={{ height:120 }}>
          {MONTHLY.map((v, i) => (
            <div className="sa-bar-wrap" key={i}>
              <div className="sa-bar-val">₹{(v/1000).toFixed(0)}k</div>
              <div className="sa-bar" style={{ height: Math.round((v/MAX)*110)+"px" }} title={`${MONTHS[i]}: ₹${v}`} />
            </div>
          ))}
        </div>
        <div className="sa-bar-labels">
          {MONTHS.map((m) => <span className="sa-bar-label" key={m}>{m}</span>)}
        </div>
      </div>

      {/* Top restaurants by revenue */}
      <div className="sa-card">
        <div className="sa-card-header">
          <div className="sa-card-title">
            <i className="fa-solid fa-trophy" style={{ color:"var(--gold)", marginRight:8 }} />
            Top Restaurants by Revenue
          </div>
        </div>
        <table className="sa-table">
          <thead>
            <tr><th>#</th><th>Restaurant</th><th>Category</th><th>Orders</th><th>Revenue</th><th>Share</th></tr>
          </thead>
          <tbody>
            {[
              { rank:1, name:"Pizza Palace",  cat:"Italian",      orders:201, rev:18750 },
              { rank:2, name:"Spice Garden",  cat:"South Indian", orders:124, rev:8920  },
              { rank:3, name:"Burger Hub",    cat:"Fast Food",    orders:89,  rev:5430  },
              { rank:4, name:"Desi Tadka",    cat:"North Indian", orders:56,  rev:3200  },
              { rank:5, name:"Chai Break",    cat:"Beverages",    orders:67,  rev:2800  },
            ].map((r) => {
              const pct = ((r.rev/39100)*100).toFixed(1);
              return (
                <tr key={r.rank}>
                  <td><strong style={{ color:"var(--gold)" }}>#{r.rank}</strong></td>
                  <td><strong>{r.name}</strong></td>
                  <td><span className="sa-badge sa-badge-blue">{r.cat}</span></td>
                  <td>{r.orders}</td>
                  <td><strong>₹{r.rev.toLocaleString()}</strong></td>
                  <td>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ flex:1, height:6, background:"var(--bg)", borderRadius:4, overflow:"hidden" }}>
                        <div style={{ width:`${pct}%`, height:"100%", background:"var(--gold)", borderRadius:4 }} />
                      </div>
                      <span style={{ fontSize:11, color:"var(--muted)", fontWeight:700 }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
