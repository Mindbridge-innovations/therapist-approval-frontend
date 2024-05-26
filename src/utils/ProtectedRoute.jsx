import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UserContext from './contexts/UserContext';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  if (!user) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect them to the home page or any other page if they don't have permission
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
    allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
  };

export default ProtectedRoute;