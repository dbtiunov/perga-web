import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { setupAxiosInterceptors } from '@api/auth';
import ProtectedRoute from '@auth/ProtectedRoute';
import Signin from '@auth/Signin';
import Signup from '@auth/Signup';
import { AuthProvider } from '@contexts/AuthContext';
import Layout from '@sections/Layout';
import Planner from '@planner/Planner';
import Settings from '@settings/Settings';

// Get the signup disabled flag from environment variables
const isSignupDisabled = import.meta.env.VITE_IS_SIGNUP_DISABLED === 'true';

// Setup axios interceptors for token inclusion before mounting the App
setupAxiosInterceptors();

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/signin/" element={<Signin />} />
          {!isSignupDisabled && <Route path="/signup/" element={<Signup />} />}
          {isSignupDisabled && <Route path="/signup/" element={<Navigate to="/signin/" replace />} />}

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/planner/" replace />} />
              <Route path="planner" element={<Planner />} />
              <Route path="projects" element={<Navigate to="/planner/" replace />} />
              <Route path="notes" element={<Navigate to="/planner/" replace />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
