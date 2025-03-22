// src/components/financial/ExpenseBreakdownChart.jsx (updated)
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import ChartContainer from "../common/ChartContainer";
import { getMonthlyChartData } from "../../utils/chartFix";

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
    // Get the monthly data
    const monthlyData = getMonthlyChartData();

    // Combine all expense breakdowns across months
    const combinedExpenses = {};

    monthlyData.forEach((month) => {
      if (month.expenseBreakdown) {
        Object.entries(month.expenseBreakdown).forEach(([type, amount]) => {
          combinedExpenses[type] = (combinedExpenses[type] || 0) + amount;
        });
      }
    });

    // Format for the pie chart
    const formattedData = Object.entries(combinedExpenses).map(
      ([type, value]) => ({
        name: type.charAt(0).toUpperCase() + type.slice(1),
        value,
      })
    );

    // Sort by value (descending)
    formattedData.sort((a, b) => b.value - a.value);

    setChartData(formattedData);
  }, [transactions, startDate, endDate]);

  return (
    <ChartContainer height={320}>
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Amount"]}
            />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default ExpenseBreakdownChart;
