// src/components/financial/ExpenseBreakdownChart.jsx
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#FF6B6B",
  "#6B93FF",
];

const ExpenseBreakdownChart = ({ transactions, startDate, endDate }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Generate data for the chart
    const generateChartData = () => {
      // Filter transactions by date range and only include expenses
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= startDate &&
          transactionDate <= endDate &&
          transaction.type !== "sale" &&
          transaction.type !== "refund"
        );
      });

      // Group expenses by type
      const expensesByType = filteredTransactions.reduce((acc, transaction) => {
        const { type, amount } = transaction;

        if (!acc[type]) {
          acc[type] = 0;
        }

        acc[type] += amount;

        return acc;
      }, {});

      // Convert to chart data format
      const data = Object.entries(expensesByType).map(([type, value]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value,
      }));

      // Sort by value (descending)
      data.sort((a, b) => b.value - a.value);

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
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius="80%"
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [
            `$${value.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            "Amount",
          ]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpenseBreakdownChart;
