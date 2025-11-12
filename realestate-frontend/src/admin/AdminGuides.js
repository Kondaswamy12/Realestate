import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  UserPlus,
  Trash2,
  Edit3 as Edit,
  Star,
  Award,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { DataContext } from "../context/DataContext"; // reads users list (for names / selection)

const API_BASE = "http://localhost:8000/api/guides";

const AdminGuides = () => {
  const { users: allUsers = [] } = useContext(DataContext); // fallback []
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);

  const [newGuide, setNewGuide] = useState({
    name: "",
    email: "",
    phone: "",
    experienceYears: "",
    rating: "",
    specialization: "",
    city: "",
    state: "",
    available: true,
    joinedDate: "",
    image: "", // image url placeholder
    userId: "", // optional: to link with app users if you wish
  });

  // Toast alert state (same style as AdminUsers)
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");
  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(null), 3000);
  };

  // Confirm modal state (replaces window.confirm)
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  const openConfirm = (message, action) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmVisible(true);
  };

  const closeConfirm = () => {
    setConfirmVisible(false);
    setConfirmMessage("");
    setConfirmAction(() => () => {});
  };

  // Load guides from backend
  const loadGuides = async () => {
    try {
      const res = await axios.get(API_BASE);
      setGuides(res.data || []);
    } catch (err) {
      console.error("Error loading guides:", err);
      showAlert("Failed to load guides!", "error");
    }
  };

  useEffect(() => {
    loadGuides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add guide (POST to /api/guides/guides)
  const handleAddGuide = async (e) => {
    e.preventDefault();
    try {
      // backend expects a Guide entity — adjust field names accordingly
      const payload = {
        name: newGuide.name,
        email: newGuide.email,
        phone: newGuide.phone,
        experienceYears: Number(newGuide.experienceYears) || 0,
        rating: Number(newGuide.rating) || 0,
        specialization: newGuide.specialization,
        city: newGuide.city,
        state: newGuide.state,
        available: !!newGuide.available,
        joinedDate: newGuide.joinedDate || new Date().toISOString(),
        image: newGuide.image || "", // placeholder image URL
      };

      await axios.post(`${API_BASE}/guides`, payload);
      setShowAddModal(false);
      setNewGuide({
        name: "",
        email: "",
        phone: "",
        experienceYears: 0,
        rating: 0,
        specialization: "",
        city: "",
        state: "",
        available: true,
        joinedDate: "",
        image: "",
        userId: "",
      });
      await loadGuides();
      showAlert("Guide added successfully!", "success");
    } catch (err) {
      console.error("Error adding guide:", err);
      showAlert("Failed to add guide!", "error");
    }
  };

  // Edit guide (PUT to /api/guides/guides/{id})
  const handleEditGuide = async (e) => {
    e.preventDefault();
    if (!editingGuide || !editingGuide.id) return;
    try {
      const payload = {
        name: editingGuide.name,
        email: editingGuide.email,
        phone: editingGuide.phone,
        experienceYears: Number(editingGuide.experienceYears) || 0,
        rating: Number(editingGuide.rating) || 0,
        specialization: editingGuide.specialization,
        city: editingGuide.city,
        state: editingGuide.state,
        available: !!editingGuide.available,
        joinedDate: editingGuide.joinedDate || new Date().toISOString(),
        image: editingGuide.image || "",
      };

      await axios.put(`${API_BASE}/guides/${editingGuide.id}`, payload);
      setShowEditModal(false);
      setEditingGuide(null);
      await loadGuides();
      showAlert("Guide updated successfully!", "success");
    } catch (err) {
      console.error("Error updating guide:", err);
      showAlert("Failed to update guide!", "error");
    }
  };

  // Delete request (DELETE /api/guides/{id})
  const performDeleteGuide = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await loadGuides();
      showAlert("Guide deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting guide:", err);
      showAlert("Failed to delete guide!", "error");
    } finally {
      closeConfirm();
    }
  };

  const handleDeleteGuide = (id) => {
    openConfirm("Are you sure you want to delete this guide?", () =>
      performDeleteGuide(id)
    );
  };

  // Filter logic: match specialization, bio, or linked user name if present
  const filteredGuides = guides.filter((g) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    const matchFields =
      (g.specialization || "").toLowerCase().includes(q) ||
      (g.name || "").toLowerCase().includes(q) ||
      (g.city || "").toLowerCase().includes(q) ||
      (g.state || "").toLowerCase().includes(q);
    return matchFields;
  });

  // helper to get user name by id (if you link guides to users)
  const getUserName = (userId) => {
    const u = allUsers.find((x) => x.user_id === userId || x.id === userId);
    return u ? u.name : "";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast */}
      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            alertType === "success"
              ? "bg-green-500"
              : alertType === "error"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {alertMessage}
        </motion.div>
      )}

      {/* Confirm modal */}
      {confirmVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeConfirm}
          />
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              {confirmMessage}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirm}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmAction()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Guide Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage real estate agents and their profiles
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <UserPlus className="h-5 w-5" />
            <span>Add Guide</span>
          </button>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {filteredGuides.length} guides found
          </div>
        </motion.div>

        {/* Guides Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredGuides.map((guide) => (
            <div
              key={guide.id || guide.guideId || guide.guide_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      guide.image ||
                      "https://via.placeholder.com/150?text=Profile" // fallback
                    }
                    alt={guide.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 dark:border-blue-900"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                    <Award className="h-3 w-3" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {guide.name || getUserName(guide.userId) || "Unnamed"}
                </h3>

                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(guide.rating || 0)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({guide.rating ?? 0})
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {guide.specialization || "General"}
                  </div>

                  <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{guide.experienceYears ?? guide.experience_years} years</span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                  {guide.bio || guide.description || ""}
                </p>

                <div className="flex space-x-2 w-full">
                  <button
                    onClick={() => {
                      // prepare editing object mapping backend fields to local naming if needed
                      setEditingGuide({
                        id: guide.id ?? guide.guideId ?? guide.guide_id,
                        name: guide.name,
                        email: guide.email,
                        phone: guide.phone,
                        experienceYears: guide.experienceYears ?? guide.experience_years,
                        rating: guide.rating,
                        specialization: guide.specialization,
                        city: guide.city,
                        state: guide.state,
                        available: guide.available,
                        joinedDate: guide.joinedDate,
                        image: guide.image,
                      });
                      setShowEditModal(true);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteGuide(guide.id ?? guide.guideId ?? guide.guide_id)
                    }
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Add Guide Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.12 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-50"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Guide
              </h3>
              <form onSubmit={handleAddGuide} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={newGuide.name}
                  onChange={(e) => setNewGuide({ ...newGuide, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newGuide.email}
                  onChange={(e) => setNewGuide({ ...newGuide, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newGuide.phone}
                  onChange={(e) => setNewGuide({ ...newGuide, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Experience Years"
                  value={newGuide.experienceYears}
                  onChange={(e) => setNewGuide({ ...newGuide, experienceYears: parseInt(e.target.value || 0) })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Rating (0-5)"
                  value={newGuide.rating}
                  onChange={(e) => setNewGuide({ ...newGuide, rating: parseFloat(e.target.value || 0) })}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Specialization (e.g. Residential)"
                  value={newGuide.specialization}
                  onChange={(e) => setNewGuide({ ...newGuide, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={newGuide.city}
                  onChange={(e) => setNewGuide({ ...newGuide, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={newGuide.state}
                  onChange={(e) => setNewGuide({ ...newGuide, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="url"
                  placeholder="Profile image URL (paste or leave placeholder)"
                  value={newGuide.image}
                  onChange={(e) => setNewGuide({ ...newGuide, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <div className="flex items-center space-x-3">
                  <input
                    id="available_add"
                    type="checkbox"
                    checked={!!newGuide.available}
                    onChange={(e) => setNewGuide({ ...newGuide, available: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="available_add" className="text-sm text-gray-700 dark:text-gray-300">Available</label>
                </div>

                <input
                  type="date"
                  placeholder="Joined Date"
                  value={newGuide.joinedDate}
                  onChange={(e) => setNewGuide({ ...newGuide, joinedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Add Guide
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Guide Modal */}
        {showEditModal && editingGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.12 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto z-50"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Edit Guide
              </h3>
              <form onSubmit={handleEditGuide} className="space-y-4">
                <input
                  type="text"
                  placeholder="Full name"
                  value={editingGuide.name || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingGuide.email || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, email: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={editingGuide.phone || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Experience Years"
                  value={editingGuide.experienceYears || 0}
                  onChange={(e) => setEditingGuide({ ...editingGuide, experienceYears: parseInt(e.target.value || 0) })}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="number"
                  placeholder="Rating (0-5)"
                  value={editingGuide.rating || 0}
                  onChange={(e) => setEditingGuide({ ...editingGuide, rating: parseFloat(e.target.value || 0) })}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="Specialization"
                  value={editingGuide.specialization || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={editingGuide.city || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="text"
                  placeholder="State"
                  value={editingGuide.state || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <input
                  type="url"
                  placeholder="Profile image URL"
                  value={editingGuide.image || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <div className="flex items-center space-x-3">
                  <input
                    id="available_edit"
                    type="checkbox"
                    checked={!!editingGuide.available}
                    onChange={(e) => setEditingGuide({ ...editingGuide, available: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <label htmlFor="available_edit" className="text-sm text-gray-700 dark:text-gray-300">Available</label>
                </div>

                <input
                  type="date"
                  placeholder="Joined Date"
                  value={editingGuide.joinedDate || ""}
                  onChange={(e) => setEditingGuide({ ...editingGuide, joinedDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                />

                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    Update Guide
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGuides;
