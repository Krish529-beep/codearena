import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/layout/Navbar';
import LoadingScreen from '@/components/common/LoadingScreen';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Onboarding from '@/pages/Onboarding';
import Dashboard from '@/pages/Dashboard';
import Groups from '@/pages/Groups';
import GroupDetail from '@/pages/GroupDetail';
import Leaderboard from '@/pages/Leaderboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.onboarded) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

const OnboardingRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.onboarded) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (user && !user.onboarded) return <Navigate to="/onboarding" replace />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/signup" element={
          <PublicRoute><Signup /></PublicRoute>
        } />

        <Route path="/onboarding" element={
          <OnboardingRoute><Onboarding /></OnboardingRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/groups" element={
          <ProtectedRoute><Groups /></ProtectedRoute>
        } />
        <Route path="/groups/:id" element={
          <ProtectedRoute><GroupDetail /></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute><Leaderboard /></ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
