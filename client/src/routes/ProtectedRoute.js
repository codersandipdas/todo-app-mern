import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../services/axiosInstance";

export const ProtectedRoute = ({ children }) => {
  const { user, handleLogout } = useAuth();
  const [isLoading, setIsLaoding] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axiosInstance.get(`/api/v1/auth/verify`);
        setIsLaoding(false);
      } catch (err) {
        const { status } = err.response;
        if (status === 401 || status === 403) {
          handleLogout();
        }
      }
    };

    user && verifyToken();
  }, [user, handleLogout]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return children;
};
