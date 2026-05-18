import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { useTimeRange } from './hooks/useTimeRange';
import { TimeRangeContext } from './contexts/TimeRangeContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import LogExplorer from './pages/LogExplorer';
import Alerts from './pages/Alerts';
import Login from './pages/Login';
import { LogIngestion } from './pages/LogIngestion';

function App() {
  const timeRange = useTimeRange();

  return (
    <AuthProvider>
      <TimeRangeContext.Provider value={timeRange}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Dashboard />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logs"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <LogExplorer />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/alerts"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Alerts />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ingest"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <LogIngestion />
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </TimeRangeContext.Provider>
    </AuthProvider>
  );
}

export default App;