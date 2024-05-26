import { Routes, Route } from "react-router-dom";
//import MaintenancePage from "./pages/maintenance"
//import NoMatch from "./components/NoMatch";
import RegistrationPage from "./pages/register";
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

function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<RedirectToHomeIfAuthenticated />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contact-categories" element={<ContactCategories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/invite" element={<Invite />} />
          </Route>

          <Route path="*" element={<Custom404 />} />
        </Routes>
      </UserProvider>
    </>
  );
}

export default App;
