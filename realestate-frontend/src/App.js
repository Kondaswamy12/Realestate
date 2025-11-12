import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './admin/AuthContext';

// Pages
import PortalSelection from './PortalSelection';
import UserPortal from './UserPortal';

// Admin
import AdminPortal from './admin/AdminPortal';
import AdminLogin from './admin/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Portal Selection (Main Landing) */}
          <Route path="/" element={<PortalSelection />} />

          {/* User Portal (All user-related pages: home, login, signup, etc.) */}
          <Route path="/user/*" element={<UserPortal />} />

          {/* Admin Login */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Admin Dashboard */}
          <Route path="/admin/*" element={<AdminPortal />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
