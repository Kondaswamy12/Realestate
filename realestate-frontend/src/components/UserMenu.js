import React, { useState, useContext, useRef, useEffect } from "react";
import { FaUserCircle, FaSignOutAlt, FaUserEdit, FaTimes } from "react-icons/fa";
import { DataContext } from "../context/DataContext";
import { updateUser } from "../api/userService";
import { useAlert } from "../context/AlertContext"; // ✅ import useAlert

const UserMenu = () => {
  const { currentUser, isLoggedIn, logout, setCurrentUser } = useContext(DataContext);
  const { showAlert } = useAlert(); // ✅ use styled alerts
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: "", password: "", phone: "" });

  const menuRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Populate editForm when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        email: currentUser.email || "",
        password: currentUser.password || "",
        phone: currentUser.phone || "",
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  // 🔥 Update API call on Save Changes
  const handleSaveProfile = async () => {
    try {
      const response = await updateUser(currentUser.username, editForm);
      showAlert(response, "success"); // ✅ styled success alert

      // Update context & localStorage
      const updatedUser = { ...currentUser, ...editForm };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      setProfileOpen(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      showAlert("Failed to update profile!", "error"); // ✅ styled error alert
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Icon */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center focus:outline-none text-gray-700 hover:text-green-500 transition-colors duration-200"
      >
        <FaUserCircle className="h-8 w-8" />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-in slide-in-from-top duration-300">
          <button
            onClick={() => {
              setProfileOpen(true);
              setMenuOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-green-100 transition-colors duration-200 gap-2"
          >
            <FaUserEdit /> Profile
          </button>
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
              showAlert("Logged out successfully!", "success"); // ✅ optional logout alert
            }}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-red-100 transition-colors duration-200 gap-2"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6 relative animate-in slide-in-from-bottom duration-300">
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors duration-200"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-3">
              {/* Username - not editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={currentUser.username}
                  disabled
                  className="w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveProfile}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md mt-3"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
