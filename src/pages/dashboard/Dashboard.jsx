// src/pages/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";
import { useStore } from "../../hooks/useStore";
import RevenueChart from "../../components/analytics/RevenueChart";
import TopProductsChart from "../../components/analytics/TopProductsChart";
import OrderStatusChart from "../../components/analytics/OrderStatusChart";
import GeographicSalesMap from "../../components/analytics/GeographicSalesMap";
import RecentOrdersTable from "../../components/order/RecentOrdersTable";
import InventoryStatusTable from "../../components/product/InventoryStatusTable";

const Dashboard = () => {
  const { products, orders, customers, transactions } = useStore();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0,
  });

  useEffect(() => {
    // Calculate dashboard stats
    const calculateStats = () => {
      // Total revenue
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

      // Compare with previous period (last 30 days vs previous 30 days)
      const today = new Date();
      const thirtyDaysAgo = new Date(
        today.getTime() - 30 * 24 * 60 * 60 * 1000
      );
      const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

      const currentPeriodOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= thirtyDaysAgo && orderDate <= today;
      });

      const previousPeriodOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= sixtyDaysAgo && orderDate < thirtyDaysAgo;
      });

      const currentPeriodRevenue = currentPeriodOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );
      const previousPeriodRevenue = previousPeriodOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      const revenueChange =
        previousPeriodRevenue === 0
          ? 100
          : ((currentPeriodRevenue - previousPeriodRevenue) /
              previousPeriodRevenue) *
            100;

      const ordersChange =
        previousPeriodOrders.length === 0
          ? 100
          : ((currentPeriodOrders.length - previousPeriodOrders.length) /
              previousPeriodOrders.length) *
            100;

      // For simplicity, we're using random changes for products and customers
      const productsChange =
        Math.random() > 0.5 ? Math.random() * 20 : -Math.random() * 10;
      const customersChange =
        Math.random() > 0.5 ? Math.random() * 25 : -Math.random() * 5;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: customers.length,
        revenueChange,
        ordersChange,
        productsChange,
        customersChange,
      });
    };

    calculateStats();
  }, [products, orders, customers, transactions]);

  const StatCard = ({ title, value, icon: Icon, change, href }) => {
    const isPositive = change >= 0;

    return (
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {title}
                </dt>
                <dd>
                  <div className="text-lg font-medium text-gray-900">
                    {value}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <Link
              to={href}
              className="font-medium text-primary-700 hover:text-primary-900"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
          <div className="flex items-center">
            {isPositive ? (
              <ArrowUpIcon
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">
              from previous period
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={CurrencyDollarIcon}
          change={stats.revenueChange}
          href="/financial"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCartIcon}
          change={stats.ordersChange}
          href="/orders"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts.toLocaleString()}
          icon={CubeIcon}
          change={stats.productsChange}
          href="/products"
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={UserGroupIcon}
          change={stats.customersChange}
          href="/users"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Revenue Over Time
            </h3>
            <div className="mt-2 h-72">
              <RevenueChart transactions={transactions} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Top Products
            </h3>
            <div className="mt-2 h-72">
              <TopProductsChart products={products} orders={orders} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Order Status
            </h3>
            <div className="mt-2 h-72">
              <OrderStatusChart orders={orders} />
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Sales by Region
            </h3>
            <div className="mt-2 h-72">
              <GeographicSalesMap orders={orders} />
            </div>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Orders
            </h3>
            <div className="mt-2">
              <RecentOrdersTable orders={orders.slice(0, 5)} />
            </div>
            <div className="mt-4">
              <Link
                to="/orders"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all orders
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Inventory Status
            </h3>
            <div className="mt-2">
              <InventoryStatusTable products={products.slice(0, 5)} />
            </div>
            <div className="mt-4">
              <Link
                to="/products"
                className="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View all products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
