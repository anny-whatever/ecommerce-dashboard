// src/components/financial/ProfitMarginChart.jsx (updated)
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
import ChartContainer from "../common/ChartContainer";
import { getMonthlyChartData } from "../../utils/chartFix";

const ProfitMarginChart = ({ transactions, startDate, endDate }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Get pre-calculated data
    const monthlyData = getMonthlyChartData();
    setChartData(monthlyData);
  }, [transactions, startDate, endDate]);

  return (
    <ChartContainer height={320}>
      {chartData.length > 0 && (
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
            <YAxis
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              domain={[0, 100]}
            />
            <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, ""]} />
            <Legend />
            <ReferenceLine y={0} stroke="#000" />
            <Bar dataKey="grossMargin" name="Gross Margin" fill="#0ea5e9" />
            <Bar dataKey="netMargin" name="Net Margin" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default ProfitMarginChart;
