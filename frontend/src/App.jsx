import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PromoteUsers from "./pages/PromoteUsers";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = useAuth(); // Use the context instead of direct localStorage access

  return (
    <Routes>
      {/* Home route */}
      <Route 
        path="/" 
        element={<Home />}
        // element={user ? <Navigate to="/dashboard" /> : <Home />} 
      />
      
      {/* Auth routes */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" /> : <Register />} 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          !user ? (
            <Navigate to="/login" state={{ from: '/dashboard' }} />
          ) : (
            <Dashboard />
          )
        }
      />
      <Route
        path="/promote"
        element={
          !user ? (
            <Navigate to="/login" state={{ from: '/promote' }} />
          ) : user.role !== "admin" ? (
            <Navigate to="/dashboard" />
          ) : (
            <PromoteUsers />
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div>
            <Navbar />
            <AppRoutes />
            <footer className="bg-gray-800 text-white text-center py-4 mt-8">
              <p>&copy; {new Date().getFullYear()} Crime Tracking System</p>
            </footer>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;