// src/pages/financial/FinancialDashboard.jsx
import { useState, useEffect } from "react";
import { useStore } from "../../hooks/useStore";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
} from "date-fns";
import RevenueChart from "../../components/financial/RevenueChart";
import ExpenseBreakdownChart from "../../components/financial/ExpenseBreakdownChart";
import ProfitMarginChart from "../../components/financial/ProfitMarginChart";
import TransactionList from "../../components/financial/TransactionList";
import DateRangePicker from "../../components/common/DateRangePicker";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";

const FinancialDashboard = () => {
  const { products, orders, transactions } = useStore();

  // Date range filter
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(subMonths(new Date(), 5)),
    endDate: endOfMonth(new Date()),
  });

  // Financial metrics
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    grossProfit: 0,
    netProfit: 0,
    profitMargin: 0,
  });

  // Period comparison (current month vs previous month)
  const [comparison, setComparison] = useState({
    revenue: { value: 0, percentage: 0 },
    expenses: { value: 0, percentage: 0 },
    profit: { value: 0, percentage: 0 },
  });

  useEffect(() => {
    const calculateMetrics = () => {
      // Filter transactions by date range
      const filteredTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= dateRange.startDate &&
          transactionDate <= dateRange.endDate
        );
      });

      // Calculate revenue (sales - refunds)
      const sales = filteredTransactions
        .filter((t) => t.type === "sale")
        .reduce((sum, t) => sum + t.amount, 0);

      const refunds = filteredTransactions
        .filter((t) => t.type === "refund")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const revenue = sales - refunds;

      // Calculate expenses
      const expenses = filteredTransactions
        .filter((t) => t.type !== "sale" && t.type !== "refund")
        .reduce((sum, t) => sum + t.amount, 0);

      // Calculate profits
      const grossProfit = revenue;
      const netProfit = revenue - expenses;
      const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

      setMetrics({
        totalRevenue: revenue,
        totalExpenses: expenses,
        grossProfit,
        netProfit,
        profitMargin,
      });

      // Calculate period comparison
      const today = new Date();
      const currentMonthStart = startOfMonth(today);
      const previousMonthStart = startOfMonth(subMonths(today, 1));
      const previousMonthEnd = endOfMonth(previousMonthStart);

      // Current month transactions
      const currentMonthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= currentMonthStart && transactionDate <= today;
      });

      // Previous month transactions
      const previousMonthTransactions = transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transactionDate >= previousMonthStart &&
          transactionDate <= previousMonthEnd
        );
      });

      // Current month metrics
      const currentMonthSales = currentMonthTransactions
        .filter((t) => t.type === "sale")
        .reduce((sum, t) => sum + t.amount, 0);

      const currentMonthRefunds = currentMonthTransactions
        .filter((t) => t.type === "refund")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const currentMonthRevenue = currentMonthSales - currentMonthRefunds;

      const currentMonthExpenses = currentMonthTransactions
        .filter((t) => t.type !== "sale" && t.type !== "refund")
        .reduce((sum, t) => sum + t.amount, 0);

      const currentMonthProfit = currentMonthRevenue - currentMonthExpenses;

      // Previous month metrics
      const previousMonthSales = previousMonthTransactions
        .filter((t) => t.type === "sale")
        .reduce((sum, t) => sum + t.amount, 0);

      const previousMonthRefunds = previousMonthTransactions
        .filter((t) => t.type === "refund")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const previousMonthRevenue = previousMonthSales - previousMonthRefunds;

      const previousMonthExpenses = previousMonthTransactions
        .filter((t) => t.type !== "sale" && t.type !== "refund")
        .reduce((sum, t) => sum + t.amount, 0);

      const previousMonthProfit = previousMonthRevenue - previousMonthExpenses;

      // Calculate percentage changes
      const revenueChange =
        previousMonthRevenue === 0
          ? 100
          : ((currentMonthRevenue - previousMonthRevenue) /
              previousMonthRevenue) *
            100;

      const expensesChange =
        previousMonthExpenses === 0
          ? 0
          : ((currentMonthExpenses - previousMonthExpenses) /
              previousMonthExpenses) *
            100;

      const profitChange =
        previousMonthProfit === 0
          ? 100
          : ((currentMonthProfit - previousMonthProfit) / previousMonthProfit) *
            100;

      setComparison({
        revenue: {
          value: currentMonthRevenue - previousMonthRevenue,
          percentage: revenueChange,
        },
        expenses: {
          value: currentMonthExpenses - previousMonthExpenses,
          percentage: expensesChange,
        },
        profit: {
          value: currentMonthProfit - previousMonthProfit,
          percentage: profitChange,
        },
      });
    };

    calculateMetrics();
  }, [transactions, dateRange]);

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    change,
    type = "positive",
  }) => {
    const isPositive = change >= 0;
    const isNeutral = change === 0;

    const getColorClass = () => {
      if (type === "expense") {
        return isPositive
          ? "text-red-500"
          : isNeutral
          ? "text-gray-500"
          : "text-green-500";
      }
      return isPositive
        ? "text-green-500"
        : isNeutral
        ? "text-gray-500"
        : "text-red-500";
    };

    const getIcon = () => {
      if (type === "expense") {
        return isPositive ? (
          <ArrowTrendingUpIcon className="h-4 w-4" />
        ) : (
          <ArrowTrendingDownIcon className="h-4 w-4" />
        );
      }
      return isPositive ? (
        <ArrowTrendingUpIcon className="h-4 w-4" />
      ) : (
        <ArrowTrendingDownIcon className="h-4 w-4" />
      );
    };

    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
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
        {typeof change !== "undefined" && (
          <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
            <div className="flex items-center">
              {getIcon()}
              <span className={`text-sm font-medium ${getColorClass()}`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                from previous month
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <h2 className="text-lg font-medium text-gray-900">
            Financial Overview
          </h2>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={(newDateRange) => setDateRange(newDateRange)}
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={BanknotesIcon}
          change={comparison.revenue.percentage}
        />
        <MetricCard
          title="Total Expenses"
          value={`$${metrics.totalExpenses.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={ReceiptPercentIcon}
          change={comparison.expenses.percentage}
          type="expense"
        />
        <MetricCard
          title="Gross Profit"
          value={`$${metrics.grossProfit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={ScaleIcon}
        />
        <MetricCard
          title="Net Profit"
          value={`$${metrics.netProfit.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={ScaleIcon}
          change={comparison.profit.percentage}
        />
        <MetricCard
          title="Profit Margin"
          value={`${metrics.profitMargin.toFixed(2)}%`}
          icon={ScaleIcon}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue & Expenses
          </h3>
          <div className="h-80">
            <RevenueChart
              transactions={transactions}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Profit Margins
          </h3>
          <div className="h-80">
            <ProfitMarginChart
              transactions={transactions}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Transactions
          </h3>
          <TransactionList
            transactions={transactions.slice(0, 10)}
            showPagination={false}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Expense Breakdown
          </h3>
          <div className="h-80">
            <ExpenseBreakdownChart
              transactions={transactions}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
