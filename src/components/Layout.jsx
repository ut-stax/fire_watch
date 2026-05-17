import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { signOut } from '../firebase/auth';
import { TimeRangeSelector } from './TimeRangeSelector';
import { useGlobalTimeRange } from '../contexts/TimeRangeContext';
import { useState, useEffect } from 'react';

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const timeRange = useGlobalTimeRange();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Don't show layout on login page
  if (location.pathname === '/login') {
    return children;
  }

  // Check viewport width for responsive behavior
  useEffect(() => {
    const checkWidth = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const isActive = (path) => location.pathname === path ? 'bg-blue-600' : '';

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${sidebarCollapsed ? 'w-16' : 'w-64'} 
        bg-gray-800 border-r border-gray-700 p-4 flex flex-col
        transition-all duration-300 ease-in-out
        ${isMobile ? 'fixed z-30 h-full' : 'relative'}
      `}>
        <div className="mb-8 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div>
              <h1 className="text-2xl font-bold text-white">FireWatch</h1>
              <p className="text-gray-400 text-xs">SIEM Dashboard</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? '☰' : '✕'}
          </button>
        </div>

        {/* User Info */}
        {user && !sidebarCollapsed && (
          <div className="mb-6 p-3 bg-gray-700 rounded text-xs">
            <p className="text-gray-300 font-medium">Logged in as:</p>
            <p className="text-gray-400 truncate">{user.email || user.displayName}</p>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <Link
            to="/"
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded transition ${isActive('/')} hover:bg-gray-700`}
            title="Dashboard"
          >
            <span className="text-lg">📊</span>
            {!sidebarCollapsed && <span className="ml-3">Dashboard</span>}
          </Link>
          <Link
            to="/logs"
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded transition ${isActive('/logs')} hover:bg-gray-700`}
            title="Log Explorer"
          >
            <span className="text-lg">🔍</span>
            {!sidebarCollapsed && <span className="ml-3">Log Explorer</span>}
          </Link>
          <Link
            to="/alerts"
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded transition ${isActive('/alerts')} hover:bg-gray-700`}
            title="Alerts"
          >
            <span className="text-lg">⚠️</span>
            {!sidebarCollapsed && <span className="ml-3">Alerts</span>}
          </Link>
          <Link
            to="/ingest"
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded transition ${isActive('/ingest')} hover:bg-gray-700`}
            title="Log Ingestion"
          >
            <span className="text-lg">📥</span>
            {!sidebarCollapsed && <span className="ml-3">Log Ingestion</span>}
          </Link>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition font-medium`}
          title="Logout"
        >
          <span className="text-lg">🚪</span>
          {!sidebarCollapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-900">
        {/* Time Range Selector in Header */}
        <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
          <TimeRangeSelector timeRange={timeRange} onTimeRangeChange={timeRange} />
        </div>
        {children}
      </div>
    </div>
  );
}