// contexts/UserProvider.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import UserContext from "./UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            import.meta.env.VITE_API_URL + "/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data.userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("token");
          navigate("/login")
        }
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Define PropTypes for UserProvider
UserProvider.propTypes = {
  children: PropTypes.node.isRequired, // Validate children prop
};

export default UserProvider;
