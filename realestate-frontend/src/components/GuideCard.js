// src/components/GuideCard.js
import React, { useContext } from 'react';
import { Star, Award, Clock } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const GuideCard = ({ guide }) => {
  const { users } = useContext(DataContext); // get users from DataContext
  const user = users.find(u => u.user_id === guide.user_id);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={guide.image}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 group-hover:border-blue-300 transition-colors duration-300"
          />
          <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2">
            <Award className="h-4 w-4" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
          {user?.name}
        </h3>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(guide.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">({guide.rating})</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {guide.specialization}
          </div>
          
          <div className="flex items-center justify-center text-gray-600 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{guide.experience_years} years experience</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {guide.bio}
        </p>

        <div className="flex space-x-2 w-full">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
            Contact
          </button>
          <button className="flex-1 border border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-4 rounded-lg transition-colors duration-200 text-sm font-medium">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideCard;
