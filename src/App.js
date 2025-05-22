import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from 'react-toastify';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/dashboard/DashboardLayout';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Page Components
import Home from './components/pages/Home';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import SimpleSignUp from './components/pages/SimpleSignUp';

// Dashboard Pages
import DashboardHome from './components/pages/dashboard/DashboardHome';
import BusSchedules from './components/pages/dashboard/BusSchedules';
import Events from './components/pages/dashboard/Events';
import Support from './components/pages/dashboard/Support';
import BusTracking from './components/pages/dashboard/BusTracking';
import Feedback from './components/pages/dashboard/Feedback';
import UserPreferences from './components/pages/dashboard/UserPreferences';
import UserProfile from './components/pages/dashboard/UserProfile';
import UserSettings from './components/pages/dashboard/UserSettings';

// Admin Pages
import AdminHome from './components/admin/AdminHome';
import AdminBuses from './components/admin/AdminBuses';
import AdminDrivers from './components/admin/AdminDrivers';
import AdminUsers from './components/admin/AdminUsers';
import AdminEvents from './components/admin/AdminEvents';
import AdminFeedback from './components/admin/AdminFeedback';
import AdminMaintenance from './components/admin/AdminMaintenance';
import AdminAnalytics from './components/admin/AdminAnalytics';
import Terms from './components/pages/terms-conditions/Terms';
import Faq from './components/pages/Faq';

// Root component to handle authentication redirects
const AppRoutes = () => {
  const { loading, isAuthenticated, currentUser } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          isAuthenticated() ?
          (currentUser?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) :
          <><Navbar /><Home /><Footer /></>
        } />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/terms" element={<><Navbar /><Terms /><Footer /></>} />
        <Route path="/faq" element={<><Navbar /><Faq /><Footer /></>} />
        <Route path="/signup" element={
          isAuthenticated() ?
          (currentUser?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) :
          <><Navbar /><SignUp /><Footer /></>
        } />
        {/* <Route path="/simple-signup" element={
          isAuthenticated() ?
          (currentUser?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) :
          <><Navbar /><SimpleSignUp /><Footer /></>
        } /> */}
        <Route path="/signin" element={
          isAuthenticated() ?
          (currentUser?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />) :
          <><Navbar /><SignIn /><Footer /></>
        } />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="schedules" element={<BusSchedules />} />
            <Route path="events" element={<Events />} />
            <Route path="support" element={<Support />} />
            <Route path="track" element={<BusTracking />} />
            <Route path="feedback" element={<Feedback />} />
            <Route path="preferences" element={<UserPreferences />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="buses" element={<AdminBuses />} />
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="feedback" element={<AdminFeedback />} />
            <Route path="maintenance" element={<AdminMaintenance />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <ToastContainer />
            <AppRoutes />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
