// src/components/Guides.js
import React, { useState, useEffect, useContext } from 'react';
import { DataContext } from '../context/DataContext';
import GuideCard from '../components/GuideCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { Search, Award, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Guides = () => {
  const { guides } = useContext(DataContext);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!guides) return;

    let filtered = guides.filter(guide => {
      const matchesSearch =
        guide.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.bio?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSpecialization =
        selectedSpecialization === 'all' ||
        guide.specialization?.toLowerCase().includes(selectedSpecialization.toLowerCase());

      return matchesSearch && matchesSpecialization;
    });

    // Sort guides
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience_years - a.experience_years;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.rating - a.rating;
      }
    });

    setFilteredGuides(filtered);
  }, [guides, searchTerm, selectedSpecialization, sortBy]);

  const specializations = ['all', 'luxury homes', 'commercial', 'first-time buyers'];
  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'name', label: 'Name' }
  ];

  const stats = [
    { icon: Award, value: guides?.length || 0, label: 'Expert Agents' },
    { icon: Clock, value: guides?.length ? Math.round(guides.reduce((acc, g) => acc + g.experience_years, 0) / guides.length) : 0, label: 'Avg. Experience' },
    { icon: Star, value: guides?.length ? (guides.reduce((acc, g) => acc + g.rating, 0) / guides.length).toFixed(1) : 0, label: 'Avg. Rating' }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Meet Our Expert Agents</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our experienced real estate professionals are here to help you navigate your property journey
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full text-blue-600 mb-4">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {specializations.map(spec => (
                <option key={spec} value={spec}>
                  {spec === 'all' ? 'All Specializations' : spec.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-sm text-gray-600">{filteredGuides.length} agent{filteredGuides.length !== 1 ? 's' : ''} found</div>
        </motion.div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => <LoadingSkeleton key={index} variant="card" />)}
          </div>
        ) : filteredGuides.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide, index) => (
              <motion.div key={guide.guide_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                <GuideCard guide={guide} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="text-center py-12">
            <div className="text-gray-400 mb-4"><Search className="h-16 w-16 mx-auto" /></div>
            <h3 className="text-xl font-semibold mb-2">No agents found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('all');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Guides;
