import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TodoProvider } from './context/TodoContext';
import { useAuth } from './hooks/useAuth';  // 👈 Import useAuth hook
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <TodoProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </TodoProvider>
      </AuthProvider>
    </Router>
  );
}

// PublicRoute component - Checks if user is already logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();  // 👈 FIXED: useAuth() hook, not AuthProvider()
  
  // Agar user logged in hai to dashboard pe bhejo
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Warna public page (login/register) dikhao
  return children;
};

export default App;