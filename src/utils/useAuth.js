// utils/useAuth.js
export const useAuth = () => {
    // Getting token from local storage
    const token = localStorage.getItem('token');
    // Checking whether token is present or not
    return token ? true : false;
  };