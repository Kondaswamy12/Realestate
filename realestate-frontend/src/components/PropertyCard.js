// src/components/PropertyCard.js
import React from 'react';
import { MapPin, Bed, Bath, Square, DollarSign } from 'lucide-react';

const PropertyCard = ({ building, onClick }) => {
  const formatPrice = (price) => {
    return price
      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price)
      : 'N/A';
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image & Labels */}
      <div className="relative overflow-hidden">
        <img
          src={building.image || 'https://via.placeholder.com/400x300'} // fallback image
          alt={building.name || 'Property'}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Availability Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getAvailabilityColor(
              building.availability
            )}`}
          >
            {building.availability || 'N/A'}
          </span>
        </div>
        {/* Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
            {building.type || 'N/A'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {building.name || 'No Name'}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {building.city || 'Unknown'}, {building.state || 'Unknown'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-blue-600">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="text-2xl font-bold">{formatPrice(building.price)}</span>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{building.bedrooms ?? 'N/A'} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{building.bathrooms ?? 'N/A'} bath</span>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{building.area_sqft ? building.area_sqft.toLocaleString() : 'N/A'} sq ft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
