import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import UserMenu from './UserMenu'; // User menu component
import { DataContext } from '../context/DataContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn } = useContext(DataContext); // Use login state

  const navigation = [
    { name: 'Home', href: '/user' },
    { name: 'Buildings', href: '/user/buildings' },
    { name: 'Guides', href: '/user/guides' },
    { name: 'About Us', href: '/user/about' },
    { name: 'Contact', href: '/user/contact' },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/user" className="flex items-center space-x-2 group">
            <Home className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-bold text-xl text-gray-900">RealEstate</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 animate-in slide-in-from-left duration-300" />
                )}
              </Link>
            ))}

            {/* User Menu or Login/Signup */}
            {isLoggedIn ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/user/login"
                  className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/user/signup"
                  className="px-4 py-2 text-green-500 border border-green-500 hover:bg-green-500 hover:text-white rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-in slide-in-from-top duration-300 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile User Menu / Login-Signup */}
            {isLoggedIn ? (
              <UserMenu isMobile={true} />
            ) : (
              <>
                <Link
                  to="/user/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/user/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-4 py-2 text-green-500 border border-green-500 hover:bg-green-500 hover:text-white rounded-md font-medium transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
