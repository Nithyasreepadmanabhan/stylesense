import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types/user';
import { MOCK_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  setRole: (role: UserRole) => void;
  switchUserPersona: (userId: string) => void;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Sophia Bennett (User)
  const [activeRole, setActiveRole] = useState<UserRole>('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  useEffect(() => {
    setActiveRole(currentUser.role);
  }, [currentUser]);

  const setRole = (role: UserRole) => {
    setActiveRole(role);
    // Find sample user matching role
    const matched = MOCK_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
    }
  };

  const switchUserPersona = (userId: string) => {
    const target = MOCK_USERS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      setActiveRole(target.role);
    }
  };

  const login = (email: string, role: UserRole = 'user') => {
    const found = MOCK_USERS.find(u => u.email === email) || {
      id: `usr-${Date.now()}`,
      userId: `auth-${Date.now()}`,
      fullName: email.split('@')[0],
      username: email.split('@')[0],
      email,
      role,
      createdAt: new Date().toISOString()
    };
    setCurrentUser(found);
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      activeRole,
      setRole,
      switchUserPersona,
      isAuthenticated,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
