// src/utils/initDashboard.js
import { fixChartData } from "./chartFix";
import { fixMarketingDashboard } from "./marketingFix";

export function initializeDashboard() {
  console.log("Initializing dashboard...");

  // Fix all chart data across the application
  fixChartData();

  // Special fix for marketing dashboard
  fixMarketingDashboard();

  console.log("Dashboard initialization complete");
}
