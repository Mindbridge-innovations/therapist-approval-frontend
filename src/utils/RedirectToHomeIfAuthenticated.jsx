// utils/RedirectToHomeIfAuthenticated.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import Welcome from '../pages/welcome'; // Import the Welcome component

const RedirectToHomeIfAuthenticated = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      navigate('/dashboard');
    }
  }, [auth, navigate]);

  // If not authenticated, render the Welcome component
  return !auth ? <Welcome /> : null;
};

export default RedirectToHomeIfAuthenticated;