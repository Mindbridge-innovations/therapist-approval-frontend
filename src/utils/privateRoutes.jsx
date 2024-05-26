// utils/privateRoutes.js
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const PrivateRoutes = () => {
  const auth = useAuth(); // Call the useAuth hook
  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
