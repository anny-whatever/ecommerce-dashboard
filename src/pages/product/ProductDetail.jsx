// src/pages/product/ProductDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  StarIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, orders, deleteProduct } = useStore();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [productOrders, setProductOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Find the product by ID
    const findProduct = () => {
      setLoading(true);

      const foundProduct = products.find((p) => p.id === id);

      if (foundProduct) {
        setProduct(foundProduct);

        // Find related products (same category)
        const related = products
          .filter(
            (p) =>
              p.category === foundProduct.category && p.id !== foundProduct.id
          )
          .slice(0, 4);
        setRelatedProducts(related);

        // Find orders containing this product
        const relatedOrders = orders.filter((order) =>
          order.items.some((item) => item.product.id === foundProduct.id)
        );
        setProductOrders(relatedOrders);
      }

      setLoading(false);
    };

    if (products.length > 0) {
      findProduct();
    }
  }, [id, products, orders]);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteProduct(id);
      navigate("/products");
    } else {
      setConfirmDelete(true);
    }
  };

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

  // Calculate profit margin
  const calculateMargin = () => {
    if (!product) return { amount: 0, percentage: 0 };

    const amount = product.price - product.cost;
    const percentage = (amount / product.price) * 100;

    return {
      amount,
      percentage: parseFloat(percentage.toFixed(2)),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Product not found</h2>
        <p className="mt-2 text-sm text-gray-500">
          The product you are looking for does not exist or has been removed.
        </p>
        <div className="mt-4">
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-500"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const margin = calculateMargin();
  const stockStatus = getStockStatus(product.stock);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Products
        </button>

        <div className="flex space-x-3">
          <Link to={`/products/${id}/edit`} className="btn-secondary">
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>

          <button type="button" onClick={handleDelete} className="btn-danger">
            <TrashIcon className="h-5 w-5 mr-2" />
            {confirmDelete ? "Confirm Delete" : "Delete"}
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 p-6 flex justify-center items-center bg-gray-100 md:w-1/3">
            {product.images && product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain max-h-64"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gray-200 text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>

                <div className="mt-2 flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <span key={rating}>
                      {product.rating > rating ? (
                        <StarIconSolid className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <StarIcon className="h-5 w-5 text-gray-300" />
                      )}
                    </span>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">
                    {product.rating} / 5 ({product.salesCount} sales)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  $
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Cost: $
                  {product.cost.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="mt-1 text-sm font-medium text-green-600">
                  Margin: $
                  {margin.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  ({margin.percentage}%)
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-500">
                {product.description}
              </p>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Inventory
                  </h3>
                  <div className="mt-2 flex items-center">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${stockStatus.className}`}
                    >
                      {stockStatus.text}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      {product.stock} units
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">SKU</h3>
                  <p className="mt-2 text-sm text-gray-500">{product.sku}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Last Updated
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {product.specifications && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-900">
                  Specifications
                </h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="text-sm">
                        <span className="font-medium text-gray-500">
                          {key}:{" "}
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Customer
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productOrders.slice(0, 5).map((order) => {
                const orderItem = order.items.find(
                  (item) => item.product.id === product.id
                );

                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                      <Link
                        to={`/orders/${order.id}`}
                        className="hover:underline"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {orderItem?.quantity || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $
                      {(orderItem?.total || 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5
                        ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-purple-100 text-purple-800"
                            : order.status === "processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {productOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-sm text-center text-gray-500"
                  >
                    No orders found for this product
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {productOrders.length > 5 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Link
                to={`/orders?productId=${product.id}`}
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all orders
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Related Products
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    {relatedProduct.images && relatedProduct.images[0] ? (
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <Link
                      to={`/products/${relatedProduct.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-primary-600"
                    >
                      {relatedProduct.name}
                    </Link>

                    <p className="mt-1 text-sm text-gray-500">
                      {relatedProduct.category}
                    </p>

                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">
                        $
                        {relatedProduct.price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>

                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          getStockStatus(relatedProduct.stock).className
                        }`}
                      >
                        {relatedProduct.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
