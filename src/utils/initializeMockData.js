// src/utils/initializeMockData.js
import { generateMockData } from "./mockData";
import { generateTransactionData, generateChartData } from "./chartUtils";
import {
  getProductsFromStorage,
  getOrdersFromStorage,
  getCustomersFromStorage,
  getTransactionsFromStorage,
  getContentFromStorage,
  getCampaignsFromStorage,
  setProductsToStorage,
  setOrdersToStorage,
  setCustomersToStorage,
  setTransactionsToStorage,
  setContentToStorage,
  setCampaignsToStorage,
} from "./storage";

// Store chart data for component use
const CHART_DATA_KEY = "ecommerce_dashboard_chart_data";

/**
 * Initializes and stores pre-generated chart data
 */
const initializeChartData = () => {
  const chartData = generateChartData();
  localStorage.setItem(CHART_DATA_KEY, JSON.stringify(chartData));
  return chartData;
};

/**
 * Get pre-generated chart data
 */
export const getChartData = () => {
  const storedData = localStorage.getItem(CHART_DATA_KEY);
  return storedData ? JSON.parse(storedData) : initializeChartData();
};

/**
 * Checks if mock data exists in localStorage and initializes it if missing
 * This ensures charts and components have data to render properly
 */
export const initializeMockData = () => {
  console.log("Initializing mock data for dashboard...");

  // Get generated mock data once to avoid multiple generations
  let mockData = null;

  // Check if products exist
  const products = getProductsFromStorage();
  if (!products || products.length === 0) {
    console.log("Products data missing, initializing...");
    mockData = mockData || generateMockData();
    setProductsToStorage(mockData.products);
  }

  // Check if orders exist
  const orders = getOrdersFromStorage();
  if (!orders || orders.length === 0) {
    console.log("Orders data missing, initializing...");
    mockData = mockData || generateMockData();
    setOrdersToStorage(mockData.orders);
  }

  // Check if customers exist
  const customers = getCustomersFromStorage();
  if (!customers || customers.length === 0) {
    console.log("Customers data missing, initializing...");
    mockData = mockData || generateMockData();
    setCustomersToStorage(mockData.customers);
  }

  // Check if transactions exist
  let transactions = getTransactionsFromStorage();
  if (!transactions || transactions.length === 0) {
    console.log("Transactions data missing, initializing...");
    // Use specialized transaction data generator for better chart compatibility
    transactions = generateTransactionData(300);
    setTransactionsToStorage(transactions);
  }

  // Check if content exists
  const content = getContentFromStorage();
  if (!content || content.length === 0) {
    console.log("Content data missing, initializing...");
    mockData = mockData || generateMockData();
    setContentToStorage(mockData.content);
  }

  // Check if campaigns exist
  const campaigns = getCampaignsFromStorage();
  if (!campaigns || campaigns.length === 0) {
    console.log("Campaigns data missing, initializing...");
    mockData = mockData || generateMockData();
    setCampaignsToStorage(mockData.campaigns);
  }

  // Always initialize chart data for direct component access
  initializeChartData();

  console.log("Mock data initialization complete");
};
