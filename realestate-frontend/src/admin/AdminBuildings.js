import React, { useState, useEffect, useContext } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit3 as Edit,
  MapPin,
  Bed,
  Bath,
  Square,
  DollarSign,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { DataContext } from "../context/DataContext";

const API_BASE = "http://localhost:8000/api/buildings";

const AdminBuildings = () => {
  const { guides: ctxGuides = [] } = useContext(DataContext); // guides from DataContext
  const [buildings, setBuildings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);

  const [newBuilding, setNewBuilding] = useState({
    guideId: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: 0,
    type: "house",
    bedrooms: 0,
    bathrooms: 0,
    areaSqft: 0,
    availability: "available",
    image: "",
    featured: false,
  });

  // Toast alert state (same style)
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

  // Load buildings from backend
  const loadBuildings = async () => {
    try {
      const res = await axios.get(API_BASE);
      setBuildings(res.data || []);
    } catch (err) {
      console.error("Error loading buildings:", err);
      showAlert("Failed to load properties!", "error");
    }
  };

  useEffect(() => {
    loadBuildings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: format price INR
  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price || 0);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "sold":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Add building (POST /api/buildings)
  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        guideId: newBuilding.guideId ? Number(newBuilding.guideId) : null,
        name: newBuilding.name,
        address: newBuilding.address,
        city: newBuilding.city,
        state: newBuilding.state,
        zipCode: newBuilding.zipCode,
        price: Number(newBuilding.price) || 0,
        type: newBuilding.type,
        bedrooms: Number(newBuilding.bedrooms) || 0,
        bathrooms: Number(newBuilding.bathrooms) || 0,
        areaSqft: Number(newBuilding.areaSqft) || 0,
        availability: newBuilding.availability,
        image: newBuilding.image || "",
        featured: !!newBuilding.featured,
      };

      await axios.post(API_BASE, payload);
      setShowAddModal(false);
      setNewBuilding({
        guideId: "",
        name: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        price: 0,
        type: "house",
        bedrooms: 0,
        bathrooms: 0,
        areaSqft: 0,
        availability: "available",
        image: "",
        featured: false,
      });
      await loadBuildings();
      showAlert("Property added successfully!", "success");
    } catch (err) {
      console.error("Error adding building:", err);
      showAlert("Failed to add property!", "error");
    }
  };

  // Edit building (PUT /api/buildings/buildings/{id})
const handleEditBuilding = async (e) => {
  e.preventDefault();

  try {
    console.log("🟡 --- EDIT SAVE CLICKED ---");
    console.log("Editing building object:", editingBuilding);

    // Validate before sending
    if (!editingBuilding || !editingBuilding.buildingId) {
      console.error("❌ Invalid building data (no ID found).");
      showAlert("Invalid property data!", "error");
      return;
    }

    // Ensure guideId is numeric
    const guideId = Number(editingBuilding.guideId) || 0;

    const payload = {
      guideId,
      name: editingBuilding.name,
      address: editingBuilding.address,
      city: editingBuilding.city,
      state: editingBuilding.state,
      zipCode: editingBuilding.zipCode,
      price: Number(editingBuilding.price) || 0,
      type: editingBuilding.type,
      bedrooms: Number(editingBuilding.bedrooms) || 0,
      bathrooms: Number(editingBuilding.bathrooms) || 0,
      areaSqft: Number(editingBuilding.areaSqft) || 0,
      availability: editingBuilding.availability,
      image: editingBuilding.image,
      featured: !!editingBuilding.featured,
    };

    const apiPath = `${API_BASE}/${editingBuilding.buildingId}`;
    console.log("🧩 PUT request URL:", apiPath);
    console.log("📦 Payload being sent:", payload);

    // PUT request
    const response = await axios.put(apiPath, payload);

    console.log("✅ PUT Response from backend:", response.data);

    setShowEditModal(false);
    setEditingBuilding(null);
    await loadBuildings();
    showAlert("Property updated successfully!", "success");

  } catch (error) {
    console.error("❌ PUT request failed:", error);
    if (error.response) {
      console.log("🔴 Status:", error.response.status);
      console.log("🔴 Backend says:", error.response.data);
    } else {
      console.log("⚠️ No response (network/URL issue):", error.message);
    }
    showAlert("Failed to update property!", "error");
  }
};





  // Delete building
  const performDeleteBuilding = async (id) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      await loadBuildings();
      showAlert("Property deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting building:", err);
      showAlert("Failed to delete property!", "error");
    } finally {
      closeConfirm();
    }
  };

  const handleDeleteBuilding = (id) => {
    openConfirm("Are you sure you want to delete this property?", () => performDeleteBuilding(id));
  };

  // Filtered
  const filteredBuildings = buildings.filter((building) => {
    const q = (searchTerm || "").trim().toLowerCase();
    const matchesSearch =
      !q ||
      (building.name || "").toLowerCase().includes(q) ||
      (building.city || "").toLowerCase().includes(q) ||
      (building.state || "").toLowerCase().includes(q);
    const matchesType = selectedType === "all" || building.type === selectedType;
    const matchesStatus = selectedStatus === "all" || building.availability === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Toast */}
      {alertMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-300 ${
            alertType === "success" ? "bg-green-500" : alertType === "error" ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {alertMessage}
        </motion.div>
      )}

      {/* Confirm modal */}
      {confirmVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeConfirm} />
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Confirm</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{confirmMessage}</p>
            <div className="flex justify-end space-x-3">
              <button onClick={closeConfirm} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg text-sm">Cancel</button>
              <button onClick={() => confirmAction()} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">Delete</button>
            </div>
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Property Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage all property listings in the system</p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
            <Plus className="h-5 w-5" />
            <span>Add Property</span>
          </button>
        </motion.div>

        {/* Search & filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input type="text" placeholder="Search properties..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white" />
            </div>

            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="all">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>

            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white">
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
            </select>

            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">{filteredBuildings.length} properties found</div>
          </div>
        </motion.div>

        {/* Buildings Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => {
            const id = building.id ?? building.buildingId ?? building.building_id;
            return (
              <div key={id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <img src={building.image || "https://via.placeholder.com/600x400?text=Property"} alt={building.name} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getAvailabilityColor(building.availability)}`}>{building.availability}</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">{building.type}</span>
                  </div>
                  {building.featured && <div className="absolute bottom-4 left-4"><span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">Featured</span></div>}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{building.name}</h3>

                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{building.city}, {building.state}</span>
                  </div>

                  <div className="flex items-center text-blue-600 dark:text-blue-400 mb-4">
                    <DollarSign className="h-5 w-5 mr-1" />
                    <span className="text-xl font-bold">{formatPrice(building.price)}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{building.bedrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{building.bathrooms}</span>
                      </div>
                      <div className="flex items-center">
                        <Square className="h-4 w-4 mr-1" />
                        <span>{(building.area_sqft ?? building.areaSqft ?? 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button onClick={() => { setEditingBuilding({ ...building }); setShowEditModal(true); }} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button onClick={() => handleDeleteBuilding(id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Add Building Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.12 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Property</h3>
              <form onSubmit={handleAddBuilding} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Property Name" value={newBuilding.name} onChange={(e) => setNewBuilding({ ...newBuilding, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                  <select value={newBuilding.guideId} onChange={(e) => setNewBuilding({ ...newBuilding, guideId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required>
                    <option value="">Select Guide</option>
                    {ctxGuides.map((g) => <option key={g.id ?? g.guide_id} value={g.id ?? g.guide_id}>{g.name ?? `Guide ${g.guide_id ?? g.id}`}</option>)}
                  </select>
                </div>

                <input type="text" placeholder="Address" value={newBuilding.address} onChange={(e) => setNewBuilding({ ...newBuilding, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="City" value={newBuilding.city} onChange={(e) => setNewBuilding({ ...newBuilding, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                  <input type="text" placeholder="State" value={newBuilding.state} onChange={(e) => setNewBuilding({ ...newBuilding, state: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                  <input type="text" placeholder="ZIP Code" value={newBuilding.zipCode} onChange={(e) => setNewBuilding({ ...newBuilding, zipCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="number" placeholder="Price (₹)" value={newBuilding.price} onChange={(e) => setNewBuilding({ ...newBuilding, price: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                  <select value={newBuilding.type} onChange={(e) => setNewBuilding({ ...newBuilding, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="number" placeholder="Bedrooms" value={newBuilding.bedrooms} onChange={(e) => setNewBuilding({ ...newBuilding, bedrooms: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                  <input type="number" placeholder="Bathrooms" value={newBuilding.bathrooms} onChange={(e) => setNewBuilding({ ...newBuilding, bathrooms: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                  <input type="number" placeholder="Area (sq ft)" value={newBuilding.areaSqft} onChange={(e) => setNewBuilding({ ...newBuilding, areaSqft: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={newBuilding.availability} onChange={(e) => setNewBuilding({ ...newBuilding, availability: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>

                  <div className="flex items-center">
                    <input id="featured_add" type="checkbox" checked={newBuilding.featured} onChange={(e) => setNewBuilding({ ...newBuilding, featured: e.target.checked })} className="mr-2" />
                    <label htmlFor="featured_add" className="text-sm text-gray-700 dark:text-gray-300">Featured Property</label>
                  </div>
                </div>

                <input type="url" placeholder="Give Image URL" value={newBuilding.image} onChange={(e) => setNewBuilding({ ...newBuilding, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />

                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Add Property</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Building Modal */}
        {showEditModal && editingBuilding && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-40">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.12 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Edit Property</h3>
              <form onSubmit={handleEditBuilding} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Property Name" value={editingBuilding.name || ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                  <select value={editingBuilding.guideId ?? editingBuilding.guide_id ?? ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, guideId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required>
                    <option value="">Select Guide</option>
                    {ctxGuides.map((g) => <option key={g.id ?? g.guide_id} value={g.id ?? g.guide_id}>{g.name ?? `Guide ${g.guide_id ?? g.id}`}</option>)}
                  </select>
                </div>

                <input type="text" placeholder="Address" value={editingBuilding.address || ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="City" value={editingBuilding.city || ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                  <input type="text" placeholder="State" value={editingBuilding.state || ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, state: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                  <input type="text" placeholder="ZIP Code" value={editingBuilding.zipCode || editingBuilding.zip_code || ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, zipCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="number" placeholder="Price (₹)" value={editingBuilding.price || 0} onChange={(e) => setEditingBuilding({ ...editingBuilding, price: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                  <select value={editingBuilding.type || "house"} onChange={(e) => setEditingBuilding({ ...editingBuilding, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="number" placeholder="Bedrooms" value={editingBuilding.bedrooms || 0} onChange={(e) => setEditingBuilding({ ...editingBuilding, bedrooms: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                  <input type="number" placeholder="Bathrooms" value={editingBuilding.bathrooms || 0} onChange={(e) => setEditingBuilding({ ...editingBuilding, bathrooms: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                  <input type="number" placeholder="Area (sq ft)" value={editingBuilding.areaSqft || editingBuilding.area_sqft || 0} onChange={(e) => setEditingBuilding({ ...editingBuilding, areaSqft: parseInt(e.target.value || 0) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required min="0" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select value={editingBuilding.availability || "available"} onChange={(e) => setEditingBuilding({ ...editingBuilding, availability: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>

                  <div className="flex items-center">
                    <input id="featured_edit" type="checkbox" checked={editingBuilding.featured || false} onChange={(e) => setEditingBuilding({ ...editingBuilding, featured: e.target.checked })} className="mr-2" />
                    <label htmlFor="featured_edit" className="text-sm text-gray-700 dark:text-gray-300">Featured Property</label>
                  </div>
                </div>

                <input type="url" placeholder="Give Image URL" value={editingBuilding.image || ""} onChange={(e) => setEditingBuilding({ ...editingBuilding, image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg" required />

                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">Update Property</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBuildings;
