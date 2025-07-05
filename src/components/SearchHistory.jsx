import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { format } from 'date-fns';

const { FiClock, FiMapPin, FiSearch, FiEye, FiDownload, FiTrash2 } = FiIcons;

const SearchHistory = ({ history, onLoadResults, onTabChange }) => {
  const handleViewResults = (search) => {
    onLoadResults(search.results);
    onTabChange('results');
  };

  const handleDeleteSearch = (searchId) => {
    // In a real app, you would update the history state
    console.log('Delete search:', searchId);
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <SafeIcon icon={FiClock} className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No search history</h3>
        <p className="text-gray-600">
          Your search history will appear here after you perform searches.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Search History</h2>
        <p className="text-gray-600">
          View and manage your previous searches ({history.length} searches)
        </p>
      </div>

      <div className="space-y-4">
        {history.map((search, index) => (
          <motion.div
            key={search.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white rounded-lg shadow-soft p-6 hover:shadow-medium transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex items-center text-gray-600">
                    <SafeIcon icon={FiSearch} className="mr-2" />
                    <span className="font-medium">{search.keyword}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <SafeIcon icon={FiMapPin} className="mr-2" />
                    <span>{search.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <SafeIcon icon={FiClock} className="mr-1" />
                    <span>{format(new Date(search.timestamp), 'MMM d, yyyy h:mm a')}</span>
                  </div>
                  <div>
                    <span className="font-medium">{search.results?.length || 0}</span> results
                  </div>
                  {search.results && search.results.length > 0 && (
                    <div>
                      Avg rating: <span className="font-medium">
                        {(search.results.reduce((sum, r) => sum + parseFloat(r.rating), 0) / search.results.length).toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Applied Filters */}
                {search.filters && Object.values(search.filters).some(v => v) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {search.filters.minRating && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                        Min Rating: {search.filters.minRating}+
                      </span>
                    )}
                    {search.filters.hasPhone && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Has Phone
                      </span>
                    )}
                    {search.filters.hasEmail && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Has Email
                      </span>
                    )}
                    {search.filters.hasWebsite && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Has Website
                      </span>
                    )}
                    {search.filters.verified && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        Verified Only
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleViewResults(search)}
                  className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <SafeIcon icon={FiEye} />
                  <span>View Results</span>
                </button>
                <button
                  onClick={() => handleDeleteSearch(search.id)}
                  className="p-2 text-gray-400 hover:text-danger-600 transition-colors"
                >
                  <SafeIcon icon={FiTrash2} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;