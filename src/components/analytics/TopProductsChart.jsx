// src/components/analytics/TopProductsChart.jsx
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

const TopProductsChart = ({ products, orders }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Calculate top products by sales
    const calculateTopProducts = () => {
      // Create a map to hold product sales data
      const productSalesMap = new Map();

      // Calculate total sales for each product
      orders.forEach((order) => {
        order.items.forEach((item) => {
          const productId = item.product.id;
          const salesAmount = item.total;

          if (productSalesMap.has(productId)) {
            productSalesMap.set(
              productId,
              productSalesMap.get(productId) + salesAmount
            );
          } else {
            productSalesMap.set(productId, salesAmount);
          }
        });
      });

      // Convert map to array and sort by sales
      const productSalesArray = Array.from(productSalesMap.entries()).map(
        ([productId, value]) => {
          const product = products.find((p) => p.id === productId);
          return {
            name: product ? product.name : "Unknown Product",
            value,
          };
        }
      );

      // Sort by sales value (descending)
      productSalesArray.sort((a, b) => b.value - a.value);

      // Take top 5 products
      const topProducts = productSalesArray.slice(0, 5);

      // Calculate 'Other' category if needed
      if (productSalesArray.length > 5) {
        const otherValue = productSalesArray
          .slice(5)
          .reduce((sum, product) => sum + product.value, 0);
        topProducts.push({
          name: "Other Products",
          value: otherValue,
        });
      }

      setChartData(topProducts);
    };

    if (products.length > 0 && orders.length > 0) {
      calculateTopProducts();
    }
  }, [products, orders]);

  return (
    <ResponsiveContainer width="100%" height="100%">
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
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Sales"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TopProductsChart;
