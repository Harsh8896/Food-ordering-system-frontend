import { useState, useCallback, useEffect } from "react";
import "./superadmin.css";

// Components
import SuperAdminSidebar from "./SuperAdminSidebar";
import AdminHeader from "./AdminHeader";
import StatCard from "./StatCard";
import RestaurantListTable from "./RestaurantListTable";
import DiscardedRestaurants from "./DiscardedRestaurants";
import FeedbacksSection from "./FeedbacksSection";
import SystemSettings from "./SystemSettings";

// ── seed data ──
const SEED_REST = [
  { id:1, name:"Divyans Kitchen", owner:"Divyans Patel", cat:"Multi", city:"Prayagraj", rating:4.2, status:"active", orders:3, email:"divyans@gmail.com", phone:"9876543210", joined:"Jan 2026" },
  { id:2, name:"Spice Garden", owner:"Rahul Sharma", cat:"South Indian", city:"Lucknow", rating:4.7, status:"active", orders:124, email:"rahul@spice.com", phone:"9812345678", joined:"Dec 2025" },
  { id:3, name:"Burger Hub", owner:"Priya Singh", cat:"Fast Food", city:"Kanpur", rating:4.1, status:"active", orders:89, email:"priya@burger.com", phone:"9823456789", joined:"Nov 2025" },
  { id:4, name:"Pizza Palace", owner:"Sneha Gupta", cat:"Italian", city:"Varanasi", rating:4.5, status:"active", orders:201, email:"sneha@pizza.com", phone:"9834567890", joined:"Sep 2025" },
  { id:5, name:"Desi Tadka", owner:"Amit Verma", cat:"North Indian", city:"Agra", rating:3.8, status:"pending", orders:56, email:"amit@desi.com", phone:"9845678901", joined:"Oct 2025" },
  { id:6, name:"Chai Break", owner:"Neha Joshi", cat:"Beverages", city:"Allahabad", rating:4.0, status:"active", orders:67, email:"neha@chai.com", phone:"9856789012", joined:"Aug 2025" },
];

const SEED_DISC = [
  { id:101, name:"Old Dhaba", owner:"Ravi Kumar", discardedOn:"2026-02-10", reason:"Licence expired" },
  { id:102, name:"Curry House", owner:"Sita Devi", discardedOn:"2026-01-22", reason:"Owner request" },
];

const SEED_USERS = [
  { id:1, name:"Pawan Gupta", email:"pawangupta123@gmail.com", phone:"9900112233", orders:3, joined:"Mar 2026", status:"active" },
  { id:2, name:"Rohan Mehta", email:"rohan.mehta@gmail.com", phone:"9911223344", orders:17, joined:"Feb 2026", status:"active" },
  { id:3, name:"Ananya Joshi", email:"ananya.j@yahoo.com", phone:"9922334455", orders:34, joined:"Jan 2026", status:"active" },
];

const SEED_ORDERS = [
  { id:"#ORD-1001", user:"Pawan Gupta", rest:"Divyans Kitchen", items:"Veg Burger x2", amt:"₹99", date:"25 Mar 2026", status:"delivered" },
  { id:"#ORD-1002", user:"Rohan Mehta", rest:"Spice Garden", items:"Dosa x1, Tea x2", amt:"₹180", date:"24 Mar 2026", status:"confirmed" },
];

const SEED_FB = [
  { id:1, user:"Pawan Gupta", rest:"Divyans Kitchen", rating:5, text:"Amazing food!", date:"24 Mar 2026" },
  { id:2, user:"Rohan Mehta", rest:"Pizza Palace", rating:4, text:"Great pizza!", date:"23 Mar 2026" },
];

// ── Toast ──
function Toast({ toast }) {
  const icons = {
    success: "fa-circle-check",
    error: "fa-circle-xmark",
    warning: "fa-triangle-exclamation",
  };

  return (
    <div className={`sa-toast ${toast.type}${toast.show ? " show" : ""}`}>
      <i className={`fa-solid ${icons[toast.type] || icons.success}`} />
      {toast.msg}
    </div>
  );
}

// ── Dashboard ──
function DashboardHome({ restaurants = [], users = [], orders = [] }) {
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    fetchRestaurantData();
  }, [restaurants]);

  const fetchRestaurantData = async () => {
    try {
      const results = await Promise.all(
        restaurants.map(async (rest) => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/restaurant-sales-summary/${rest.id}/`
            );

            if (!res.ok) throw new Error("API error");

            const data = await res.json();

            return {
              id: rest.id,
              name: data.restaurant_name || rest.name,
              orders: data.total_orders || 0,
              revenue: data.total_revenue || 0,
            };
          } catch {
            return {
              id: rest.id,
              name: rest.name,
              orders: 0,
              revenue: 0,
            };
          }
        })
      );

      results.sort((a, b) => b.revenue - a.revenue);
      setRestaurantData(results);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="sa-stats-grid">
        <StatCard icon="fa-store" label="Total Restaurants" value={restaurants.length} />
        <StatCard icon="fa-users" label="Total Users" value={users.length} />
        <StatCard icon="fa-bag-shopping" label="Total Orders" value={orders.length} />
        <StatCard icon="fa-indian-rupee-sign" label="Total Revenue" value="₹--" />
      </div>

      <div className="sa-card">
        <div className="sa-card-header">
          <div className="sa-card-title">
            <i className="fa-solid fa-trophy" style={{ marginRight: 8 }} />
            Restaurants by Revenue
          </div>
        </div>

        <table className="sa-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Restaurant</th>
              <th>Orders</th>
              <th>Revenue</th>
            </tr>
          </thead>

          <tbody>
            {restaurantData.map((r, index) => (
              <tr key={r.id}>
                <td><strong>#{index + 1}</strong></td>
                <td><strong>{r.name}</strong></td>
                <td>{r.orders}</td>
                <td><strong>₹{r.revenue}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// ── Main ──
export default function SuperAdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [restaurants, setRestaurants] = useState(SEED_REST);
  const [discarded, setDiscarded] = useState(SEED_DISC);
  const [toast, setToast] = useState({ show:false, msg:"", type:"success" });

  const showToast = useCallback((msg, type="success") => {
    setToast({ show:true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show:false })), 3200);
  }, []);

  const addRestaurant = (r) => {
    setRestaurants(p => [{ id:Date.now(), ...r, orders:0, rating:0, status:"pending" }, ...p]);
    showToast("Restaurant added!", "success");
  };

  const discardRest = (id) => {
    const r = restaurants.find(x => x.id === id);
    if (r) {
      setDiscarded(p => [{ ...r, discardedOn:new Date().toISOString().split("T")[0], reason:"Admin action" }, ...p]);
    }
    setRestaurants(p => p.filter(x => x.id !== id));
    showToast("Restaurant discarded", "warning");
  };

  const deleteRest = (id) => {
    setRestaurants(p => p.filter(x => x.id !== id));
    showToast("Deleted", "error");
  };

  const restoreDisc = (id) => {
    const r = discarded.find(x => x.id === id);
    if (r) {
      setRestaurants(p => [{ ...r, status:"inactive", orders:0 }, ...p]);
    }
    setDiscarded(p => p.filter(x => x.id !== id));
    showToast("Restored", "success");
  };

  const deleteDisc = (id) => {
    setDiscarded(p => p.filter(x => x.id !== id));
    showToast("Deleted", "error");
  };

  return (
    <div className="sa-shell">
      <SuperAdminSidebar active={active} setActive={setActive} />

      <div className="sa-main">
        <AdminHeader active={active} />

        <div className="sa-content">
          {active === "dashboard" && (
            <DashboardHome
              restaurants={restaurants}
              users={SEED_USERS}
              orders={SEED_ORDERS}
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

          {active === "feedbacks" && (
            <FeedbacksSection feedbacks={SEED_FB} />
          )}

          {active === "discarded" && (
            <DiscardedRestaurants
              discarded={discarded}
              onRestore={restoreDisc}
              onDelete={deleteDisc}
            />
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