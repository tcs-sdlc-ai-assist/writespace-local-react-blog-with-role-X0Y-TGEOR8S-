import { Navigate } from 'react-router-dom';
import { isAuthenticated, getRole } from '../utils/auth.js';

export function ProtectedRoute({ children, adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && getRole() !== 'admin') {
    return <Navigate to="/blogs" replace />;
  }

  return children;
}