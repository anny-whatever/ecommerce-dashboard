import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ChannelPerformanceChart = ({ campaignsByType }) => {
  const [chartData, setChartData] = useState([]);
  const [chartMetric, setChartMetric] = useState("conversions"); // Default metric

  useEffect(() => {
    if (!campaignsByType || Object.keys(campaignsByType).length === 0) {
      return;
    }

    // Calculate metrics for each channel type
    const data = Object.entries(campaignsByType).map(([type, campaigns]) => {
      // Sum up the performance metrics
      const impressions = campaigns.reduce(
        (sum, campaign) => sum + campaign.performance.impressions,
        0
      );
      const clicks = campaigns.reduce(
        (sum, campaign) => sum + campaign.performance.clicks,
        0
      );
      const conversions = campaigns.reduce(
        (sum, campaign) => sum + campaign.performance.conversions,
        0
      );
      const spent = campaigns.reduce(
        (sum, campaign) => sum + campaign.spent,
        0
      );

      // Display name for the channel
      const displayName = type
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return {
        name: displayName,
        impressions,
        clicks,
        conversions,
        spent,
        type,
      };
    });

    setChartData(data);
  }, [campaignsByType]);

  // Handle metric change
  const handleMetricChange = (e) => {
    setChartMetric(e.target.value);
  };

  return (
    <div className="h-full">
      <div className="mb-4 flex justify-end">
        <select
          value={chartMetric}
          onChange={handleMetricChange}
          className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="conversions">Conversions</option>
          <option value="clicks">Clicks</option>
          <option value="impressions">Impressions</option>
          <option value="spent">Spend</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
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
            dataKey={chartMetric}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              const formattedValue =
                chartMetric === "spent"
                  ? `$${value.toLocaleString()}`
                  : value.toLocaleString();
              return [formattedValue, props.payload.name];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChannelPerformanceChart;
