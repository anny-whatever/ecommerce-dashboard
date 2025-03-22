// src/context/StoreContext.jsx
import { createContext, useReducer, useEffect } from "react";
import {
  getProductsFromStorage,
  setProductsToStorage,
  getOrdersFromStorage,
  setOrdersToStorage,
  getCustomersFromStorage,
  setCustomersToStorage,
  getTransactionsFromStorage,
  setTransactionsToStorage,
  getContentFromStorage,
  setContentToStorage,
  getCampaignsFromStorage,
  setCampaignsToStorage,
} from "../utils/storage";
import { generateMockData } from "../utils/mockData";

// Initial state
const initialState = {
  products: [],
  orders: [],
  customers: [],
  transactions: [],
  content: [],
  campaigns: [],
  loading: {
    products: false,
    orders: false,
    customers: false,
    transactions: false,
    content: false,
    campaigns: false,
  },
  error: null,
};

// Actions
const actions = {
  FETCH_PRODUCTS_START: "FETCH_PRODUCTS_START",
  FETCH_PRODUCTS_SUCCESS: "FETCH_PRODUCTS_SUCCESS",
  FETCH_PRODUCTS_FAILURE: "FETCH_PRODUCTS_FAILURE",

  FETCH_ORDERS_START: "FETCH_ORDERS_START",
  FETCH_ORDERS_SUCCESS: "FETCH_ORDERS_SUCCESS",
  FETCH_ORDERS_FAILURE: "FETCH_ORDERS_FAILURE",

  FETCH_CUSTOMERS_START: "FETCH_CUSTOMERS_START",
  FETCH_CUSTOMERS_SUCCESS: "FETCH_CUSTOMERS_SUCCESS",
  FETCH_CUSTOMERS_FAILURE: "FETCH_CUSTOMERS_FAILURE",

  FETCH_TRANSACTIONS_START: "FETCH_TRANSACTIONS_START",
  FETCH_TRANSACTIONS_SUCCESS: "FETCH_TRANSACTIONS_SUCCESS",
  FETCH_TRANSACTIONS_FAILURE: "FETCH_TRANSACTIONS_FAILURE",

  FETCH_CONTENT_START: "FETCH_CONTENT_START",
  FETCH_CONTENT_SUCCESS: "FETCH_CONTENT_SUCCESS",
  FETCH_CONTENT_FAILURE: "FETCH_CONTENT_FAILURE",

  FETCH_CAMPAIGNS_START: "FETCH_CAMPAIGNS_START",
  FETCH_CAMPAIGNS_SUCCESS: "FETCH_CAMPAIGNS_SUCCESS",
  FETCH_CAMPAIGNS_FAILURE: "FETCH_CAMPAIGNS_FAILURE",

  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",

  ADD_ORDER: "ADD_ORDER",
  UPDATE_ORDER: "UPDATE_ORDER",
  DELETE_ORDER: "DELETE_ORDER",

  ADD_CUSTOMER: "ADD_CUSTOMER",
  UPDATE_CUSTOMER: "UPDATE_CUSTOMER",
  DELETE_CUSTOMER: "DELETE_CUSTOMER",

  ADD_TRANSACTION: "ADD_TRANSACTION",
  UPDATE_TRANSACTION: "UPDATE_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",

  ADD_CONTENT: "ADD_CONTENT",
  UPDATE_CONTENT: "UPDATE_CONTENT",
  DELETE_CONTENT: "DELETE_CONTENT",

  ADD_CAMPAIGN: "ADD_CAMPAIGN",
  UPDATE_CAMPAIGN: "UPDATE_CAMPAIGN",
  DELETE_CAMPAIGN: "DELETE_CAMPAIGN",
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    // Products
    case actions.FETCH_PRODUCTS_START:
      return {
        ...state,
        loading: { ...state.loading, products: true },
        error: null,
      };
    case actions.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload,
        loading: { ...state.loading, products: false },
      };
    case actions.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, products: false },
        error: action.payload,
      };
    case actions.ADD_PRODUCT:
      const newProducts = [...state.products, action.payload];
      setProductsToStorage(newProducts);
      return {
        ...state,
        products: newProducts,
      };
    case actions.UPDATE_PRODUCT:
      const updatedProducts = state.products.map((product) =>
        product.id === action.payload.id ? action.payload : product
      );
      setProductsToStorage(updatedProducts);
      return {
        ...state,
        products: updatedProducts,
      };
    case actions.DELETE_PRODUCT:
      const filteredProducts = state.products.filter(
        (product) => product.id !== action.payload
      );
      setProductsToStorage(filteredProducts);
      return {
        ...state,
        products: filteredProducts,
      };

    // Orders
    case actions.FETCH_ORDERS_START:
      return {
        ...state,
        loading: { ...state.loading, orders: true },
        error: null,
      };
    case actions.FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
        loading: { ...state.loading, orders: false },
      };
    case actions.FETCH_ORDERS_FAILURE:
      return {
        ...state,
        loading: { ...state.loading, orders: false },
        error: action.payload,
      };
    case actions.ADD_ORDER:
      const newOrders = [...state.orders, action.payload];
      setOrdersToStorage(newOrders);
      return {
        ...state,
        orders: newOrders,
      };
    case actions.UPDATE_ORDER:
      const updatedOrders = state.orders.map((order) =>
        order.id === action.payload.id ? action.payload : order
      );
      setOrdersToStorage(updatedOrders);
      return {
        ...state,
        orders: updatedOrders,
      };
    case actions.DELETE_ORDER:
      const filteredOrders = state.orders.filter(
        (order) => order.id !== action.payload
      );
      setOrdersToStorage(filteredOrders);
      return {
        ...state,
        orders: filteredOrders,
      };

    // Similar patterns for customers, transactions, content, and campaigns...

    default:
      return state;
  }
};

// Create context
export const StoreContext = createContext();

// Provider component
export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Initialize data from localStorage or generate mock data
    const initializeData = async () => {
      // Products
      dispatch({ type: actions.FETCH_PRODUCTS_START });
      try {
        let products = getProductsFromStorage();

        if (!products || products.length === 0) {
          // Generate mock data if no data in localStorage
          const mockData = generateMockData();
          products = mockData.products;
          setProductsToStorage(products);
        }

        dispatch({ type: actions.FETCH_PRODUCTS_SUCCESS, payload: products });
      } catch (error) {
        dispatch({
          type: actions.FETCH_PRODUCTS_FAILURE,
          payload: error.message,
        });
      }

      // Orders
      dispatch({ type: actions.FETCH_ORDERS_START });
      try {
        let orders = getOrdersFromStorage();

        if (!orders || orders.length === 0) {
          // Generate mock data if no data in localStorage
          const mockData = generateMockData();
          orders = mockData.orders;
          setOrdersToStorage(orders);
        }

        dispatch({ type: actions.FETCH_ORDERS_SUCCESS, payload: orders });
      } catch (error) {
        dispatch({
          type: actions.FETCH_ORDERS_FAILURE,
          payload: error.message,
        });
      }

      // Similar pattern for other data types
    };

    initializeData();
  }, []);

  // Define actions for components to use
  const addProduct = (product) => {
    dispatch({
      type: actions.ADD_PRODUCT,
      payload: { ...product, id: Date.now().toString() },
    });
  };

  const updateProduct = (product) => {
    dispatch({ type: actions.UPDATE_PRODUCT, payload: product });
  };

  const deleteProduct = (productId) => {
    dispatch({ type: actions.DELETE_PRODUCT, payload: productId });
  };

  const addOrder = (order) => {
    dispatch({
      type: actions.ADD_ORDER,
      payload: { ...order, id: Date.now().toString() },
    });
  };

  const updateOrder = (order) => {
    dispatch({ type: actions.UPDATE_ORDER, payload: order });
  };

  const deleteOrder = (orderId) => {
    dispatch({ type: actions.DELETE_ORDER, payload: orderId });
  };

  // Similar pattern for other data types

  // Value to be provided to consumers
  const value = {
    ...state,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrder,
    deleteOrder,
    // Include other action creators
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
