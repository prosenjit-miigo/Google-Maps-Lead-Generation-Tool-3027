import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiMapPin, FiFilter, FiStar, FiPhone, FiMail, FiLoader } = FiIcons;

const SearchForm = ({ onSearch, isSearching }) => {
  const [formData, setFormData] = useState({
    keyword: '',
    location: '',
    radius: '10',
    filters: {
      minRating: '',
      hasPhone: false,
      hasEmail: false,
      hasWebsite: false,
      verified: false
    }
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.keyword.trim() && formData.location.trim()) {
      onSearch(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  const popularKeywords = [
    'Restaurant', 'Pharmacy', 'HVAC Service', 'Dentist', 'Auto Repair',
    'Hair Salon', 'Gym', 'Coffee Shop', 'Grocery Store', 'Pet Store'
  ];

  const popularLocations = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
    'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Generate Business Leads
        </h2>
        <p className="text-gray-600">
          Enter a keyword and location to extract business leads from Google Maps
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Search Fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Keyword *
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                name="keyword"
                value={formData.keyword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="e.g., pharmacy, HVAC service, dentist"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiMapPin} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                placeholder="e.g., New York, NY or 10001"
                required
              />
            </div>
          </div>
        </div>

        {/* Radius Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Radius
          </label>
          <select
            name="radius"
            value={formData.radius}
            onChange={handleChange}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          >
            <option value="5">5 miles</option>
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <SafeIcon icon={FiFilter} />
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-4 space-y-4"
          >
            <h3 className="font-medium text-gray-900">Filter Results</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="relative">
                  <SafeIcon 
                    icon={FiStar} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                  />
                  <select
                    name="minRating"
                    value={formData.filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  >
                    <option value="">Any Rating</option>
                    <option value="3">3+ Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Required Information
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasPhone"
                      checked={formData.filters.hasPhone}
                      onChange={handleFilterChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <SafeIcon icon={FiPhone} className="ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">Has Phone Number</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasEmail"
                      checked={formData.filters.hasEmail}
                      onChange={handleFilterChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <SafeIcon icon={FiMail} className="ml-2 mr-1 text-gray-500" />
                    <span className="text-sm text-gray-700">Has Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasWebsite"
                      checked={formData.filters.hasWebsite}
                      onChange={handleFilterChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-6 text-sm text-gray-700">Has Website</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="verified"
                      checked={formData.filters.verified}
                      onChange={handleFilterChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-6 text-sm text-gray-700">Verified Business</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Button */}
        <motion.button
          type="submit"
          disabled={isSearching || !formData.keyword.trim() || !formData.location.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isSearching ? (
            <>
              <SafeIcon icon={FiLoader} className="animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <SafeIcon icon={FiSearch} />
              <span>Generate Leads</span>
            </>
          )}
        </motion.button>
      </form>

      {/* Quick Suggestions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => setFormData(prev => ({ ...prev, keyword }))}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Locations</h3>
          <div className="flex flex-wrap gap-2">
            {popularLocations.map((location) => (
              <button
                key={location}
                onClick={() => setFormData(prev => ({ ...prev, location }))}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm hover:bg-primary-100 transition-colors"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;