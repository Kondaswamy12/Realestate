import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminGuides from './AdminGuides';
import AdminBuildings from './AdminBuildings';

const AdminPortal = () => {
  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/guides" element={<AdminGuides />} />
          <Route path="/buildings" element={<AdminBuildings />} />
        </Routes>
      </div>
    </ProtectedRoute>
  );
};

export default AdminPortal;
