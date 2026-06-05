import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Home from './pages/Home';
import MatchDetail from './pages/MatchDetail';
import Admin from './pages/Admin';
import Fixture from './pages/Fixture';
import GlobalLeaderboard from './pages/GlobalLeaderboard';
import AppShell from './components/AppShell';
import GroupView from './pages/GroupView';
import JoinGroup from './pages/JoinGroup';
import CreateGroup from './pages/CreateGroup';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
  });

  if (requiredRole && user?.role !== requiredRole) {
    return <PageNotFound />;
  }

  return children;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/match/:matchId" element={<MatchDetail />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Admin />
          </ProtectedRoute>
        } />
        <Route path="/fixture" element={<Fixture />} />
        <Route path="/ranking" element={<GlobalLeaderboard />} />
        <Route path="/join" element={<JoinGroup />} />
        <Route path="/join/:code" element={<JoinGroup />} />
        <Route path="/group/:groupId" element={<GroupView />} />
        <Route path="/create-group" element={<CreateGroup />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App