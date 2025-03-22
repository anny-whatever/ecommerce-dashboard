// src/utils/storage.js
const STORAGE_KEYS = {
  USER: "ecommerce_dashboard_user",
  PRODUCTS: "ecommerce_dashboard_products",
  ORDERS: "ecommerce_dashboard_orders",
  CUSTOMERS: "ecommerce_dashboard_customers",
  TRANSACTIONS: "ecommerce_dashboard_transactions",
  CONTENT: "ecommerce_dashboard_content",
  CAMPAIGNS: "ecommerce_dashboard_campaigns",
};

// User storage
export const getUserFromStorage = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  return userJson ? JSON.parse(userJson) : null;
};

export const setUserToStorage = (user) => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUserFromStorage = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Products storage
export const getProductsFromStorage = () => {
  const productsJson = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  return productsJson ? JSON.parse(productsJson) : [];
};

export const setProductsToStorage = (products) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

// Orders storage
export const getOrdersFromStorage = () => {
  const ordersJson = localStorage.getItem(STORAGE_KEYS.ORDERS);
  return ordersJson ? JSON.parse(ordersJson) : [];
};

export const setOrdersToStorage = (orders) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

// Customers storage
export const getCustomersFromStorage = () => {
  const customersJson = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
  return customersJson ? JSON.parse(customersJson) : [];
};

export const setCustomersToStorage = (customers) => {
  localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
};

// Transactions storage
export const getTransactionsFromStorage = () => {
  const transactionsJson = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return transactionsJson ? JSON.parse(transactionsJson) : [];
};

export const setTransactionsToStorage = (transactions) => {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

// Content storage
export const getContentFromStorage = () => {
  const contentJson = localStorage.getItem(STORAGE_KEYS.CONTENT);
  return contentJson ? JSON.parse(contentJson) : [];
};

export const setContentToStorage = (content) => {
  localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(content));
};

// Campaigns storage
export const getCampaignsFromStorage = () => {
  const campaignsJson = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
  return campaignsJson ? JSON.parse(campaignsJson) : [];
};

export const setCampaignsToStorage = (campaigns) => {
  localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
};
