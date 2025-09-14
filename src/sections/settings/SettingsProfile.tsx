import React, { useEffect, useState } from 'react';
import type { WeekStartDay } from '@api/auth';
import { REFRESH_EVENT } from '@common/events';
import { useAuth } from '@contexts/hooks/useAuth.ts';

const SettingsProfile: React.FC = () => {
  const { user, updateUser, fetchUser } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>('monday');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setWeekStartDay(user.week_start_day);
    }
  }, [user]);

  // Check if any fields have changed
  useEffect(() => {
    if (user) {
      const hasFieldChanges =
        username !== user.username ||
        email !== user.email ||
        weekStartDay !== user.week_start_day ||
        password.length > 0;

      setHasChanges(hasFieldChanges);
    }
  }, [user, username, email, weekStartDay, password]);

  // Refresh listener to refetch user data when on settings page
  useEffect(() => {
    const handler = () => {
      void fetchUser();
    };
    window.addEventListener(REFRESH_EVENT, handler);
    return () => {
      window.removeEventListener(REFRESH_EVENT, handler);
    };
  }, [fetchUser]);

  const handleSettingsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdatingSettings(true);
      setError(null);

      const settingsData = {
        username: username !== user?.username ? username : undefined,
        email: email !== user?.email ? email : undefined,
        week_start_day: weekStartDay !== user?.week_start_day ? weekStartDay : undefined,
        password: password ? password : undefined,
      };

      // Only proceed if there are changes to make
      if (Object.values(settingsData).some((value) => value !== undefined)) {
        await updateUser(settingsData);
        setSuccessMessage('Settings updated successfully!');
        setPassword('');

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setError('No changes to update.');
      }
    } catch (err) {
      setError('Failed to update settings. Please check your information and try again.');
      console.error('Error updating settings:', err);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  return (
    <div className="px-0 md:px-6 mb-4 w-full md:max-w-1/3">
      <h3 className="text-2xl font-light mb-6">Profile</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-3 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSettingsUpdate} className="space-y-4">
        <div className="space-y-3 mb-6">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="username">Username</label>
            <input id="username" type="text" value={username} required
                   onChange={(e) => setUsername(e.target.value)}
                   className="shadow appearance-none border rounded w-full py-1.5 px-2 text-gray-700 leading-tight
                              focus:outline-none focus:shadow-outline text-sm" />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} required
                   onChange={(e) => setEmail(e.target.value)}
                   className="shadow appearance-none border rounded w-full py-1.5 px-2 text-gray-700 leading-tight
                              focus:outline-none focus:shadow-outline text-sm" />
          </div>

          <div className="mb-6">
            <label className="block text-gray-600 text-sm font-medium mb-1" htmlFor="password">Password</label>
            <input id="password" type="password" value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="shadow appearance-none border rounded w-full py-1.5 px-2 text-gray-700 leading-tight
                              focus:outline-none focus:shadow-outline text-sm" />
          </div>

          <h4 className="text-gray-600 text-sm font-medium">Week Starts On</h4>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input id="sunday" type="radio" name="weekStartDay" value="sunday"
                     checked={weekStartDay === 'sunday'}
                     onChange={() => setWeekStartDay('sunday')}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="sunday" className="ml-2 block text-sm text-gray-700">Sunday</label>
            </div>
            <div className="flex items-center">
              <input id="monday" type="radio" name="weekStartDay" value="monday"
                     checked={weekStartDay === 'monday'}
                     onChange={() => setWeekStartDay('monday')}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="monday" className="ml-2 block text-sm text-gray-700">Monday</label>
            </div>
          </div>
        </div>

        <div>
          <button type="submit"
                  disabled={isUpdatingSettings || !hasChanges}
                  className={`${hasChanges ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
                            text-white font-medium py-1.5 px-8 rounded focus:outline-none focus:shadow-outline 
                              text-sm`} >
            {isUpdatingSettings ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsProfile;
