import React, { createContext, useState, useEffect, useContext } from "react";
import apiService from "../config/apiService";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            setUser(null);
          } else {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const authContextValue = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
