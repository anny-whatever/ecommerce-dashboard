// src/components/financial/ProfitMarginChart.jsx
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
  ReferenceLine,
} from "recharts";
import {
  format,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
} from "date-fns";

const ProfitMarginChart = ({ transactions, startDate, endDate }) => {
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

        // Calculate gross profit and margin
        const grossProfit = revenue;
        const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0;

        // Calculate net profit and margin
        const netProfit = revenue - expenses;
        const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

        return {
          name: monthName,
          grossMargin,
          netMargin,
        };
      });

      setChartData(data);
    };

    if (transactions?.length > 0 && startDate && endDate) {
      generateChartData();
    } else {
      // Set empty data if no transactions or dates
      setChartData([]);
    }
  }, [transactions, startDate, endDate]);

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
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, ""]} />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="grossMargin" name="Gross Margin" fill="#0ea5e9" />
        <Bar dataKey="netMargin" name="Net Margin" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProfitMarginChart;
