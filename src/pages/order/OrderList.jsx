// src/pages/order/OrderList.jsx
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

const OrderList = () => {
  const { orders, products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    productId: searchParams.get("productId") || "",
  });

  // Get unique statuses for filter
  const statuses = [...new Set(orders.map((order) => order.status))];

  // Apply filters and search
  useEffect(() => {
    let result = [...orders];

    // Apply search
    if (debouncedSearchTerm) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(lowerSearchTerm) ||
          order.customer.name.toLowerCase().includes(lowerSearchTerm) ||
          order.customer.email.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((order) => order.status === filters.status);
    }

    // Apply date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter((order) => new Date(order.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      result = result.filter((order) => new Date(order.createdAt) <= toDate);
    }

    // Apply amount filters
    if (filters.minAmount) {
      result = result.filter(
        (order) => order.total >= parseFloat(filters.minAmount)
      );
    }

    if (filters.maxAmount) {
      result = result.filter(
        (order) => order.total <= parseFloat(filters.maxAmount)
      );
    }

    // Apply product filter
    if (filters.productId) {
      result = result.filter((order) =>
        order.items.some((item) => item.product.id === filters.productId)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (sortConfig.key === "createdAt") {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortConfig.key === "customer") {
          const nameA = a.customer.name.toLowerCase();
          const nameB = b.customer.name.toLowerCase();
          if (nameA < nameB) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (nameA > nameB) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      });
    }

    setFilteredOrders(result);
  }, [orders, debouncedSearchTerm, sortConfig, filters]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredOrders, 10);

  // Handle sort
  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  // Reset filters
  const handleResetFilters = () => {
    const productId = filters.productId; // Keep product filter if it came from URL
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      productId,
    });
  };

  // Get status color
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex w-full md:w-auto mb-4 md:mb-0">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-md border-gray-300 pl-10 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Search orders..."
                />
              </div>

              <button
                type="button"
                className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                {Object.values(filters).some(
                  (val) => val !== "" && val !== false
                ) && (
                  <span className="ml-1 text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <span>
                Showing {paginatedData.length} of {filteredOrders.length} orders
              </span>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">Filters</h3>
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-gray-700"
                  onClick={handleResetFilters}
                >
                  Reset filters
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dateFrom"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date From
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters({ ...filters, dateFrom: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="dateTo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date To
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters({ ...filters, dateTo: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="minAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Min Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="minAmount"
                      value={filters.minAmount}
                      onChange={(e) =>
                        setFilters({ ...filters, minAmount: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="maxAmount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Max Amount
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="maxAmount"
                      value={filters.maxAmount}
                      onChange={(e) =>
                        setFilters({ ...filters, maxAmount: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 pl-7 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {filters.productId && (
                  <div>
                    <label
                      htmlFor="product"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Product
                    </label>
                    <div className="mt-1">
                      <div className="block w-full rounded-md border border-gray-300 bg-gray-100 py-2 px-3 text-sm text-gray-700">
                        {products.find((p) => p.id === filters.productId)
                          ?.name || "Unknown Product"}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {Object.values(filters).some(
                (val) => val !== "" && val !== false
              ) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.status && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Status: {filters.status}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, status: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.dateFrom && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      From: {filters.dateFrom}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, dateFrom: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.dateTo && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      To: {filters.dateTo}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, dateTo: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.minAmount && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Min Amount: ${filters.minAmount}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({ ...filters, minAmount: "" })
                        }
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.maxAmount && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Max Amount: ${filters.maxAmount}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({ ...filters, maxAmount: "" })
                        }
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.productId && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Product:{" "}
                      {products.find((p) => p.id === filters.productId)?.name ||
                        "Unknown"}
                      <button
                        type="button"
                        onClick={() => {
                          setFilters({ ...filters, productId: "" });
                          setSearchParams({});
                        }}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    Order ID
                    {sortConfig.key === "id" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    Date
                    {sortConfig.key === "createdAt" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center">
                    Customer
                    {sortConfig.key === "customer" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortConfig.key === "status" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Total
                    {sortConfig.key === "total" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 ml-1" />
                      ))}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.map((order) => (
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
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {order.customer.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
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
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/orders/${order.id}/edit`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}

              {paginatedData.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:block">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * 10 + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * 10, filteredOrders.length)}
                </span>{" "}
                of <span className="font-medium">{filteredOrders.length}</span>{" "}
                results
              </p>
            </div>
            <div className="flex flex-1 justify-between sm:justify-end">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="hidden md:flex mx-2 items-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                        page === currentPage
                          ? "bg-primary-50 text-primary-600 border border-primary-500"
                          : "text-gray-700 hover:bg-gray-50"
                      } mx-1 rounded-md`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};

export default OrderList;
