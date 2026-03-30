import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaReceipt, FaCheckCircle, FaClock,
  FaUtensils, FaTruck, FaHome,
  FaPhoneAlt, FaSearch, FaHourglassHalf,
} from "react-icons/fa";

// Waiting messages — randomly ek dikhega
const WAITING_MESSAGES = [
  { emoji: "🍳", title: "Kitchen mein khabar pahunch gayi!", msg: "Restaurant aapka order dekh raha hai. Thodi der mein confirm hoga!" },
  { emoji: "👨‍🍳", title: "Chef ji ready ho rahe hain...", msg: "Aapka order queue mein hai. Restaurant jald hi confirm karega!" },
  { emoji: "🔔", title: "Order mila, response aa raha hai!", msg: "Restaurant owner ko notification bhej di gayi hai. Bas kuch pal aur!" },
  { emoji: "⏳", title: "Patience rakho, swaad aane wala hai!", msg: "Aapka order abhi restaurant ke review mein hai. Jaldi confirm hoga!" },
  { emoji: "🚀", title: "Order rocket speed se process ho raha hai!", msg: "Restaurant aapke order ko verify kar raha hai. Thoda wait karo!" },
];

const TrackOrder = () => {
  const { paramOrderNumber } = useParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [waitingMsg] = useState(() =>
    WAITING_MESSAGES[Math.floor(Math.random() * WAITING_MESSAGES.length)]
  );

  useEffect(() => {
    if (paramOrderNumber) {
      setOrderNumber(paramOrderNumber);
      handleTrack(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleTrack = async (orderNum) => {
    if (!orderNum) return toast.warning("Please enter order number");
    setLoading(true);
    setSearched(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/track_order/${orderNum}`);
      const data = await res.json();
      if (res.ok) {
        setTrackingData(data);
      } else {
        setTrackingData([]);
        toast.error("Order not found");
      }
    } catch {
      toast.error("Server error");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "order confirmed":    return <FaCheckCircle />;
      case "food being prepared": return <FaUtensils />;
      case "food pickup":        return <FaTruck />;
      case "food delivered":     return <FaHome />;
      default:                   return <FaClock />;
    }
  };

  const getStatusTheme = (status) => {
    switch (status.toLowerCase()) {
      case "order confirmed":    return { color: "#3b82f6", bg: "#e0f2fe" };
      case "food being prepared": return { color: "#f59e0b", bg: "#fef3c7" };
      case "food pickup":        return { color: "#6366f1", bg: "#e0e7ff" };
      case "food delivered":     return { color: "#22c55e", bg: "#dcfce7" };
      default:                   return { color: "#6b7280", bg: "#f3f4f6" };
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="page-bg">
        <div className="container">

          {/* SEARCH */}
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Enter Order ID..."
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack(orderNumber)}
            />
            <button onClick={() => handleTrack(orderNumber)}>
              {loading ? "..." : "Track"}
            </button>
          </div>

          {/* TRACKING DATA */}
          {trackingData.length > 0 ? (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card-pro">
                  <div className="header">
                    <h5>Order Tracking</h5>
                    <span className="live">● Live</span>
                  </div>
                  <div className="timeline">
                    {trackingData.map((item, i) => {
                      const theme = getStatusTheme(item.status);
                      const date = new Date(item.status_date);
                      return (
                        <div className="timeline-item" key={i}>
                          <div className="icon" style={{ background: theme.bg, color: theme.color }}>
                            {getStatusIcon(item.status)}
                          </div>
                          <div>
                            <h6>{item.status}</h6>
                            <small>{date.toLocaleDateString()} | {date.toLocaleTimeString()}</small>
                            <p>{item.remark || "Processing..."}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card-dark text-center mb-4">
                  <FaReceipt size={25} />
                  <h6>Order ID</h6>
                  <h3>#{orderNumber}</h3>
                  <p>Estimated Delivery</p>
                  <h5>30-45 mins</h5>
                </div>
                <div className="card-pro">
                  <h6>Support</h6>
                  <div className="support">
                    <FaPhoneAlt />
                    <div>
                      <p>Call Restaurant</p>
                      <small>+91 98765 43210</small>
                    </div>
                  </div>
                  <button className="btn-help">Get Help</button>
                </div>
              </div>
            </div>

          ) : searched ? (
            /* WAITING STATE — restaurant ne confirm nahi kiya */
            <div className="waiting-box">
              <div className="waiting-emoji">{waitingMsg.emoji}</div>
              <div className="waiting-icon-wrap">
                <FaHourglassHalf className="hourglass-icon" />
              </div>
              <h4 className="waiting-title">{waitingMsg.title}</h4>
              <p className="waiting-msg">{waitingMsg.msg}</p>

              <div className="waiting-steps">
                <div className="step step-done">
                  <div className="step-dot done" />
                  <span>Order Placed</span>
                </div>
                <div className="step-line" />
                <div className="step step-active">
                  <div className="step-dot active" />
                  <span>Waiting for Restaurant</span>
                </div>
                <div className="step-line faded" />
                <div className="step step-pending">
                  <div className="step-dot pending" />
                  <span>Preparing</span>
                </div>
                <div className="step-line faded" />
                <div className="step step-pending">
                  <div className="step-dot pending" />
                  <span>Delivered</span>
                </div>
              </div>

              <p className="waiting-order-id">Order ID: <strong>#{orderNumber}</strong></p>
            </div>

          ) : (
            /* INITIAL EMPTY STATE */
            <div className="empty">
              <h5>Enter Order ID to track</h5>
            </div>
          )}

        </div>
      </div>

      <style>{`
        .page-bg {
          background: #f8fafc;
          min-height: 100vh;
          padding: 50px 0;
        }
        .search-box {
          display: flex; align-items: center; gap: 10px;
          background: #fff; padding: 10px 15px;
          border-radius: 50px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          max-width: 500px; margin: 0 auto 40px;
        }
        .search-box input { flex: 1; border: none; outline: none; }
        .search-box button {
          background: #3b82f6; border: none; color: #fff;
          padding: 6px 16px; border-radius: 20px; cursor: pointer;
        }
        .card-pro {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px; padding: 20px;
        }
        .card-dark {
          background: linear-gradient(135deg,#1e293b,#020617);
          color: white; padding: 20px; border-radius: 16px;
        }
        .timeline-item { display: flex; gap: 15px; margin-bottom: 20px; }
        .icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .live { color: green; animation: blink 1.5s infinite; }
        @keyframes blink { 50% { opacity: 0.4; } }
        .support { display: flex; gap: 10px; background: #fff7ed; padding: 10px; border-radius: 10px; margin-bottom: 10px; }
        .btn-help { width: 100%; padding: 10px; background: #111; color: #fff; border: none; border-radius: 10px; cursor: pointer; }
        .empty { text-align: center; margin-top: 50px; color: #94a3b8; }

        /* Waiting Box */
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); }
          70% { box-shadow: 0 0 0 16px rgba(245,158,11,0); }
          100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); }
        }
        .waiting-box {
          max-width: 520px; margin: 0 auto;
          background: #fff; border-radius: 24px;
          padding: 48px 36px; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.08);
          border: 1px solid #f1f5f9;
          animation: fadeUp 0.5s ease;
        }
        .waiting-emoji {
          font-size: 52px; margin-bottom: 16px;
          animation: fadeUp 0.4s ease 0.1s both;
        }
        .waiting-icon-wrap {
          display: inline-flex; align-items: center; justify-content: center;
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          margin-bottom: 20px;
          animation: pulse-ring 2s infinite;
        }
        .hourglass-icon {
          color: #f59e0b; font-size: 28px;
          animation: spin-slow 3s linear infinite;
        }
        .waiting-title {
          color: #1e293b; font-weight: 800;
          font-size: 20px; margin-bottom: 10px;
        }
        .waiting-msg {
          color: #64748b; font-size: 14px;
          line-height: 1.7; margin-bottom: 32px;
        }
        .waiting-steps {
          display: flex; align-items: center;
          justify-content: center; gap: 0;
          margin-bottom: 28px; flex-wrap: nowrap;
        }
        .step {
          display: flex; flex-direction: column;
          align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600;
          color: #94a3b8; min-width: 72px;
        }
        .step-done span { color: #22c55e; }
        .step-active span { color: #f59e0b; }
        .step-line {
          width: 32px; height: 2px;
          background: #22c55e; margin-bottom: 20px; flex-shrink: 0;
        }
        .step-line.faded { background: #e2e8f0; }
        .step-dot {
          width: 14px; height: 14px; border-radius: 50%;
        }
        .step-dot.done { background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.15); }
        .step-dot.active {
          background: #f59e0b;
          box-shadow: 0 0 0 4px rgba(245,158,11,0.2);
          animation: pulse-ring 1.5s infinite;
        }
        .step-dot.pending { background: #e2e8f0; }
        .waiting-order-id {
          color: #94a3b8; font-size: 13px; margin: 0;
          background: #f8fafc; border-radius: 10px; padding: 10px 20px;
          display: inline-block;
        }
        .waiting-order-id strong { color: #1e293b; }
      `}</style>
    </PublicLayout>
  );
};

export default TrackOrder;