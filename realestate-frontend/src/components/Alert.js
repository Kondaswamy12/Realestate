// src/components/Alert.js
import React, { useContext } from 'react';
import { AlertContext } from '../context/AlertContext';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function Alert() {
  const { alert } = useContext(AlertContext);

  if (!alert) return null;

  const isSuccess = alert.type === 'success';

  return (
    <div className={`fixed top-20 right-5 z-50 px-5 py-3 rounded-md shadow-lg border-l-4 
      ${isSuccess ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
      <div className="flex items-start gap-3">
        {isSuccess ? (
          <FaCheckCircle className="text-green-500 text-xl mt-1" />
        ) : (
          <FaTimesCircle className="text-red-500 text-xl mt-1" />
        )}
        <div>
          <p className="font-semibold">{isSuccess ? 'Success' : 'Login Failed'}</p>
          <p className="text-sm">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}

export default Alert;
