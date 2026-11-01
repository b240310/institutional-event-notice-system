import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Notices from './pages/Notices';
import NoticeDetails from './pages/NoticeDetails';
import NoticeForm from './pages/NoticeForm';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import EventForm from './pages/EventForm';
import MyRegistrations from './pages/MyRegistrations';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout wrapper for authenticated dashboard pages
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main>{children}</main>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* Public Authentication Routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />}
        />

        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
        />

        {/* Protected Application Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Notices Routes */}
        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Notices />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices/create"
          element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <AppLayout>
                <NoticeForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <AppLayout>
                <NoticeForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <NoticeDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Events Routes */}
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Events />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <AppLayout>
                <EventForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'faculty']}>
              <AppLayout>
                <EventForm />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <EventDetails />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Registrations */}
        <Route
          path="/my-registrations"
          element={
            <ProtectedRoute>
              <AppLayout>
                <MyRegistrations />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <AppLayout>
                <NotFound />
              </AppLayout>
            ) : (
              <NotFound />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;

