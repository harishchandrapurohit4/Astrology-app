import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Astrologers from './pages/Astrologers';
import UserDashboard from './pages/dashboard/UserDashboard';
import AstrologerDashboard from './pages/dashboard/AstrologerDashboard';
import Wallet from './pages/Wallet';
import Consultation from './pages/Consultation';
import Horoscope from './pages/Horoscope';
import Kundli from './pages/Kundli';
import AstrologerProfile from './pages/AstrologerProfile';
import AstroTrading from './pages/AstroTrading';

function DashboardRouter() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (profile?.role === 'astrologer') {
    return <AstrologerDashboard />;
  }

  return <UserDashboard />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/astrologers"
            element={
              <Layout>
                <Astrologers />
              </Layout>
            }
          />

          <Route
            path="/astrologer/:id"
            element={
              <Layout>
                <AstrologerProfile />
              </Layout>
            }
          />

          <Route
            path="/horoscope"
            element={
              <Layout>
                <Horoscope />
              </Layout>
            }
          />

          <Route
            path="/horoscope/:sign"
            element={
              <Layout>
                <Horoscope />
              </Layout>
            }
          />

          <Route
            path="/kundli"
            element={
              <Layout>
                <Kundli />
              </Layout>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/astrologer/dashboard"
            element={
              <ProtectedRoute requiredRole="astrologer">
                <Layout>
                  <AstrologerDashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Layout>
                  <Wallet />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/consultation/:astrologerId"
            element={
              <ProtectedRoute>
                <Consultation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/astro-trading"
            element={
              <Layout>
                <AstroTrading />
              </Layout>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
