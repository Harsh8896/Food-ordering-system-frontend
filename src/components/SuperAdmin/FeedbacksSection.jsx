// FeedbacksSection.jsx
import { useState } from "react";
import { ac } from "./superadminData";

import "./superadmin.css";

function Stars({ n, size = 13 }) {
  return (
    <span>
      {[1,2,3,4,5].map((i) => (
        <i key={i} className={`fa-${i<=n?"solid":"regular"} fa-star`} style={{ color:"var(--gold)", fontSize:size, marginRight:1 }} />
      ))}
      <span className="sa-fb-rating">{n}/5</span>
    </span>
  );
}

export default function FeedbacksSection({ feedbacks }) {
  const [search,     setSearch]     = useState("");
  const [minRating,  setMinRating]  = useState(0);

  const filtered = feedbacks.filter((f) => {
    const q = search.toLowerCase();
    const matchSearch = !q || f.user.toLowerCase().includes(q) || f.rest.toLowerCase().includes(q) || f.text.toLowerCase().includes(q);
    return matchSearch && f.rating >= minRating;
  });

  const avg = feedbacks.length ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1) : "–";

  return (
    <>
      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
        {[
          { label:"Total Reviews", value: feedbacks.length, icon:"fa-star", color:"ic-gold" },
          { label:"Average Rating", value: `${avg} ★`,        icon:"fa-chart-bar", color:"ic-blue" },
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

      <div className="sa-card">
        <div className="sa-card-header">
          <div>
            <div className="sa-card-title">User Feedbacks</div>
            <div className="sa-card-sub">{filtered.length} reviews shown</div>
          </div>
          <div className="sa-card-actions">
            <div className="sa-search-box">
              <i className="fa-solid fa-magnifying-glass" style={{ color:"var(--muted)", fontSize:13 }} />
              <input placeholder="Search feedback…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select
              style={{ border:"1px solid var(--border)", borderRadius:10, padding:"8px 13px", fontSize:13, fontFamily:"Nunito,sans-serif", color:"var(--text)", background:"var(--bg)", outline:"none" }}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            >
              <option value={0}>All Ratings</option>
              {[5,4,3,2,1].map((n) => (
                <option key={n} value={n}>{n}★ & above</option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="sa-empty">
            <i className="fa-solid fa-star" />
            <p>No feedbacks match your filter</p>
          </div>
        ) : (
          <div className="sa-feedback-grid">
            {filtered.map((f, i) => (
              <div className="sa-fb-card" key={f.id}>
                <div className="sa-fb-header">
                  <div className="sa-fb-user">
                    <div className="sa-fb-avatar" style={{ background: ac(i) }}>{f.user[0]}</div>
                    <div>
                      <div className="sa-fb-name">{f.user}</div>
                      <div className="sa-fb-rest">
                        <i className="fa-solid fa-store" style={{ fontSize:10, marginRight:3 }} />
                        {f.rest}
                      </div>
                    </div>
                  </div>
                  <div className="sa-fb-date">{f.date}</div>
                </div>
                <Stars n={f.rating} />
                <div className="sa-fb-text">{f.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
