import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../contexts/AuthContext';
import SearchForm from './SearchForm';
import ResultsTable from './ResultsTable';
import SearchHistory from './SearchHistory';
import StatsCards from './StatsCards';

const { FiLogOut, FiMapPin, FiSearch, FiHistory, FiDownload, FiSettings } = FiIcons;

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('search');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    totalSearches: 0,
    totalLeads: 0,
    avgRating: 0,
    successRate: 0
  });

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('leadgen_history');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setSearchHistory(history);
      calculateStats(history);
    }
  }, []);

  const calculateStats = (history) => {
    if (history.length === 0) return;

    const totalSearches = history.length;
    const totalLeads = history.reduce((sum, search) => sum + (search.results?.length || 0), 0);
    const allRatings = history.flatMap(search => 
      search.results?.filter(r => r.rating).map(r => r.rating) || []
    );
    const avgRating = allRatings.length > 0 
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length 
      : 0;
    const successRate = totalLeads > 0 ? (totalLeads / (totalSearches * 20)) * 100 : 0;

    setStats({
      totalSearches,
      totalLeads,
      avgRating: avgRating.toFixed(1),
      successRate: successRate.toFixed(1)
    });
  };

  const handleSearch = async (searchParams) => {
    setIsSearching(true);
    
    try {
      // Simulate API call with realistic delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate mock results
      const mockResults = generateMockResults(searchParams);
      setSearchResults(mockResults);
      
      // Save to history
      const searchEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        keyword: searchParams.keyword,
        location: searchParams.location,
        results: mockResults,
        filters: searchParams.filters
      };
      
      const updatedHistory = [searchEntry, ...searchHistory];
      setSearchHistory(updatedHistory);
      localStorage.setItem('leadgen_history', JSON.stringify(updatedHistory));
      calculateStats(updatedHistory);
      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const generateMockResults = (params) => {
    const businessTypes = {
      'pharmacy': ['CVS Pharmacy', 'Walgreens', 'Rite Aid', 'Local Pharmacy'],
      'hvac': ['HVAC Pro', 'Cool Air Systems', 'Heating & Cooling Co', 'Climate Control'],
      'cold storage': ['Cold Storage Solutions', 'Frozen Logistics', 'Arctic Storage', 'Ice Cold Warehouse'],
      'restaurant': ['Pizza Palace', 'Burger Joint', 'Fine Dining', 'Cafe Corner'],
      'dentist': ['Smile Dental', 'Perfect Teeth', 'Family Dentistry', 'Bright Smiles']
    };

    const getBusinessNames = (keyword) => {
      const lowerKeyword = keyword.toLowerCase();
      for (const [key, names] of Object.entries(businessTypes)) {
        if (lowerKeyword.includes(key)) {
          return names;
        }
      }
      return ['Local Business', 'Professional Services', 'Quality Service', 'Expert Solutions'];
    };

    const businessNames = getBusinessNames(params.keyword);
    const results = [];
    
    for (let i = 0; i < Math.min(15, businessNames.length * 3); i++) {
      const baseName = businessNames[i % businessNames.length];
      const businessName = `${baseName} ${i > businessNames.length - 1 ? (i + 1) : ''}`.trim();
      
      results.push({
        id: i + 1,
        name: businessName,
        phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 9999) + 1} Main St, ${params.location}`,
        website: `https://www.${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
        email: `info@${businessName.toLowerCase().replace(/\s+/g, '')}.com`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 500) + 10,
        category: params.keyword,
        hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
        verified: Math.random() > 0.3
      });
    }
    
    return results;
  };

  const tabs = [
    { id: 'search', label: 'Search', icon: FiSearch },
    { id: 'results', label: 'Results', icon: FiDownload, badge: searchResults.length },
    { id: 'history', label: 'History', icon: FiHistory, badge: searchHistory.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-primary-500 p-2 rounded-lg">
                <SafeIcon icon={FiMapPin} className="text-white text-xl" />
              </div>
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Lead Generator
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <SafeIcon icon={FiLogOut} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-soft mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <SafeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'search' && (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SearchForm onSearch={handleSearch} isSearching={isSearching} />
                </motion.div>
              )}

              {activeTab === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultsTable results={searchResults} />
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SearchHistory 
                    history={searchHistory} 
                    onLoadResults={setSearchResults}
                    onTabChange={setActiveTab}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;