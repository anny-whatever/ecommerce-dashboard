// src/pages/user/UserManagement.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../hooks/useStore";
import { usePagination } from "../../hooks/usePagination";
import { useDebounce } from "../../hooks/useDebounce";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import CustomerSummaryChart from "../../components/user/CustomerSummaryChart";
import UserActivityChart from "../../components/user/UserActivityChart";

const UserManagement = () => {
  const { customers } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: "lastPurchase",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    minSpent: "",
    maxSpent: "",
    minOrders: "",
    maxOrders: "",
  });

  // Apply filters and search
  useEffect(() => {
    let result = [...customers];

    // Apply search
    if (debouncedSearchTerm) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (customer) =>
          customer.name.toLowerCase().includes(lowerSearchTerm) ||
          customer.email.toLowerCase().includes(lowerSearchTerm) ||
          customer.phone.toLowerCase().includes(lowerSearchTerm)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((customer) => customer.status === filters.status);
    }

    // Apply total spent filters
    if (filters.minSpent) {
      result = result.filter(
        (customer) => customer.totalSpent >= parseFloat(filters.minSpent)
      );
    }

    if (filters.maxSpent) {
      result = result.filter(
        (customer) => customer.totalSpent <= parseFloat(filters.maxSpent)
      );
    }

    // Apply order count filters
    if (filters.minOrders) {
      result = result.filter(
        (customer) => customer.totalOrders >= parseInt(filters.minOrders)
      );
    }

    if (filters.maxOrders) {
      result = result.filter(
        (customer) => customer.totalOrders <= parseInt(filters.maxOrders)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (
          sortConfig.key === "lastPurchase" ||
          sortConfig.key === "createdAt"
        ) {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
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

    setFilteredCustomers(result);
  }, [customers, debouncedSearchTerm, sortConfig, filters]);

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage,
  } = usePagination(filteredCustomers, 10);

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
    setFilters({
      status: "",
      minSpent: "",
      maxSpent: "",
      minOrders: "",
      maxOrders: "",
    });
  };

  // Calculate customer metrics
  const calculateMetrics = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(
      (c) => c.status === "active"
    ).length;
    const inactiveCustomers = customers.filter(
      (c) => c.status === "inactive"
    ).length;
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);

    const avgSpentPerCustomer =
      totalCustomers > 0 ? totalSpent / totalCustomers : 0;
    const avgOrdersPerCustomer =
      totalCustomers > 0 ? totalOrders / totalCustomers : 0;

    return {
      totalCustomers,
      activeCustomers,
      inactiveCustomers,
      totalSpent,
      avgSpentPerCustomer,
      avgOrdersPerCustomer,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          User Management
        </h1>
        <Link to="/users/new" className="btn-primary">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add User
        </Link>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Customers
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {metrics.totalCustomers}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Active: </span>
              <span className="font-medium text-gray-900">
                {metrics.activeCustomers} (
                {metrics.totalCustomers > 0
                  ? (
                      (metrics.activeCustomers / metrics.totalCustomers) *
                      100
                    ).toFixed(1)
                  : 0}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Revenue
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      $
                      {metrics.totalSpent.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Avg. Revenue per Customer: </span>
              <span className="font-medium text-gray-900">
                $
                {metrics.avgSpentPerCustomer.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Orders
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Avg. Orders per Customer: </span>
              <span className="font-medium text-gray-900">
                {metrics.avgOrdersPerCustomer.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    New Customers (30d)
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        customers.filter((c) => {
                          const createdDate = new Date(c.createdAt);
                          const thirtyDaysAgo = new Date();
                          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                          return createdDate >= thirtyDaysAgo;
                        }).length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-500">Growth Rate: </span>
              <span className="font-medium text-gray-900">
                {metrics.totalCustomers > 0
                  ? (
                      (customers.filter((c) => {
                        const createdDate = new Date(c.createdAt);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return createdDate >= thirtyDaysAgo;
                      }).length /
                        metrics.totalCustomers) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Customer Summary
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <CustomerSummaryChart customers={customers} />
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              User Activity
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              <UserActivityChart customers={customers} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
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
                  placeholder="Search customers..."
                />
              </div>

              <button
                type="button"
                className="ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-5 w-5 mr-2 text-gray-400" />
                Filters
                {Object.values(filters).some((val) => val !== "") && (
                  <span className="ml-1 text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-500">
              <span>
                Showing {paginatedData.length} of {filteredCustomers.length}{" "}
                customers
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="minSpent"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Min Total Spent
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="minSpent"
                      value={filters.minSpent}
                      onChange={(e) =>
                        setFilters({ ...filters, minSpent: e.target.value })
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
                    htmlFor="maxSpent"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Max Total Spent
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="maxSpent"
                      value={filters.maxSpent}
                      onChange={(e) =>
                        setFilters({ ...filters, maxSpent: e.target.value })
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
                    htmlFor="minOrders"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Min Orders
                  </label>
                  <input
                    type="number"
                    id="minOrders"
                    value={filters.minOrders}
                    onChange={(e) =>
                      setFilters({ ...filters, minOrders: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="maxOrders"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Max Orders
                  </label>
                  <input
                    type="number"
                    id="maxOrders"
                    value={filters.maxOrders}
                    onChange={(e) =>
                      setFilters({ ...filters, maxOrders: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="0"
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              {Object.values(filters).some((val) => val !== "") && (
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

                  {filters.minSpent && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Min Spent: ${filters.minSpent}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, minSpent: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.maxSpent && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Max Spent: ${filters.maxSpent}
                      <button
                        type="button"
                        onClick={() => setFilters({ ...filters, maxSpent: "" })}
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.minOrders && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Min Orders: {filters.minOrders}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({ ...filters, minOrders: "" })
                        }
                        className="ml-0.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500 focus:bg-primary-500 focus:text-white focus:outline-none"
                      >
                        <span className="sr-only">Remove filter</span>
                        <XMarkIcon className="h-2 w-2" aria-hidden="true" />
                      </button>
                    </span>
                  )}

                  {filters.maxOrders && (
                    <span className="inline-flex items-center rounded-full bg-primary-100 py-0.5 pl-2 pr-0.5 text-xs font-medium text-primary-700">
                      Max Orders: {filters.maxOrders}
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({ ...filters, maxOrders: "" })
                        }
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
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center">
                    Customer
                    {sortConfig.key === "name" &&
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
                  onClick={() => handleSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {sortConfig.key === "email" &&
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
                  onClick={() => handleSort("totalOrders")}
                >
                  <div className="flex items-center">
                    Orders
                    {sortConfig.key === "totalOrders" &&
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
                  onClick={() => handleSort("totalSpent")}
                >
                  <div className="flex items-center">
                    Total Spent
                    {sortConfig.key === "totalSpent" &&
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
                  onClick={() => handleSort("lastPurchase")}
                >
                  <div className="flex items-center">
                    Last Purchase
                    {sortConfig.key === "lastPurchase" &&
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
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {paginatedData.map((customer) => (
                <tr key={customer.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-primary-600 sm:pl-6">
                    <Link
                      to={`/users/${customer.id}`}
                      className="hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {customer.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {customer.totalOrders}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    $
                    {customer.totalSpent.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(customer.lastPurchase).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        customer.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <Link
                      to={`/users/${customer.id}`}
                      className="text-primary-600 hover:text-primary-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      to={`/users/${customer.id}/edit`}
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
                    colSpan="7"
                    className="px-3 py-4 text-sm text-center text-gray-500"
                  >
                    No customers found
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
                  {Math.min(currentPage * 10, filteredCustomers.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{filteredCustomers.length}</span>{" "}
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

export default UserManagement;
