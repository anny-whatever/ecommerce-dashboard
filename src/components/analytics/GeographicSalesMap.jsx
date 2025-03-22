// src/components/analytics/GeographicSalesMap.jsx
import { useState, useEffect } from "react";

// A simplified version of a geographic sales map
// In a real implementation, this would use a mapping library like react-map-gl
const GeographicSalesMap = ({ orders }) => {
  const [regionData, setRegionData] = useState([]);

  useEffect(() => {
    // Calculate sales by region
    const calculateSalesByRegion = () => {
      // Group orders by region (state)
      const regionSales = orders.reduce((sales, order) => {
        const state = order.shippingAddress?.state;
        if (!state) return sales;

        if (sales[state]) {
          sales[state] += order.total;
        } else {
          sales[state] = order.total;
        }

        return sales;
      }, {});

      // Convert to array and sort
      const data = Object.entries(regionSales).map(([region, total]) => ({
        region,
        total,
      }));

      // Sort by total (descending)
      data.sort((a, b) => b.total - a.total);

      setRegionData(data);
    };

    if (orders.length > 0) {
      calculateSalesByRegion();
    }
  }, [orders]);

  // Simplified representation - would be a map in real implementation
  return (
    <div className="h-full flex flex-col">
      <div className="text-center italic text-sm text-gray-500 mb-2">
        This would be an interactive map in a real implementation
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Region
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Sales Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {regionData.map((region, index) => (
              <tr key={index}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {region.region}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  $
                  {region.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
            {regionData.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="py-4 text-center text-sm text-gray-500"
                >
                  No regional data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeographicSalesMap;
