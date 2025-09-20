import React, { useState, useEffect, ReactNode, useCallback } from 'react';
import {
  signin, signup, storeToken, removeToken, isAuthenticated, UserSignin, UserSignup,
  UserUpdate, updateUser, getUser, User, updatePassword, UpdatePasswordRequest
} from '@/api';
import { AuthContext } from './AuthContext.types';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleFetchUser = useCallback(async () => {
    const response = await getUser();
    setUser({
      username: response.data.username,
      email: response.data.email,
      week_start_day: response.data.week_start_day,
    });
  }, []);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      if (isAuthenticated()) {
        try {
          await handleFetchUser();
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          removeToken();
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [handleFetchUser]);

  const handleSignin = async (credentials: UserSignin) => {
    setIsLoading(true);
    try {
      const response = await signin(credentials);
      storeToken(response.data);

      await handleFetchUser();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (userData: UserSignup) => {
    setIsLoading(true);
    try {
      const response = await signup(userData);
      setUser(response.data);

      // automatically signin new user
      await handleSignin({
        username: userData.username,
        password: userData.password
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    setUser(null);
  };

  const handleUpdateUser = async (userData: UserUpdate) => {
    await updateUser(userData);
    // Fetch updated user data to refresh the local state
    await handleFetchUser();
  };

  const handleUpdatePassword = async (data: UpdatePasswordRequest) => {
    await updatePassword(data);
    // No need to refetch user as password change doesn't alter user profile fields
  };

  const value = {
    isAuthenticated: Boolean(user),
    user,
    signin: handleSignin,
    signup: handleSignup,
    logout: handleLogout,
    fetchUser: handleFetchUser,
    updateUser: handleUpdateUser,
    updatePassword: handleUpdatePassword,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
