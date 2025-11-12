import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DataProvider } from "./context/DataContext";
import { AlertProvider } from "./context/AlertContext";
import { AuthProvider } from "./context/AuthContext"; // ✅ add this import

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* ✅ Just wrap inside AuthProvider */}
    <AuthProvider>
      <DataProvider>
        <AlertProvider>
          <App />
        </AlertProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
);
