// src/components/analytics/RevenueChart.jsx (updated)
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
import ChartContainer from "../common/ChartContainer";
import { getMonthlyChartData } from "../../utils/chartFix";

const RevenueChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Use pre-calculated monthly data
    setChartData(getMonthlyChartData());
  }, []);

  return (
    <ChartContainer height={320}>
      {chartData.length > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, ""]}
            />
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
              dataKey="profit"
              stroke="#10b981"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#f59e0b"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="refunds"
              stroke="#ef4444"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default RevenueChart;
