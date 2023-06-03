import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = useState(storedToken || '');

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  const authContextValue = {
    token,
    handleLogin,
    handleLogout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
