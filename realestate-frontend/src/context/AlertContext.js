// src/context/AlertContext.js
import React, { createContext, useContext, useState } from 'react';

// Create Context
export const AlertContext = createContext();

// Custom hook for easier access
export const useAlert = () => useContext(AlertContext);

// Provider
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
