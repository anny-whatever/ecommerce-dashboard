// src/pages/user/UserDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { format } from "date-fns";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, orders, deleteCustomer } = useStore();
  const [customer, setCustomer] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    // Find the customer by ID
    const findCustomer = () => {
      setLoading(true);

      const foundCustomer = customers.find((c) => c.id === id);
      setCustomer(foundCustomer);

      // Find orders for this customer
      if (foundCustomer) {
        const relatedOrders = orders.filter(
          (order) => order.customer && order.customer.id === foundCustomer.id
        );
        setCustomerOrders(relatedOrders);
      }

      setLoading(false);
    };

    if (customers.length > 0 && orders.length > 0) {
      findCustomer();
    }
  }, [id, customers, orders]);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteCustomer(id);
      navigate("/users");
    } else {
      setConfirmDelete(true);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get order status color
  const getOrderStatusColor = (status) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">
          Customer not found
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          The customer you are looking for does not exist or has been removed.
        </p>
        <div className="mt-4">
          <Link to="/users" className="text-primary-600 hover:text-primary-500">
            Back to Users
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
          onClick={() => navigate("/users")}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back to Users
        </button>

        <div className="flex space-x-3">
          <Link to={`/users/${id}/edit`} className="btn-secondary">
            <PencilIcon className="h-5 w-5 mr-2" />
            Edit
          </Link>

          <button type="button" onClick={handleDelete} className="btn-danger">
            <TrashIcon className="h-5 w-5 mr-2" />
            {confirmDelete ? "Confirm Delete" : "Delete"}
          </button>
        </div>
      </div>

      {/* Customer Profile */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-medium text-gray-900">
            Customer Profile
          </h2>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(
              customer.status
            )}`}
          >
            {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
          </span>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                {customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900">
                {customer.name}
              </h3>

              <div className="mt-2 text-sm text-gray-500">
                <div className="flex items-center mt-1">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  <span>{customer.email}</span>
                </div>

                <div className="flex items-center mt-1">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  <span>{customer.phone}</span>
                </div>

                <div className="flex items-start mt-1">
                  <MapPinIcon className="h-5 w-5 mr-2 mt-0.5" />
                  <div>
                    <div>{customer.address.street}</div>
                    <div>
                      {customer.address.city}, {customer.address.state}{" "}
                      {customer.address.zipCode}
                    </div>
                    <div>{customer.address.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Member Since
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(customer.createdAt), "MMMM d, yyyy")}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Last Purchase
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {format(new Date(customer.lastPurchase), "MMMM d, yyyy")}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Total Orders
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {customer.totalOrders}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Total Spent
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  $
                  {customer.totalSpent.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </dd>
              </div>

              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Average Order Value
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  $
                  {customer.totalOrders > 0
                    ? (
                        customer.totalSpent / customer.totalOrders
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Customer Orders */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Order History</h3>
            <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Total
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 pr-6"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {customerOrders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                    <Link
                      to={`/orders/${order.id}`}
                      className="hover:underline"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getOrderStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    $
                    {order.total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.items.length}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-right pr-6">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}

              {customerOrders.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No orders found for this customer
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
