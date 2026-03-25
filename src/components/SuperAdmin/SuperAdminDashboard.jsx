// SuperAdminDashboard.jsx  –  Main orchestrator
// Requires Bootstrap 5 CSS + Font Awesome 6 in index.html:
//   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
//   <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>

import { useState, useCallback } from "react";
import "./superadmin.css";

// Components
import SuperAdminSidebar          from "./SuperAdminSidebar";
import AdminHeader                from "./AdminHeader";
import StatCard                   from "./StatCard";
import PlatformOverviewChart      from "./PlatformOverviewChart";
import RestaurantListTable        from "./RestaurantListTable";
import RestaurantOnboardingForm   from "./RestaurantOnboardingForm";
import DiscardedRestaurants       from "./DiscardedRestaurants";
import UsersTable                 from "./UsersTable";
import OrdersSection              from "./OrdersSection";
import FeedbacksSection           from "./FeedbacksSection";
import SalesReport                from "./SalesReport";
import CredentialsManagement      from "./CredentialsManagement";
import SystemSettings             from "./SystemSettings";

// ── seed data (inline for standalone use; move to superadminData.jsx for real app) ──
const AC = ["#F5A623","#2D9CDB","#27AE60","#9B51E0","#FF4D4F","#F2994A","#1A2040","#0F6E56"];

const SEED_REST = [
  { id:1, name:"Divyans Kitchen", owner:"Divyans Patel", cat:"Multi",        city:"Prayagraj", rating:4.2, status:"active",  orders:3,   email:"divyans@gmail.com",    phone:"9876543210", joined:"Jan 2026" },
  { id:2, name:"Spice Garden",    owner:"Rahul Sharma",  cat:"South Indian", city:"Lucknow",   rating:4.7, status:"active",  orders:124, email:"rahul@spice.com",      phone:"9812345678", joined:"Dec 2025" },
  { id:3, name:"Burger Hub",      owner:"Priya Singh",   cat:"Fast Food",    city:"Kanpur",    rating:4.1, status:"active",  orders:89,  email:"priya@burger.com",     phone:"9823456789", joined:"Nov 2025" },
  { id:4, name:"Pizza Palace",    owner:"Sneha Gupta",   cat:"Italian",      city:"Varanasi",  rating:4.5, status:"active",  orders:201, email:"sneha@pizza.com",      phone:"9834567890", joined:"Sep 2025" },
  { id:5, name:"Desi Tadka",      owner:"Amit Verma",    cat:"North Indian", city:"Agra",      rating:3.8, status:"pending", orders:56,  email:"amit@desi.com",        phone:"9845678901", joined:"Oct 2025" },
  { id:6, name:"Chai Break",      owner:"Neha Joshi",    cat:"Beverages",    city:"Allahabad", rating:4.0, status:"active",  orders:67,  email:"neha@chai.com",        phone:"9856789012", joined:"Aug 2025" },
];
const SEED_DISC = [
  { id:101, name:"Old Dhaba",    owner:"Ravi Kumar", discardedOn:"2026-02-10", reason:"Licence expired" },
  { id:102, name:"Curry House",  owner:"Sita Devi",  discardedOn:"2026-01-22", reason:"Owner request"   },
];
const SEED_USERS = [
  { id:1, name:"Pawan Gupta",  email:"pawangupta123@gmail.com", phone:"9900112233", orders:3,  joined:"Mar 2026", status:"active"   },
  { id:2, name:"Rohan Mehta",  email:"rohan.mehta@gmail.com",   phone:"9911223344", orders:17, joined:"Feb 2026", status:"active"   },
  { id:3, name:"Ananya Joshi", email:"ananya.j@yahoo.com",       phone:"9922334455", orders:34, joined:"Jan 2026", status:"active"   },
  { id:4, name:"Vikram Yadav", email:"vikram.y@gmail.com",       phone:"9933445566", orders:8,  joined:"Dec 2025", status:"inactive" },
  { id:5, name:"Pooja Mishra", email:"pooja.m@outlook.com",      phone:"9944556677", orders:22, joined:"Nov 2025", status:"active"   },
  { id:6, name:"Suresh Kumar", email:"suresh.k@gmail.com",       phone:"9955667788", orders:5,  joined:"Jan 2026", status:"inactive" },
];
const SEED_ORDERS = [
  { id:"#ORD-1001", user:"Pawan Gupta",  rest:"Divyans Kitchen", items:"Veg Burger x2",     amt:"₹99",  date:"25 Mar 2026", status:"delivered" },
  { id:"#ORD-1002", user:"Rohan Mehta",  rest:"Spice Garden",    items:"Dosa x1, Tea x2",   amt:"₹180", date:"24 Mar 2026", status:"confirmed" },
  { id:"#ORD-1003", user:"Ananya Joshi", rest:"Pizza Palace",    items:"Margherita x1",     amt:"₹299", date:"24 Mar 2026", status:"delivered" },
  { id:"#ORD-1004", user:"Pooja Mishra", rest:"Burger Hub",      items:"Chicken Burger x2", amt:"₹340", date:"23 Mar 2026", status:"pending"   },
  { id:"#ORD-1005", user:"Vikram Yadav", rest:"Desi Tadka",      items:"Dal Makhani x1",    amt:"₹150", date:"22 Mar 2026", status:"cancelled" },
  { id:"#ORD-1006", user:"Suresh Kumar", rest:"Chai Break",      items:"Masala Chai x3",    amt:"₹90",  date:"22 Mar 2026", status:"delivered" },
  { id:"#ORD-1007", user:"Pawan Gupta",  rest:"Spice Garden",    items:"Biryani x2",        amt:"₹460", date:"21 Mar 2026", status:"delivered" },
  { id:"#ORD-1008", user:"Ananya Joshi", rest:"Burger Hub",      items:"Veg Wrap x1",       amt:"₹120", date:"20 Mar 2026", status:"confirmed" },
];
const SEED_FB = [
  { id:1, user:"Pawan Gupta",  rest:"Divyans Kitchen", rating:5, text:"Amazing food! Veg burger was super fresh and crispy.",              date:"24 Mar 2026" },
  { id:2, user:"Rohan Mehta",  rest:"Pizza Palace",     rating:4, text:"Great pizza, delivery was on time. Crust could be crunchier.",      date:"23 Mar 2026" },
  { id:3, user:"Ananya Joshi", rest:"Spice Garden",     rating:5, text:"Absolutely loved the South Indian dosa! Authentic taste.",          date:"22 Mar 2026" },
  { id:4, user:"Vikram Yadav", rest:"Burger Hub",       rating:3, text:"Decent burger but took too long to deliver.",                       date:"21 Mar 2026" },
  { id:5, user:"Pooja Mishra", rest:"Spice Garden",     rating:5, text:"Best biryani I've had! Perfectly spiced, generous portions.",        date:"20 Mar 2026" },
  { id:6, user:"Suresh Kumar", rest:"Desi Tadka",       rating:2, text:"Food was cold when delivered. Expected better quality.",             date:"19 Mar 2026" },
  { id:7, user:"Rohan Mehta",  rest:"Chai Break",       rating:4, text:"Perfect chai break spot. Quick delivery and masala chai was great.", date:"18 Mar 2026" },
];

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  const icons = { success:"fa-circle-check", error:"fa-circle-xmark", warning:"fa-triangle-exclamation" };
  return (
    <div className={`sa-toast ${toast.type}${toast.show?" show":""}`}>
      <i className={`fa-solid ${icons[toast.type]||icons.success}`} />
      {toast.msg}
    </div>
  );
}

// ── Dashboard section ────────────────────────────────────────────────────────
function DashboardHome({ restaurants, discarded, users, orders, feedbacks }) {
  const active  = restaurants.filter(r=>r.status==="active").length;
  const pending = restaurants.filter(r=>r.status==="pending").length;

  return (
    <>
      {/* Stat cards */}
      <div className="sa-stats-grid">
        <StatCard icon="fa-store"           iconColor="ic-gold"   label="Total Restaurants" value={restaurants.length} change="+1 this month" up />
        <StatCard icon="fa-users"           iconColor="ic-blue"   label="Total Users"       value={users.length}       change="+2 this week"  up />
        <StatCard icon="fa-bag-shopping"    iconColor="ic-green"  label="Total Orders"      value={orders.length}      change="+3 today"      up />
        <StatCard icon="fa-indian-rupee-sign" iconColor="ic-red"  label="Total Revenue"     value="₹39.1k"            change="+8.2% MoM"     up />
        <StatCard icon="fa-circle-check"    iconColor="ic-green"  label="Active Restaurants" value={active}            change={`${pending} pending`} up={false} />
        <StatCard icon="fa-star"            iconColor="ic-gold"   label="Avg Platform Rating" value="4.2★"             change="Top: Spice Garden 4.7★" up />
      </div>

      {/* Charts */}
      <PlatformOverviewChart restaurants={restaurants} orders={orders} />

      {/* Recent restaurants + feedbacks */}
      <div className="sa-analytics-row">
        <div className="sa-card">
          <div className="sa-card-header">
            <div className="sa-card-title">Recent Restaurants</div>
            <span className="sa-badge sa-badge-gold">{restaurants.length} total</span>
          </div>
          <table className="sa-table">
            <thead><tr><th>Name</th><th>Orders</th><th>Status</th></tr></thead>
            <tbody>
              {restaurants.slice(0,5).map((r,i)=>(
                <tr key={r.id}>
                  <td>
                    <div className="sa-rest-cell">
                      <div className="sa-rest-avatar" style={{ background: AC[i%AC.length], width:30, height:30, fontSize:12 }}>{r.name[0]}</div>
                      <div>
                        <div className="sa-rest-name">{r.name}</div>
                        <div className="sa-rest-cat">{r.owner}</div>
                      </div>
                    </div>
                  </td>
                  <td>{r.orders}</td>
                  <td><span className={`sa-badge ${r.status==="active"?"sa-badge-green":r.status==="pending"?"sa-badge-orange":"sa-badge-grey"}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sa-card">
          <div className="sa-card-header">
            <div className="sa-card-title">Recent Feedbacks</div>
          </div>
          <div>
            {feedbacks.slice(0,4).map((f,i)=>(
              <div key={f.id} style={{ padding:"13px 20px", borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <strong style={{ fontSize:13 }}>{f.user}</strong>
                  <span style={{ color:"var(--gold)", fontSize:12 }}>{"★".repeat(f.rating)}{"☆".repeat(5-f.rating)}</span>
                </div>
                <div style={{ fontSize:11, color:"var(--muted)" }}>{f.rest}</div>
                <div style={{ fontSize:12, color:"var(--text)", marginTop:4, lineHeight:1.5 }}>{f.text.slice(0,70)}…</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function SuperAdminDashboard() {
  const [active,      setActive]      = useState("dashboard");
  const [restaurants, setRestaurants] = useState(SEED_REST);
  const [discarded,   setDiscarded]   = useState(SEED_DISC);
  const [toast,       setToast]       = useState({ show:false, msg:"", type:"success" });

  const showToast = useCallback((msg, type="success") => {
    setToast({ show:true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3200);
  }, []);

  // restaurant actions
  const addRestaurant   = (r) => { setRestaurants(p=>[{id:Date.now(),...r,orders:0,rating:0,status:"pending"},  ...p]); showToast("Restaurant added!","success"); };
  const discardRest     = (id) => {
    const r = restaurants.find(x=>x.id===id);
    if(r) setDiscarded(p=>[{id:r.id,name:r.name,owner:r.owner,discardedOn:new Date().toISOString().split("T")[0],reason:"Admin action"},...p]);
    setRestaurants(p=>p.filter(x=>x.id!==id));
    showToast("Restaurant discarded. Restorable from Discarded section.","warning");
  };
  const deleteRest      = (id) => { setRestaurants(p=>p.filter(x=>x.id!==id)); showToast("Permanently deleted.","error"); };
  const restoreDisc     = (id) => {
    const r = discarded.find(x=>x.id===id);
    if(r) setRestaurants(p=>[{id:r.id,name:r.name,owner:r.owner,cat:"General",city:"-",rating:0,status:"inactive",orders:0,email:"",phone:""},...p]);
    setDiscarded(p=>p.filter(x=>x.id!==id));
    showToast("Restaurant restored!","success");
  };
  const deleteDisc      = (id) => { setDiscarded(p=>p.filter(x=>x.id!==id)); showToast("Permanently deleted.","error"); };

  return (
    <div className="sa-shell">
      <SuperAdminSidebar
        active={active}
        setActive={setActive}
        onLogout={() => showToast("Logged out successfully","success")}
      />

      <div className="sa-main">
        <AdminHeader
          active={active}
          onNotif={() => showToast("No new alerts","warning")}
        />

        <div className="sa-content">
          {active === "dashboard" && (
            <DashboardHome
              restaurants={restaurants}
              discarded={discarded}
              users={SEED_USERS}
              orders={SEED_ORDERS}
              feedbacks={SEED_FB}
            />
          )}

          {active === "restaurants" && (
            <RestaurantListTable
              restaurants={restaurants}
              onDiscard={discardRest}
              onDelete={deleteRest}
              onAdd={addRestaurant}
              showToast={showToast}
            />
          )}

          {active === "users" && (
            <UsersTable users={SEED_USERS} showToast={showToast} />
          )}

          {active === "orders" && (
            <OrdersSection orders={SEED_ORDERS} />
          )}

          {active === "feedbacks" && (
            <FeedbacksSection feedbacks={SEED_FB} />
          )}

          {active === "sales" && (
            <SalesReport />
          )}

          {active === "discarded" && (
            <DiscardedRestaurants
              discarded={discarded}
              onRestore={restoreDisc}
              onDelete={deleteDisc}
            />
          )}

          {active === "onboarding" && (
            <RestaurantOnboardingForm
              onAdd={addRestaurant}
              showToast={showToast}
            />
          )}

          {active === "credentials" && (
            <CredentialsManagement showToast={showToast} />
          )}

          {active === "settings" && (
            <SystemSettings showToast={showToast} />
          )}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
