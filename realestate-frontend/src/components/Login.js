import React, { useState, useContext } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useAlert } from '../context/AlertContext';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const { setCurrentUser } = useContext(DataContext); // no need for setIsLoggedIn
  const { showAlert } = useAlert(); // use styled alerts
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Call login API
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      if (response.ok && text === 'Login successful!') {
        showAlert(text, 'success'); // ✅ styled success alert

        // 2️⃣ Fetch user details
        const userRes = await fetch(`http://localhost:8000/api/users/${form.username}`);
        const userData = await userRes.json();

        // 3️⃣ Store user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(userData));

        // 4️⃣ Update context
        setCurrentUser(userData);

        // 5️⃣ Navigate to homepage WITHOUT reload
        navigate('/');
      } else {
        showAlert(text || 'Invalid username or password!', 'error'); // ✅ styled error alert
      }
    } catch (err) {
      console.error('Login error:', err);
      showAlert('Something went wrong: ' + err.message, 'error'); // ✅ styled error alert
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <div className="mx-auto bg-gradient-to-r from-green-400 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mb-3">
            GKS
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
          <p className="text-sm mt-2 text-gray-500">
            Or{' '}
            <span className="text-green-600 cursor-pointer" onClick={() => navigate('/signup')}>
              create a new account
            </span>
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-2" />
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
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <div className="flex items-center border rounded-md px-3 py-2">
              <FaLock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="w-full outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
