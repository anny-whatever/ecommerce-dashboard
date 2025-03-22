// src/hooks/useStore.js
import { useContext } from "react";
import { StoreContext } from "../context/StoreContext";

export const useStore = () => {
  return useContext(StoreContext);
};
