// src/components/analytics/TopProductsChart.jsx (updated)
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
import { getProductSalesData } from "../../utils/chartFix";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const TopProductsChart = () => {
  const [chartData, setChartData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    // Get product sales data
    const productData = getProductSalesData();

    // Calculate total
    const total = productData.reduce((sum, product) => sum + product.sales, 0);
    setTotalSales(total);

    // Take top 5 products
    const topProducts = [...productData]
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Calculate 'Other' category for remaining products
    const otherSales = total - topProducts.reduce((sum, p) => sum + p.sales, 0);

    if (otherSales > 0) {
      topProducts.push({
        name: "Other Products",
        sales: otherSales,
        category: "Other",
      });
    }

    setChartData(topProducts);
  }, []);

  // Custom render for the pie chart labels (empty to avoid crowding)
  const renderCustomizedLabel = () => null;

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
              label={renderCustomizedLabel}
              outerRadius="80%"
              fill="#8884d8"
              dataKey="sales"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              formatter={(value, entry, index) => (
                <span style={{ color: COLORS[index % COLORS.length] }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </ChartContainer>
  );
};

export default TopProductsChart;
