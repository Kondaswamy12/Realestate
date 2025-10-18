import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaPhone } from 'react-icons/fa';
import { useAlert } from '../context/AlertContext'; // ✅ import useAlert
import { useNavigate } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const { showAlert } = useAlert(); // ✅ styled alerts
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.agree) {
      showAlert('You must agree to terms', 'error'); // ✅ styled error
      return;
    }
    if (form.password !== form.confirmPassword) {
      showAlert('Passwords do not match', 'error'); // ✅ styled error
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }),
      });

      const data = await response.json(); // backend returns user object
      console.log('Registered:', data);
      showAlert('Registration successful!', 'success'); // ✅ styled success
      navigate('/login'); // redirect after registration
    } catch (err) {
      console.error('Register error:', err);
      showAlert('Something went wrong: ' + err.message, 'error'); // ✅ styled error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-gradient-to-r from-green-400 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
            GKS
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create your account</h2>
          <p className="text-sm mt-2 text-gray-500">
            Or{' '}
            <span
              className="text-green-600 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              sign in to existing account
            </span>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaUser className="text-gray-400 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaPhone className="text-gray-400 mr-2" />
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <label className="flex items-center text-sm text-gray-600 gap-2">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              className="accent-green-500"
            />
            I agree to the <span className="text-green-600 underline">Terms</span> and <span className="text-green-600 underline">Privacy Policy</span>
          </label>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
          >
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
