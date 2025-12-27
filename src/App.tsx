import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { getConfig } from "@/config.ts";
import { setupAxiosInterceptors } from '@api/auth';
import ProtectedRoute from '@auth/ProtectedRoute';
import Signin from '@auth/Signin';
import Signup from '@auth/Signup';
import { AuthProvider } from '@contexts/AuthContext';
import Planner from '@planner/Planner';
import Layout from '@sections/Layout';
import Settings from '@settings/Settings';
import SettingsPlanner from '@settings/components/SettingsPlanner/SettingsPlanner.tsx';
import SettingsProfile from '@settings/components/SettingsProfile/SettingsProfile.tsx';

// Setup axios interceptors for token inclusion before mounting the App
setupAxiosInterceptors();

function App() {
  const { IS_SIGNUP_DISABLED } = getConfig();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/signin/" element={<Signin />} />
          {!IS_SIGNUP_DISABLED && <Route path="/signup/" element={<Signup />} />}
          {IS_SIGNUP_DISABLED && (
            <Route path="/signup/" element={<Navigate to="/signin/" replace />} />
          )}

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Navigate to="/planner/" replace />} />
              <Route path="planner" element={<Planner />} />
              <Route path="projects" element={<Navigate to="/planner/" replace />} />
              <Route path="notes" element={<Navigate to="/planner/" replace />} />
              <Route path="settings" element={<Settings />}>
                <Route index element={<Navigate to="/settings/profile/" replace />} />
                <Route path="profile" element={<SettingsProfile />} />
                <Route path="planner" element={<SettingsPlanner />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
