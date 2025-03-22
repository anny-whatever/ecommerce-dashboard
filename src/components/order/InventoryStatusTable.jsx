// src/components/product/InventoryStatusTable.jsx
import { Link } from "react-router-dom";

const InventoryStatusTable = ({ products }) => {
  const getStockStatus = (stockLevel) => {
    if (stockLevel <= 0) {
      return {
        text: "Out of Stock",
        className: "bg-red-100 text-red-800",
      };
    } else if (stockLevel <= 5) {
      return {
        text: "Low Stock",
        className: "bg-yellow-100 text-yellow-800",
      };
    } else if (stockLevel <= 20) {
      return {
        text: "Medium Stock",
        className: "bg-blue-100 text-blue-800",
      };
    } else {
      return {
        text: "In Stock",
        className: "bg-green-100 text-green-800",
      };
    }
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
            >
              Product
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              SKU
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Price
            </th>
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Stock
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);

            return (
              <tr key={product.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                  <Link to={`/products/${product.id}`}>{product.name}</Link>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {product.sku}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  $
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${stockStatus.className}`}
                  >
                    {stockStatus.text} ({product.stock})
                  </span>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td
                colSpan="5"
                className="py-4 text-center text-sm text-gray-500"
              >
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryStatusTable;
