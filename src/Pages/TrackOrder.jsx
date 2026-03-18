import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaReceipt,
  FaCheckCircle,
  FaClock,
  FaUtensils,
  FaTruck,
  FaHome,
  FaPhoneAlt,
  FaSearch,
} from "react-icons/fa";

const TrackOrder = () => {
  const { paramOrderNumber } = useParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paramOrderNumber) {
      setOrderNumber(paramOrderNumber);
      handleTrack(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleTrack = async (orderNum) => {
    if (!orderNum) return toast.warning("Please enter order number");

    setLoading(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/track_order/${orderNum}`
      );
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
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "order confirmed":
        return <FaCheckCircle />;
      case "food being prepared":
        return <FaUtensils />;
      case "food pickup":
        return <FaTruck />;
      case "food delivered":
        return <FaHome />;
      default:
        return <FaClock />;
    }
  };

  const getStatusTheme = (status) => {
    switch (status.toLowerCase()) {
      case "order confirmed":
        return { color: "#3b82f6", bg: "#e0f2fe" };
      case "food being prepared":
        return { color: "#f59e0b", bg: "#fef3c7" };
      case "food pickup":
        return { color: "#6366f1", bg: "#e0e7ff" };
      case "food delivered":
        return { color: "#22c55e", bg: "#dcfce7" };
      default:
        return { color: "#6b7280", bg: "#f3f4f6" };
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
            />
            <button onClick={() => handleTrack(orderNumber)}>
              {loading ? "..." : "Track"}
            </button>
          </div>

          {trackingData.length > 0 ? (
            <div className="row g-4">

              {/* LEFT */}
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
                          <div
                            className="icon"
                            style={{
                              background: theme.bg,
                              color: theme.color,
                            }}
                          >
                            {getStatusIcon(item.status)}
                          </div>

                          <div>
                            <h6>{item.status}</h6>
                            <small>
                              {date.toLocaleDateString()} |{" "}
                              {date.toLocaleTimeString()}
                            </small>
                            <p>{item.remark || "Processing..."}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>

              {/* RIGHT */}
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
          ) : (
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
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          padding: 10px 15px;
          border-radius: 50px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          max-width: 500px;
          margin: 0 auto 40px;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
        }

        .search-box button {
          background: #3b82f6;
          border: none;
          color: #fff;
          padding: 6px 16px;
          border-radius: 20px;
        }

        .card-pro {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
        }

        .card-dark {
          background: linear-gradient(135deg,#1e293b,#020617);
          color: white;
          padding: 20px;
          border-radius: 16px;
        }

        .timeline-item {
          display: flex;
          gap: 15px;
          margin-bottom: 20px;
        }

        .icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .live {
          color: green;
          animation: blink 1.5s infinite;
        }

        @keyframes blink {
          50% { opacity: 0.4; }
        }

        .support {
          display: flex;
          gap: 10px;
          background: #fff7ed;
          padding: 10px;
          border-radius: 10px;
          margin-bottom: 10px;
        }

        .btn-help {
          width: 100%;
          padding: 10px;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 10px;
        }

        .empty {
          text-align: center;
          margin-top: 50px;
        }

      `}</style>
    </PublicLayout>
  );
};

export default TrackOrder;