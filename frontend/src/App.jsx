import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Navigation from './components/layout/Navigation';
import StudentDirectoryPage from './pages/Students/StudentDirectoryPage';
import StudentProfileDashboard from './pages/Students/StudentProfileDashboard';
import ScholarshipManagement from './pages/Scholarships/ScholarshipManagement';
import MeetingsPage from './pages/Meetings/MeetingsPage';
import './App.css';

/**
 * Create React Query Client with custom configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
    },
  },
});

/**
 * Main Routes Component
 * Separated to use useLocation hook for persistence
 */
function AppRoutes() {
  const location = useLocation();

  // Log navigation for debugging
  useEffect(() => {
    console.log('Navigated to:', location.pathname);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<StudentDirectoryPage />} />
      <Route path="/students" element={<StudentDirectoryPage />} />
      <Route path="/students/:id" element={<StudentProfileDashboard />} />
      <Route path="/scholarships" element={<ScholarshipManagement />} />
      <Route path="/scholarships/:id" element={<ScholarshipManagement />} />
      <Route path="/meetings" element={<MeetingsPage />} />
      <Route path="/meetings/:id" element={<MeetingsPage />} />
      {/* Redirect to student directory for unmatched routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Root App Component
 * 
 * Sets up:
 * - React Query Provider
 * - Routing with Navigation
 * - Global styles
 * - Persistent navigation (via URL-based routing)
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app">
          {/* Navigation Bar */}
          <Navigation />
          
          {/* Main Content Area */}
          <main className="app__main">
            <AppRoutes />
          </main>

          {/* Footer */}
          <footer className="app__footer">
            <div className="app__footer-content">
              <p>&copy; 2026 Student Hub. All rights reserved.</p>
              <div className="app__footer-links">
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <a href="#privacy">Privacy</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
