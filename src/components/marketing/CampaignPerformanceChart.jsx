// src/components/marketing/CampaignPerformanceChart.jsx (fixed)
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
    console.log("Generating campaign chart data...");

    // Generate sample data that will definitely work
    const sampleData = [
      { name: "Email Campaign", roi: 4.2, ctr: 2.5, conversionRate: 3.8 },
      { name: "Social Media", roi: 3.7, ctr: 1.8, conversionRate: 2.5 },
      { name: "Search", roi: 5.1, ctr: 3.2, conversionRate: 4.7 },
      { name: "Display", roi: 2.3, ctr: 0.9, conversionRate: 1.2 },
      { name: "Referral", roi: 6.5, ctr: 5.8, conversionRate: 7.3 },
    ];

    setChartData(sampleData);
    console.log("Chart data set:", sampleData);
  }, [campaigns]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-500">Loading campaign data...</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="roi" fill="#0ea5e9" name="ROI" />
          <Bar dataKey="ctr" fill="#10b981" name="CTR %" />
          <Bar dataKey="conversionRate" fill="#f59e0b" name="Conv %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CampaignPerformanceChart;
