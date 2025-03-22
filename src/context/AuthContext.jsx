// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import {
  getUserFromStorage,
  setUserToStorage,
  removeUserFromStorage,
} from "../utils/storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = getUserFromStorage();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // In a real application, we would make an API call here
    const user = {
      id: userData.email,
      email: userData.email,
      name: userData.email.split("@")[0],
      role: "admin", // For demo purposes
    };

    setUser(user);
    setUserToStorage(user);
    return user;
  };

  const register = (userData) => {
    // In a real application, we would make an API call here
    const user = {
      id: userData.email,
      email: userData.email,
      name: userData.name,
      role: "admin", // For demo purposes
    };

    setUser(user);
    setUserToStorage(user);
    return user;
  };

  const logout = () => {
    setUser(null);
    removeUserFromStorage();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
