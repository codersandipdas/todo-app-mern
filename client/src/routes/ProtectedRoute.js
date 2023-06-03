import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export const ProtectedRoute = ({ children }) => {
  const { token, handleLogout } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await axios.get(
          `${process.env.REACT_APP_API_AUTH}/api/v1/auth/verify`,
          {
            headers: { authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        !err.response.data.auth && handleLogout();
      }
    };

    token && verifyToken();
  }, [token, handleLogout]);

  if (!token) {
    return <Navigate to='/login' />;
  }
  return children;
};
