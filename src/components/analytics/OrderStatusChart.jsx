// src/components/analytics/OrderStatusChart.jsx
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OrderStatusChart = ({ orders }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Calculate orders by status
    const calculateOrdersByStatus = () => {
      // Count orders by status
      const statusCounts = orders.reduce((counts, order) => {
        const status = order.status;
        counts[status] = (counts[status] || 0) + 1;
        return counts;
      }, {});

      // Format for chart data
      const data = Object.entries(statusCounts).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1),
        count,
      }));

      // Sort by count (descending)
      data.sort((a, b) => b.count - a.count);

      setChartData(data);
    };

    if (orders.length > 0) {
      calculateOrdersByStatus();
    }
  }, [orders]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Orders" fill="#0ea5e9" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrderStatusChart;
