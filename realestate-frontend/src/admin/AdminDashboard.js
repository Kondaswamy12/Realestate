import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Building, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { DataContext } from '../context/DataContext';

const AdminDashboard = () => {
  const { users, guides, buildings, loading } = useContext(DataContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: users.length,
      change: '+12%',
      color: 'blue',
      link: '/admin/users'
    },
    {
      icon: UserCheck,
      label: 'Active Guides',
      value: guides.length,
      change: '+8%',
      color: 'green',
      link: '/admin/guides'
    },
    {
      icon: Building,
      label: 'Properties',
      value: buildings.length,
      change: '+15%',
      color: 'purple',
      link: '/admin/buildings'
    },
    {
      icon: DollarSign,
      label: 'Total Value',
      value:
        '₹' +
        (buildings.reduce((sum, b) => sum + (b.price || 0), 0) / 10000000).toFixed(1) +
        'Cr',
      change: '+22%',
      color: 'orange'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View, add, edit, and delete users',
      icon: Users,
      link: '/admin/users',
      color: 'blue'
    },
    {
      title: 'Manage Guides',
      description: 'Manage real estate agents and guides',
      icon: UserCheck,
      link: '/admin/guides',
      color: 'green'
    },
    {
      title: 'Manage Buildings',
      description: 'Add, edit, and remove property listings',
      icon: Building,
      link: '/admin/buildings',
      color: 'purple'
    }
  ];

  const recentActivity = [
    { action: 'New user registered', user: 'Priya Sharma', time: '2 hours ago' },
    { action: 'Property added', user: 'Admin', time: '4 hours ago' },
    { action: 'Guide profile updated', user: 'Amit Patel', time: '6 hours ago' },
    { action: 'User deleted', user: 'Admin', time: '1 day ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your real estate platform.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}
                >
                  <stat.icon
                    className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`}
                  />
                </div>
                <span className="text-green-500 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-sm">
                {stat.label}
              </div>
              {stat.link && (
                <Link
                  to={stat.link}
                  className="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline inline-block"
                >
                  View Details →
                </Link>
              )}
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-4">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
                >
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 bg-${action.color}-100 dark:bg-${action.color}-900/20 rounded-lg mr-4 group-hover:scale-110 transition-transform duration-200`}
                  >
                    <action.icon
                      className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.action}</span>
                      {activity.user && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {' '}
                          by {activity.user}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
