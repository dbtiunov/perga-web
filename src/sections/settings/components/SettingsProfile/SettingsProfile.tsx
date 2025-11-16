import React, { useEffect, useState } from 'react';
import {
  updateUser,
  type UserUpdate,
  updatePassword,
  type UpdatePasswordRequest,
  type WeekStartDay,
} from '@api/auth.ts';
import { REFRESH_EVENT } from '@common/events.ts';
import { useAuth } from '@contexts/hooks/useAuth.ts';
import { useToast } from '@contexts/hooks/useToast.ts';

const SettingsProfile: React.FC = () => {
  const { user, fetchUser } = useAuth();
  const { showToast, showError } = useToast();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [weekStartDay, setWeekStartDay] = useState<WeekStartDay>('monday');
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [hasPasswordChanges, setHasPasswordChanges] = useState(false);

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setWeekStartDay(user.week_start_day);
    }
  }, [user]);

  // Check if any profile fields have changed
  useEffect(() => {
    if (user) {
      const hasFieldChanges =
        username !== user.username || email !== user.email || weekStartDay !== user.week_start_day;

      setHasChanges(hasFieldChanges);
    }
  }, [user, username, email, weekStartDay]);

  // Check if password fields have values to enable password update
  useEffect(() => {
    setHasPasswordChanges(Boolean(currentPassword) && Boolean(newPassword));
  }, [currentPassword, newPassword]);

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdatingSettings(true);

      const settingsData: UserUpdate = {
        username: username !== user?.username ? username : undefined,
        email: email !== user?.email ? email : undefined,
        week_start_day: weekStartDay !== user?.week_start_day ? weekStartDay : undefined,
      };

      // Only proceed if there are changes to make
      if (Object.values(settingsData).some((value) => value !== undefined)) {
        await updateUser(settingsData);
        showToast('Settings updated successfully', 'success');
        fetchUser();
      } else {
        showError('No changes to update.');
      }
    } catch (err) {
      showError('Failed to update settings. Please check your information and try again.');
      console.error('Error updating settings:', err);
    } finally {
      setIsUpdatingSettings(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUpdatingPassword(true);

      if (!currentPassword || !newPassword) {
        showError('Please provide both current and new password.');
        return;
      }

      const payload: UpdatePasswordRequest = {
        current_password: currentPassword,
        new_password: newPassword,
      };

      await updatePassword(payload);
      showToast('Password updated successfully', 'success');

      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showError('Failed to update password. Please check your information and try again.');
      console.error('Error updating password:', err);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="w-full md:max-w-2/5">
      <form onSubmit={handleProfileUpdate}>
        <fieldset className="border border-gray-400 rounded-md p-8">
          <legend className="px-2 text-text-main">Edit Profile</legend>

          <div className="space-y-5">
            <div className="mb-6">
              <label className="block text-text-main text-sm font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border border-gray-400 rounded w-full py-1.5 px-2 text-text-main leading-tight
                                focus:outline-none focus:shadow-outline text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-text-main text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-1.5 px-2 text-text-main leading-tight
                                focus:outline-none focus:shadow-outline text-sm"
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-text-main text-sm font-medium">Week Starts On</h4>

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <input
                    id="sunday"
                    type="radio"
                    name="weekStartDay"
                    value="sunday"
                    checked={weekStartDay === 'sunday'}
                    onChange={() => setWeekStartDay('sunday')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="sunday" className="ml-2 block text-sm text-text-main">
                    Sunday
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="monday"
                    type="radio"
                    name="weekStartDay"
                    value="monday"
                    checked={weekStartDay === 'monday'}
                    onChange={() => setWeekStartDay('monday')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="monday" className="ml-2 block text-sm text-text-main">
                    Monday
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex">
            <button
              type="submit"
              disabled={isUpdatingSettings || !hasChanges}
              className={`${hasChanges ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
                              text-white font-medium py-1.5 px-8 rounded focus:outline-none focus:shadow-outline 
                                text-sm`}
            >
              {isUpdatingSettings ? 'Updating...' : 'Update'}
            </button>
          </div>
        </fieldset>
      </form>

      <form onSubmit={handlePasswordUpdate}>
        <fieldset className="border border-gray-400 rounded-md p-8 mb-6">
          <legend className="px-2 text-text-main">Change Password</legend>

          <div className="space-y-5">
            <div className="mb-6">
              <label className="text-text-main text-sm font-medium mb-1" htmlFor="currentPassword">
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-1.5 px-2 text-text-main leading-tight
                                focus:outline-none focus:shadow-outline text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="text-text-main text-sm font-medium mb-1" htmlFor="newPassword">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-1.5 px-2 text-text-main leading-tight
                                focus:outline-none focus:shadow-outline text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword || !hasPasswordChanges}
              className={`${hasPasswordChanges ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}
                              text-white font-medium py-1.5 px-8 rounded focus:outline-none focus:shadow-outline 
                                text-sm`}
            >
              {isUpdatingPassword ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default SettingsProfile;
