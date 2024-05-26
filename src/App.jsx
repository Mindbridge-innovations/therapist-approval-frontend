import { Routes, Route } from "react-router-dom";
//import MaintenancePage from "./pages/maintenance"
//import NoMatch from "./components/NoMatch";

import LoginPage from "./pages/login";
import Home from "./pages/home";
import RedirectToHomeIfAuthenticated from "./utils/RedirectToHomeIfAuthenticated";
import Dashboard from "./pages/dashboardPage";
import ContactCategories from "./pages/ContactCategories";
import PrivateRoutes from "./utils/privateRoutes";
import UserProvider from "./utils/contexts/UserProvider";
import Custom404 from "./pages/404page";
import Profile from "./pages/profile";
import Invite from "./pages/Invite";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import Upload from "./pages/upload";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="" element={<RedirectToHomeIfAuthenticated />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
            <Route path="/contact-categories" element={<ContactCategories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/upload" element={<Upload />} />
          </Route>

          <Route path="*" element={<Custom404 />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
