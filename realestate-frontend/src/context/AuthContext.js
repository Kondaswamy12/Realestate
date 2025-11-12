import React, { createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const logout = () => {
    // ✅ Safe browser redirect (no hooks)
    window.location.href = "/login";
  };

  // Hard-coded admin
  const user = { name: "Admin" };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
