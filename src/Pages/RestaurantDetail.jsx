import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import {
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarDays,
  FaCalendar,
  FaIndianRupeeSign,
  FaBagShopping,
} from "react-icons/fa6";
import "../styles/RestaurantDetail.css";

const BASE_URL = "http://127.0.0.1:8000/api";

function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0";
  return (
    "₹" +
    Number(amount).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })
  );
}

function StatCard({ title, value, icon: Icon, type }) {
  const prefixIcon =
    type === "orders" ? <FaBagShopping /> : <FaIndianRupeeSign />;

  return (
    <Card className="restaurant-detail-card h-100">
      <Card.Body>
        <div className="restaurant-detail-card-top">
          <div className={`restaurant-detail-icon ${type}`}>
            <Icon />
          </div>
          <div className={`restaurant-detail-chip ${type}`}>{prefixIcon}</div>
        </div>
        <p className="restaurant-detail-title">{title}</p>
        <h3 className="restaurant-detail-value">{value ?? "—"}</h3>
      </Card.Body>
    </Card>
  );
}

export default function RestaurantDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/restaurant-sales-summary/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="restaurant-detail-page">
        <Container fluid className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading restaurant data...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="restaurant-detail-page">
        <Container fluid className="py-4 px-3">
          <Alert variant="danger">
            <Alert.Heading>API Error</Alert.Heading>
            <p>{error || "Unknown error occurred"}</p>
            <hr />
            <p className="mb-0">
              <strong>URL:</strong>{" "}
              <code>{BASE_URL}/restaurant-sales-summary/{id}/</code>
            </p>
          </Alert>
        </Container>
      </div>
    );
  }

  const cardSections = [
    {
      id: "sales",
      title: "Sales (Total Revenue)",
      cards: [
        { id: "s1", title: "Today's Sales",  value: formatCurrency(data.day),   icon: FaCalendarDay,  type: "sales" },
        { id: "s2", title: "Weekly Sales",   value: formatCurrency(data.week),  icon: FaCalendarWeek, type: "sales" },
        { id: "s3", title: "Monthly Sales",  value: formatCurrency(data.month), icon: FaCalendarDays, type: "sales" },
        { id: "s4", title: "Yearly Sales",   value: formatCurrency(data.year),  icon: FaCalendar,     type: "sales" },
      ],
    },
    {
      id: "orders",
      title: "Orders",
      cards: [
        { id: "o1", title: "Today's Orders",  value: data.orders_today  ?? 0, icon: FaCalendarDay,  type: "orders" },
        { id: "o2", title: "Weekly Orders",   value: data.orders_week   ?? 0, icon: FaCalendarWeek, type: "orders" },
        { id: "o3", title: "Monthly Orders",  value: data.orders_month  ?? 0, icon: FaCalendarDays, type: "orders" },
        { id: "o4", title: "Yearly Orders",   value: data.orders_year   ?? 0, icon: FaCalendar,     type: "orders" },
      ],
    },
    {
      id: "restaurant-profit",
      title: "Restaurant Profit (85%)",
      cards: [
        { id: "rp1", title: "Today's Profit",  value: formatCurrency(data.restaurant_profit_today),  icon: FaCalendarDay,  type: "sales" },
        { id: "rp2", title: "Weekly Profit",   value: formatCurrency(data.restaurant_profit_week),   icon: FaCalendarWeek, type: "sales" },
        { id: "rp3", title: "Monthly Profit",  value: formatCurrency(data.restaurant_profit_month),  icon: FaCalendarDays, type: "sales" },
        { id: "rp4", title: "Yearly Profit",   value: formatCurrency(data.restaurant_profit_year),   icon: FaCalendar,     type: "sales" },
      ],
    },
    {
      id: "platform-revenue",
      title: "Platform Revenue (15%)",
      cards: [
        { id: "pr1", title: "Platform Today Revenue",   value: formatCurrency(data.admin_revenue_today),  icon: FaCalendarDay,  type: "platform" },
        { id: "pr2", title: "Platform Weekly Revenue",  value: formatCurrency(data.admin_revenue_week),   icon: FaCalendarWeek, type: "platform" },
        { id: "pr3", title: "Platform Monthly Revenue", value: formatCurrency(data.admin_revenue_month),  icon: FaCalendarDays, type: "platform" },
        { id: "pr4", title: "Platform Yearly Revenue",  value: formatCurrency(data.admin_revenue_year),   icon: FaCalendar,     type: "platform" },
      ],
    },
  ];

  return (
    <div className="restaurant-detail-page">
      <Container fluid className="py-4 px-3 px-md-4">
        {/* ── Header ── */}
        <div className="restaurant-detail-header mb-4">
          <h2 className="mb-1">Restaurant Stats Dashboard</h2>
          <p className="mb-2 text-muted">
            <strong>{data.restaurant_name}</strong> &nbsp;|&nbsp; Restaurant ID: #{id}
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <span className="badge bg-secondary px-3 py-2">
              Total Orders: {data.total_orders}
            </span>
            <span className="badge bg-success px-3 py-2">
              Total Revenue: {formatCurrency(data.total_revenue)}
            </span>
            <span className="badge bg-warning text-dark px-3 py-2">
              Restaurant Profit (85%): {formatCurrency(data.restaurant_profit)}
            </span>
            <span className="badge px-3 py-2" style={{ background: "#7c3aed", color: "#fff" }}>
              Admin Revenue (15%): {formatCurrency(data.admin_revenue)}
            </span>
          </div>
        </div>

        {/* ── Sections ── */}
        {cardSections.map((section) => (
          <div key={section.id} className="restaurant-detail-section">
            <h5 className="restaurant-detail-section-title">{section.title}</h5>
            <Row className="g-4">
              {section.cards.map((card) => (
                <Col key={card.id} xs={12} sm={6} lg={3}>
                  <StatCard {...card} />
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Container>
    </div>
  );
}