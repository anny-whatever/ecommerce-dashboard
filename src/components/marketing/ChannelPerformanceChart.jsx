// src/components/marketing/ChannelPerformanceChart.jsx (updated)
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
import { getMarketingCampaigns } from "../../utils/chartFix";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const ChannelPerformanceChart = ({ campaignsByType }) => {
  const [chartData, setChartData] = useState([]);
  const [chartMetric, setChartMetric] = useState("conversions"); // Default metric

  useEffect(() => {
    // Use provided data or get from storage
    let campaigns;
    if (campaignsByType && Object.keys(campaignsByType).length > 0) {
      campaigns = campaignsByType;
    } else {
      // Get all campaigns
      const allCampaigns = getMarketingCampaigns();

      // Group by type
      campaigns = allCampaigns.reduce((acc, campaign) => {
        if (!acc[campaign.type]) {
          acc[campaign.type] = [];
        }
        acc[campaign.type].push(campaign);
        return acc;
      }, {});
    }

    // Calculate metrics for each channel type
    const data = Object.entries(campaigns).map(([type, typeCampaigns]) => {
      // Sum up the performance metrics
      const impressions = typeCampaigns.reduce(
        (sum, campaign) => sum + campaign.performance.impressions,
        0
      );
      const clicks = typeCampaigns.reduce(
        (sum, campaign) => sum + campaign.performance.clicks,
        0
      );
      const conversions = typeCampaigns.reduce(
        (sum, campaign) => sum + campaign.performance.conversions,
        0
      );
      const spent = typeCampaigns.reduce(
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
      <div className="flex justify-end mb-4">
        <select
          value={chartMetric}
          onChange={handleMetricChange}
          className="py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
        >
          <option value="conversions">Conversions</option>
          <option value="clicks">Clicks</option>
          <option value="impressions">Impressions</option>
          <option value="spent">Spend</option>
        </select>
      </div>

      <ChartContainer height={280}>
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
        )}
      </ChartContainer>
    </div>
  );
};

export default ChannelPerformanceChart;
