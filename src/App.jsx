import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Dashboard /> : <LoginPage />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? <Dashboard /> : <LoginPage />
          } 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;