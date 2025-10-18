// src/components/LoadingSkeleton.js
import React from 'react';

const LoadingSkeleton = ({ className = '', variant = 'line' }) => {
  // Updated baseClasses to use white in light mode
  const baseClasses = 'animate-pulse bg-white dark:bg-gray-600';

  const variantClasses = {
    card: 'h-64 rounded-lg',
    line: 'h-4 rounded',
    circle: 'rounded-full',
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />;
};

export default LoadingSkeleton;
