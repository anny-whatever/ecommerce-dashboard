// src/components/financial/RevenueChart.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  format,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const RevenueChart = ({ transactions, startDate, endDate }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate data for the chart
    const generateChartData = () => {
      // Create monthly intervals based on the date range
      const monthsInterval = eachMonthOfInterval({
        start: startDate,
        end: endDate,
      });

      // Generate data for each month
      const data = monthsInterval.map((date) => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        const monthName = format(date, "MMM yyyy");

        // Filter transactions for this month
        const monthTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= monthStart && transactionDate <= monthEnd;
        });

        // Calculate revenue (sales - refunds)
        const sales = monthTransactions
          .filter((t) => t.type === "sale")
          .reduce((sum, t) => sum + t.amount, 0);

        const refunds = monthTransactions
          .filter((t) => t.type === "refund")
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const revenue = sales - refunds;

        // Calculate expenses
        const expenses = monthTransactions
          .filter((t) => t.type !== "sale" && t.type !== "refund")
          .reduce((sum, t) => sum + t.amount, 0);

        // Calculate profit
        const profit = revenue - expenses;

        return {
          name: monthName,
          revenue,
          expenses,
          profit,
        };
      });

      setChartData(data);
    };

    if (transactions?.length > 0 && startDate && endDate) {
      generateChartData();
    }
  }, [transactions, startDate, endDate]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#0ea5e9"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="#ef4444"
          strokeWidth={2}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#10b981"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
