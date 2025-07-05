import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

const { FiDownload, FiExternalLink, FiPhone, FiMail, FiMapPin, FiStar, FiFilter, FiCheck } = FiIcons;

const ResultsTable = ({ results }) => {
  const [filteredResults, setFilteredResults] = useState(results);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRows, setSelectedRows] = useState(new Set());

  React.useEffect(() => {
    setFilteredResults(results);
    setSelectedRows(new Set());
  }, [results]);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);

    const sorted = [...filteredResults].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (field === 'rating') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredResults(sorted);
  };

  const handleSelectRow = (id) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === filteredResults.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredResults.map(r => r.id)));
    }
  };

  const exportToCSV = (selectedOnly = false) => {
    const dataToExport = selectedOnly 
      ? filteredResults.filter(r => selectedRows.has(r.id))
      : filteredResults;

    const csvData = dataToExport.map(result => ({
      'Business Name': result.name,
      'Phone': result.phone,
      'Email': result.email,
      'Website': result.website,
      'Address': result.address,
      'Rating': result.rating,
      'Reviews': result.reviews,
      'Category': result.category,
      'Business Hours': result.hours,
      'Verified': result.verified ? 'Yes' : 'No'
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileName = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly 
      ? filteredResults.filter(r => selectedRows.has(r.id))
      : filteredResults;

    // Create a simple Excel-compatible format
    const headers = ['Business Name', 'Phone', 'Email', 'Website', 'Address', 'Rating', 'Reviews', 'Category', 'Business Hours', 'Verified'];
    const rows = dataToExport.map(result => [
      result.name,
      result.phone,
      result.email,
      result.website,
      result.address,
      result.rating,
      result.reviews,
      result.category,
      result.hours,
      result.verified ? 'Yes' : 'No'
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const fileName = `leads_${new Date().toISOString().split('T')[0]}.xlsx`;
    saveAs(blob, fileName);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <SafeIcon icon={FiMapPin} className="text-gray-400 text-2xl" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
        <p className="text-gray-600">
          Start a search to generate business leads and they'll appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Export Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Search Results ({filteredResults.length} leads)
          </h2>
          <p className="text-gray-600">
            {selectedRows.size > 0 && `${selectedRows.size} selected • `}
            Export or analyze your generated leads
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportToCSV(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-success-600 text-white rounded-lg hover:bg-success-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => exportToExcel(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <SafeIcon icon={FiDownload} />
            <span>Export Excel</span>
          </button>
          {selectedRows.size > 0 && (
            <button
              onClick={() => exportToCSV(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-warning-600 text-white rounded-lg hover:bg-warning-700 transition-colors"
            >
              <SafeIcon icon={FiDownload} />
              <span>Export Selected</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredResults.length && filteredResults.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Business Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('rating')}
                >
                  Rating
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result, index) => (
                <motion.tr
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`hover:bg-gray-50 ${selectedRows.has(result.id) ? 'bg-primary-50' : ''}`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.has(result.id)}
                      onChange={() => handleSelectRow(result.id)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {result.name}
                          {result.verified && (
                            <SafeIcon icon={FiCheck} className="ml-2 text-success-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{result.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {result.phone && (
                        <div className="flex items-center text-sm text-gray-900">
                          <SafeIcon icon={FiPhone} className="mr-2 text-gray-400" />
                          <a href={`tel:${result.phone}`} className="hover:text-primary-600">
                            {result.phone}
                          </a>
                        </div>
                      )}
                      {result.email && (
                        <div className="flex items-center text-sm text-gray-900">
                          <SafeIcon icon={FiMail} className="mr-2 text-gray-400" />
                          <a href={`mailto:${result.email}`} className="hover:text-primary-600">
                            {result.email}
                          </a>
                        </div>
                      )}
                      {result.website && (
                        <div className="flex items-center text-sm text-gray-900">
                          <SafeIcon icon={FiExternalLink} className="mr-2 text-gray-400" />
                          <a 
                            href={result.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-primary-600 truncate max-w-32"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <SafeIcon icon={FiMapPin} className="mr-2 text-gray-400" />
                      <span className="truncate max-w-40">{result.address}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <SafeIcon icon={FiStar} className="mr-1 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{result.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({result.reviews})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {result.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      {result.website && (
                        <a
                          href={result.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <SafeIcon icon={FiExternalLink} />
                        </a>
                      )}
                      {result.phone && (
                        <a
                          href={`tel:${result.phone}`}
                          className="text-success-600 hover:text-success-700"
                        >
                          <SafeIcon icon={FiPhone} />
                        </a>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;