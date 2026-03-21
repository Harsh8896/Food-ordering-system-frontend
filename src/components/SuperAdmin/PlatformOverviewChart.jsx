import React, { useState, useEffect } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import StatCard from './StatCard';

const BASE_URL = 'http://127.0.0.1:8000/api';

const PlatformOverviewChart = () => {
  const [viewMode, setViewMode] = useState('both');
  const [monthlyData, setMonthlyData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // restaurant_id null check — 'null' string bhi handle karo
        const rid = localStorage.getItem('restaurantId');
        const validRid = rid && rid !== 'null' ? rid : null;

        // metrics URL — restaurant_id sirf tab bhejo jab valid ho
        const metricsUrl = validRid
          ? `${BASE_URL}/dashboard_metrics/?restaurant_id=${validRid}`
          : `${BASE_URL}/dashboard_metrics/`;

        const [salesRes, metricsRes] = await Promise.all([
          fetch(`${BASE_URL}/monthly_sales_summary/`),
          fetch(metricsUrl),
        ]);

        const salesData = await salesRes.json();
        const metricsData = await metricsRes.json();

        const formatted = salesData.map(item => ({
          month: item.month,
          revenue: parseFloat(item.sales) || 0,
          orders: 0,
        }));

        setMonthlyData(formatted);
        setMetrics(metricsData);
      } catch (err) {
        console.error('Chart data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const currentMonthOrders = metrics?.total_orders || 0;

  if (loading) {
    return <p className="text-muted mt-3">Loading chart...</p>;
  }

  return (
    <div className="platform-overview-section mt-4">
      <div className="section-header-inline" style={{ marginBottom: '20px' }}>
        <h2>Platform Overview</h2>
        <ButtonGroup size="sm">
          <Button
            variant={viewMode === 'revenue' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('revenue')}
          >
            Revenue View
          </Button>
          <Button
            variant={viewMode === 'orders' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('orders')}
          >
            Orders View
          </Button>
          <Button
            variant={viewMode === 'both' ? 'primary' : 'outline-primary'}
            onClick={() => setViewMode('both')}
          >
            Both
          </Button>
        </ButtonGroup>
      </div>

      {/* Chart */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                yAxisId="left"
                label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: 'Orders', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                formatter={(value) =>
                  value > 1000 ? `$${value.toLocaleString()}` : value.toLocaleString()
                }
              />
              <Legend />
              {(viewMode === 'revenue' || viewMode === 'both') && (
                <Bar yAxisId="left" dataKey="revenue" fill="#0d6efd" name="Revenue ($)" />
              )}
              {(viewMode === 'orders' || viewMode === 'both') && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#198754"
                  name="Orders"
                  strokeWidth={2}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted text-center py-5">
            Koi data nahi mila — pehle kuch orders place karo
          </p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="stats-grid">
        <StatCard
          title="Total Platform Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon="💵"
          color="primary"
          trend="Month sales total"
        />
        <StatCard
          title="Total Orders"
          value={currentMonthOrders.toLocaleString()}
          icon="📦"
          color="success"
          trend={`Delivered: ${metrics?.food_delivered || 0}`}
        />
        <StatCard
          title="Total Users"
          value={metrics?.total_users || 0}
          icon="👥"
          color="info"
          trend={`New orders: ${metrics?.new_orders || 0}`}
        />
      </div>
    </div>
  );
};

export default PlatformOverviewChart;