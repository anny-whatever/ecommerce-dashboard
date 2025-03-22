// src/components/user/UserActivityChart.jsx
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
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
} from "date-fns";

const UserActivityChart = ({ customers }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!customers || customers.length === 0) return;

    // Generate data for the past 6 months
    const today = new Date();
    const sixMonthsAgo = subMonths(today, 5);

    // Create an array of month intervals
    const monthIntervals = eachMonthOfInterval({
      start: sixMonthsAgo,
      end: today,
    });

    // Build chart data
    const data = monthIntervals.map((date) => {
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthLabel = format(date, "MMM yyyy");

      // Count new customers
      const newCustomers = customers.filter((customer) => {
        const createdDate = new Date(customer.createdAt);
        return createdDate >= monthStart && createdDate <= monthEnd;
      }).length;

      // Count active customers (made a purchase in this month)
      const activeCustomers = customers.filter((customer) => {
        const lastPurchaseDate = new Date(customer.lastPurchase);
        return lastPurchaseDate >= monthStart && lastPurchaseDate <= monthEnd;
      }).length;

      return {
        name: monthLabel,
        newCustomers,
        activeCustomers,
      };
    });

    setChartData(data);
  }, [customers]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="newCustomers" name="New Customers" fill="#0088FE" />
        <Bar dataKey="activeCustomers" name="Active Customers" fill="#00C49F" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UserActivityChart;
