import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('leadgen_auth');
    const savedUser = localStorage.getItem('leadgen_user');
    
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo credentials
      if (credentials.email === 'demo@leadgen.com' && credentials.password === 'demo123') {
        const userData = {
          id: 1,
          email: credentials.email,
          name: 'Demo User',
          avatar: null
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        
        localStorage.setItem('leadgen_auth', 'true');
        localStorage.setItem('leadgen_user', JSON.stringify(userData));
        
        return { success: true };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('leadgen_auth');
    localStorage.removeItem('leadgen_user');
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};