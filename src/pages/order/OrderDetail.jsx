// src/pages/order/OrderDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, deleteOrder, updateOrder } = useStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Find the order by ID
    const findOrder = () => {
      setLoading(true);

      const foundOrder = orders.find((o) => o.id === id);
      setOrder(foundOrder);

      setLoading(false);
    };

    if (orders.length > 0) {
      findOrder();
    }
  }, [id, orders]);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteOrder(id);
      navigate("/orders");
    } else {
      setConfirmDelete(true);
    }
  };

  const handleStatusChange = (newStatus) => {
    if (!order) return;

    const updatedOrder = {
      ...order,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    // Add shipped or delivered date if applicable
    if (newStatus === "shipped" && !order.shippedAt) {
      updatedOrder.shippedAt = new Date().toISOString();
    }

    if (newStatus === "delivered" && !order.deliveredAt) {
      updatedOrder.deliveredAt = new Date().toISOString();
    }

    updateOrder(updatedOrder);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Determine available next status options
  const getNextStatusOptions = () => {
    if (!order) return [];

    switch (order.status) {
      case "pending":
        return ["processing", "cancelled"];
      case "processing":
        return ["shipped", "cancelled"];
      case "shipped":
        return ["delivered", "cancelled"];
      case "delivered":
        return ["refunded"];
      case "cancelled":
        return ["refunded"];
      case "refunded":
        return [];
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Order not found</h2>
        <p className="mt-2 text-sm text-gray-500">
          The order you are looking for does not exist or has been removed.
        </p>
        <div className="mt-4">
          <Link
            to="/orders"
            className="text-primary-600 hover:text-primary-500"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Orders
        </button>

        <div className="flex space-x-3">
          <Link to={`/orders/${id}/edit`} className="btn-secondary">
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>

          <button type="button" onClick={handleDelete} className="btn-danger">
            <TrashIcon className="h-5 w-5 mr-2" />
            {confirmDelete ? "Confirm Delete" : "Delete"}
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-medium text-gray-900">
            Order {order.id}
          </h2>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
              <p className="mt-1 text-sm text-gray-900">
                {format(new Date(order.createdAt), "MMMM d, yyyy h:mm a")}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Payment Method
              </h3>
              <p className="mt-1 text-sm text-gray-900">
                {order.paymentMethod
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Total Amount
              </h3>
              <p className="mt-1 text-sm font-medium text-gray-900">
                $
                {order.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900">
              Order Timeline
            </h3>
            <div className="mt-4 flow-root">
              <ul className="-mb-8">
                <li>
                  <div className="relative pb-8">
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    ></span>
                    <div className="relative flex space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center ring-8 ring-white">
                        <svg
                          className="h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">Order placed</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          <time dateTime={order.createdAt}>
                            {format(new Date(order.createdAt), "MMM d, yyyy")}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {order.status !== "pending" && (
                  <li>
                    <div className="relative pb-8">
                      {order.status !== "processing" && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                      )}
                      <div className="relative flex space-x-3">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                          <svg
                            className="h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Processing</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <time dateTime={order.updatedAt}>
                              {format(new Date(order.updatedAt), "MMM d, yyyy")}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}

                {(order.status === "shipped" ||
                  order.status === "delivered") && (
                  <li>
                    <div className="relative pb-8">
                      {order.status !== "shipped" && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        ></span>
                      )}
                      <div className="relative flex space-x-3">
                        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                          <TruckIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Shipped</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <time dateTime={order.shippedAt}>
                              {format(
                                new Date(order.shippedAt || order.updatedAt),
                                "MMM d, yyyy"
                              )}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}

                {order.status === "delivered" && (
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                          <CheckCircleIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">Delivered</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <time dateTime={order.deliveredAt}>
                              {format(
                                new Date(order.deliveredAt || order.updatedAt),
                                "MMM d, yyyy"
                              )}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}

                {(order.status === "cancelled" ||
                  order.status === "refunded") && (
                  <li>
                    <div className="relative">
                      <div className="relative flex space-x-3">
                        <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center ring-8 ring-white">
                          <XCircleIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {order.status === "cancelled"
                                ? "Cancelled"
                                : "Refunded"}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <time dateTime={order.updatedAt}>
                              {format(new Date(order.updatedAt), "MMM d, yyyy")}
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Status Actions */}
          {getNextStatusOptions().length > 0 && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900">
                Update Status
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {getNextStatusOptions().map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleStatusChange(status)}
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium
                      ${
                        status === "delivered" || status === "shipped"
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : status === "cancelled" || status === "refunded"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                  >
                    Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Customer Information
            </h3>
          </div>

          <div className="p-6">
            <div className="text-sm">
              <h4 className="font-medium text-gray-900">
                {order.customer.name}
              </h4>
              <p className="mt-1 text-gray-500">{order.customer.email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Shipping Address
            </h3>
          </div>

          <div className="p-6">
            <div className="text-sm">
              <p className="text-gray-900">{order.customer.name}</p>
              <p className="mt-1 text-gray-500">
                {order.shippingAddress.street}
              </p>
              <p className="text-gray-500">
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.zipCode}
              </p>
              <p className="text-gray-500">{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-6 pr-3 text-left text-sm font-semibold text-gray-900"
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
                  Price
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Quantity
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-primary-600">
                    <Link
                      to={`/products/${item.product.id}`}
                      className="hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.product.sku}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    $
                    {item.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    $
                    {item.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-200">
                <th
                  scope="row"
                  colSpan="4"
                  className="hidden pt-4 pl-6 pr-3 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Subtotal
                </th>
                <th
                  scope="row"
                  className="pt-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:hidden"
                >
                  Subtotal
                </th>
                <td className="pt-4 pl-3 pr-6 text-right text-sm text-gray-500">
                  $
                  {order.subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colSpan="4"
                  className="hidden pt-4 pl-6 pr-3 text-right text-sm font-normal text-gray-500 sm:table-cell"
                >
                  Tax
                </th>
                <th
                  scope="row"
                  className="pt-4 pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Tax
                </th>
                <td className="pt-4 pl-3 pr-6 text-right text-sm text-gray-500">
                  $
                  {order.tax.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colSpan="4"
                  className="hidden pt-4 pl-6 pr-3 text-right text-sm font-normal text-gray-500 sm:table-cell"
                >
                  Shipping
                </th>
                <th
                  scope="row"
                  className="pt-4 pl-4 pr-3 text-left text-sm font-normal text-gray-500 sm:hidden"
                >
                  Shipping
                </th>
                <td className="pt-4 pl-3 pr-6 text-right text-sm text-gray-500">
                  $
                  {order.shipping.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  colSpan="4"
                  className="hidden pt-4 pl-6 pr-3 text-right text-sm font-semibold text-gray-900 sm:table-cell"
                >
                  Total
                </th>
                <th
                  scope="row"
                  className="pt-4 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:hidden"
                >
                  Total
                </th>
                <td className="pt-4 pl-3 pr-6 text-right text-sm font-semibold text-gray-900">
                  $
                  {order.total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
