import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, DemoState, Alert, SelectedLocation, User, DemoScenario } from '../types';
import { generateId } from '../utils/helpers';

interface AppContextType {
  authState: AuthState;
  demoState: DemoState;
  selectedLocation: SelectedLocation | null;
  alerts: Alert[];
  isDarkMode: boolean;
  login: (user: User) => void;
  logout: () => void;
  register: (user: User) => void;
  setDemoMode: (isActive: boolean, scenario?: DemoScenario) => void;
  setSelectedLocation: (location: SelectedLocation | null) => void;
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  toggleDarkMode: () => void;
}

const defaultContext: AppContextType = {
  authState: { user: null, isAuthenticated: false, isLoading: false, token: null },
  demoState: { isActive: false, scenario: 'NORMAL', timeMultiplier: 1 },
  selectedLocation: null,
  alerts: [],
  isDarkMode: true,
  login: () => {},
  logout: () => {},
  register: () => {},
  setDemoMode: () => {},
  setSelectedLocation: () => {},
  addAlert: () => {},
  markAlertRead: () => {},
  clearAlerts: () => {},
  toggleDarkMode: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  const [demoState, setDemoState] = useState<DemoState>({
    isActive: false,
    scenario: 'NORMAL',
    timeMultiplier: 1,
  });

  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load auth from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('fg_user');
    if (savedUser) {
      setAuthState({
        user: JSON.parse(savedUser),
        isAuthenticated: true,
        isLoading: false,
        token: 'demo-token',
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
    
    // Apply dark mode class to html
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const login = (user: User) => {
    localStorage.setItem('fg_user', JSON.stringify(user));
    setAuthState({ user, isAuthenticated: true, isLoading: false, token: 'demo-token' });
  };

  const logout = () => {
    localStorage.removeItem('fg_user');
    setAuthState({ user: null, isAuthenticated: false, isLoading: false, token: null });
  };

  const register = (user: User) => {
    login(user);
  };

  const setDemoMode = (isActive: boolean, scenario: DemoScenario = 'NORMAL') => {
    setDemoState(prev => ({ ...prev, isActive, scenario }));
  };

  const addAlert = (alertData: Omit<Alert, 'id' | 'createdAt' | 'read'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const markAlertRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <AppContext.Provider value={{
      authState,
      demoState,
      selectedLocation,
      alerts,
      isDarkMode,
      login,
      logout,
      register,
      setDemoMode,
      setSelectedLocation,
      addAlert,
      markAlertRead,
      clearAlerts,
      toggleDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
