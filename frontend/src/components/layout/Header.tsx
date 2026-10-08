import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

export const Header: React.FC = () => {
  const { authState, demoState, alerts, setDemoMode, logout } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const unreadAlertsCount = alerts.filter(a => !a.read).length;

  const isActive = (path: string) => location.pathname === path;
  const navLinkClass = (path: string) => `
    px-3 py-2 rounded-md text-sm font-medium transition-colors
    ${isActive(path) 
      ? 'bg-slate-800 text-white' 
      : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'}
  `;

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                FG
              </div>
              <span className="font-bold text-xl tracking-tight text-white">FloodGuard</span>
            </Link>
            
            {demoState.isActive && (
              <span className="ml-4 px-2 py-0.5 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
                DEMO MODE
              </span>
            )}

            <nav className="hidden md:flex ml-8 space-x-2">
              <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
              <Link to="/report" className={navLinkClass('/report')}>Report</Link>
              {authState.user?.role === 'ADMIN' && (
                <Link to="/admin" className={navLinkClass('/admin')}>Admin</Link>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Demo Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Demo</span>
              <button
                onClick={() => setDemoMode(!demoState.isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${demoState.isActive ? 'bg-amber-500' : 'bg-slate-700'}`}
                aria-pressed={demoState.isActive}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${demoState.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Alerts */}
            <Link to="/alerts" className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              )}
            </Link>

            {/* User Menu */}
            {authState.isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-800">
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-medium text-white">{authState.user?.name}</div>
                  <div className="text-xs text-slate-400">{authState.user?.role}</div>
                </div>
                <button 
                  onClick={logout}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-800">
                <Link to="/auth/login" className="text-sm text-slate-300 hover:text-white transition-colors">Login</Link>
                <Link to="/auth/register" className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/dashboard" className={`block ${navLinkClass('/dashboard')}`}>Dashboard</Link>
            <Link to="/report" className={`block ${navLinkClass('/report')}`}>Report</Link>
            <Link to="/alerts" className={`block ${navLinkClass('/alerts')}`}>
              Alerts {unreadAlertsCount > 0 && `(${unreadAlertsCount})`}
            </Link>
            {authState.user?.role === 'ADMIN' && (
              <Link to="/admin" className={`block ${navLinkClass('/admin')}`}>Admin</Link>
            )}
          </div>
          <div className="px-4 py-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-sm text-slate-400">Demo Mode</span>
            <button
              onClick={() => setDemoMode(!demoState.isActive)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${demoState.isActive ? 'bg-amber-500' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${demoState.isActive ? 'translate-x-4' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
