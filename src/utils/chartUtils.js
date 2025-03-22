// src/utils/chartUtils.js
import { format, subMonths, eachMonthOfInterval } from "date-fns";

/**
 * Generates consistent chart data that works with recharts
 * This ensures a reliable dataset for all chart components
 */
export const generateChartData = () => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);

  // Generate data for the past 6 months
  const monthlyData = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now,
  }).map((date) => {
    const monthName = format(date, "MMM yyyy");
    return {
      name: monthName,
      revenue: Math.round(2000 + Math.random() * 8000),
      expenses: Math.round(1000 + Math.random() * 4000),
      profit: Math.round(800 + Math.random() * 4000),
      refunds: Math.round(100 + Math.random() * 900),
    };
  });

  return monthlyData;
};

/**
 * Creates consistent transaction data for charts
 */
export const generateTransactionData = (count = 200) => {
  const now = new Date();
  const sixMonthsAgo = subMonths(now, 5);
  const result = [];

  const types = ["sale", "refund", "subscription", "shipping", "tax"];
  const statusOptions = ["completed", "pending", "failed"];

  for (let i = 0; i < count; i++) {
    // Ensure even distribution across months
    const randomDays = Math.floor(Math.random() * 180); // 6 months in days
    const date = new Date(
      sixMonthsAgo.getTime() + randomDays * 24 * 60 * 60 * 1000
    );

    const type = types[Math.floor(Math.random() * types.length)];
    const amount =
      type === "refund"
        ? -Math.round((Math.random() * 200 + 10) * 100) / 100
        : Math.round((Math.random() * 200 + 10) * 100) / 100;

    result.push({
      id: `transaction-${i + 1}`,
      type,
      amount,
      date: date.toISOString(),
      description: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } transaction`,
      status: statusOptions[Math.floor(Math.random() * statusOptions.length)],
    });
  }

  return result;
};
