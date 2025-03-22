// src/components/user/CustomerSummaryChart.jsx
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Label,
} from "recharts";

const COLORS = ["#0088FE", "#FFBB28", "#00C49F", "#FF8042"];

const CustomerSummaryChart = ({ customers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("status"); // 'status' or 'spending'
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!customers || customers.length === 0) return;

    if (selectedMetric === "status") {
      // Group customers by status
      const statusCounts = customers.reduce((acc, customer) => {
        const status = customer.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Convert to chart data format
      const data = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: count,
      }));

      setChartData(data);
    } else {
      // Group customers by spending levels
      const spendingLevels = {
        "High Value (>$1000)": customers.filter((c) => c.totalSpent > 1000)
          .length,
        "Medium Value ($500-$1000)": customers.filter(
          (c) => c.totalSpent >= 500 && c.totalSpent <= 1000
        ).length,
        "Low Value ($100-$499)": customers.filter(
          (c) => c.totalSpent >= 100 && c.totalSpent < 500
        ).length,
        "Minimal (<$100)": customers.filter((c) => c.totalSpent < 100).length,
      };

      // Convert to chart data format
      const data = Object.entries(spendingLevels).map(([level, count]) => ({
        name: level,
        value: count,
      }));

      setChartData(data);
    }
  }, [customers, selectedMetric]);

  const handleMetricChange = (e) => {
    setSelectedMetric(e.target.value);
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex justify-end">
        <select
          value={selectedMetric}
          onChange={handleMetricChange}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="status">Customer Status</option>
          <option value="spending">Customer Spending</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              position="center"
              content={() => (
                <text
                  x="50%"
                  y="50%"
                  fill="#333"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {selectedMetric === "status" ? "Status" : "Spending"}
                </text>
              )}
            />
          </Pie>
          <Tooltip formatter={(value, name) => [value, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerSummaryChart;
