import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiSearch, FiUsers, FiStar, FiTrendingUp } = FiIcons;

const StatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Searches',
      value: stats.totalSearches,
      icon: FiSearch,
      color: 'primary',
      description: 'Searches performed'
    },
    {
      title: 'Leads Generated',
      value: stats.totalLeads,
      icon: FiUsers,
      color: 'success',
      description: 'Business contacts found'
    },
    {
      title: 'Average Rating',
      value: stats.avgRating,
      icon: FiStar,
      color: 'warning',
      description: 'Quality of businesses'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: FiTrendingUp,
      color: 'primary',
      description: 'Lead generation rate'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-500 text-white',
      success: 'bg-success-500 text-white',
      warning: 'bg-warning-500 text-white',
      danger: 'bg-danger-500 text-white'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-white rounded-xl shadow-soft p-6 hover:shadow-medium transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {card.description}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${getColorClasses(card.color)}`}>
              <SafeIcon icon={card.icon} className="text-xl" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;