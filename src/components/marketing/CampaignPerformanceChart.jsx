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

const CampaignPerformanceChart = ({ campaigns }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!campaigns || campaigns.length === 0) {
      return;
    }

    // Get top 5 campaigns by ROI
    const topCampaigns = [...campaigns]
      .sort((a, b) => b.performance.roi - a.performance.roi)
      .slice(0, 5);

    // Prepare data for the chart
    const data = topCampaigns.map((campaign) => {
      // Calculate CTR and conversion rate
      const ctr =
        campaign.performance.impressions > 0
          ? (campaign.performance.clicks / campaign.performance.impressions) *
            100
          : 0;

      const conversionRate =
        campaign.performance.clicks > 0
          ? (campaign.performance.conversions / campaign.performance.clicks) *
            100
          : 0;

      // Short name for display
      const shortName =
        campaign.name.length > 20
          ? campaign.name.substring(0, 20) + "..."
          : campaign.name;

      return {
        name: shortName,
        roi: campaign.performance.roi,
        ctr,
        conversionRate,
        id: campaign.id,
      };
    });

    setChartData(data);
  }, [campaigns]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip
          formatter={(value, name) => {
            if (name === "roi") {
              return [`${value.toFixed(2)}x`, "ROI"];
            }
            return [
              `${value.toFixed(2)}%`,
              name === "ctr" ? "CTR" : "Conversion Rate",
            ];
          }}
        />
        <Legend />
        <Bar dataKey="roi" fill="#0ea5e9" name="ROI" />
        <Bar dataKey="ctr" fill="#10b981" name="CTR" />
        <Bar dataKey="conversionRate" fill="#f59e0b" name="Conversion Rate" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CampaignPerformanceChart;
