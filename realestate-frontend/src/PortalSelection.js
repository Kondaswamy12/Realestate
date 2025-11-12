import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Home, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const PortalSelection = () => {
  const stats = [
    { icon: Home, value: '500+', label: 'Properties' },
    { icon: Users, value: '1000+', label: 'Happy Clients' },
    { icon: TrendingUp, value: '98%', label: 'Success Rate' },
    { icon: Star, value: '4.9', label: 'Rating' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Home className="h-16 w-16 text-blue-600 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                RealEstate
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your trusted partner in finding the perfect property. Choose your portal to get started.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600 mb-3">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Portal Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* User Portal */}
            <Link
              to="/user"
              className="group relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full text-blue-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  User Portal
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Browse properties, connect with expert agents, and find your dream home with our comprehensive real estate platform.
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Browse 500+ Properties</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Connect with Expert Agents</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span>Advanced Search & Filters</span>
                  </div>
                </div>

                <div className="mt-6 text-blue-600 font-medium group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  Enter User Portal
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Admin Portal */}
            <Link
              to="/login"
              className="group relative bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5 rounded-2xl group-hover:from-emerald-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>

              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                  Admin Portal
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Manage users, properties, and agents with comprehensive administrative tools and analytics dashboard.
                </p>

                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>User Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>Property Management</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                    <span>Analytics Dashboard</span>
                  </div>
                </div>

                <div className="mt-6 text-emerald-600 font-medium group-hover:translate-x-2 transition-transform duration-300 inline-flex items-center">
                  Enter Admin Portal
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 text-center text-gray-500"
          >
            <p>&copy; 2024 RealEstate. All rights reserved.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;
