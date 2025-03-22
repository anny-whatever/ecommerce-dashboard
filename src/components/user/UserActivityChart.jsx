// src/components/user/UserActivityChart.jsx (updated)
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
import ChartContainer from "../common/ChartContainer";
import { getUserActivityData } from "../../utils/chartFix";

const UserActivityChart = ({ customers }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Use pre-calculated user activity data
    const data = getUserActivityData();
    setChartData(data);
  }, [customers]);

  return (
    <ChartContainer height={280}>
      {chartData.length > 0 && (
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
            <Bar
              dataKey="activeCustomers"
              name="Active Customers"
              fill="#00C49F"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default UserActivityChart;
