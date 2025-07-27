import { createContext } from 'react';
import { User, UserSignin, UserSignup, UserUpdate } from '@api/auth';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signin: (credentials: UserSignin) => Promise<void>;
  signup: (userData: UserSignup) => Promise<void>;
  logout: () => void;
  fetchUser: () => void;
  updateUser: (userData: UserUpdate) => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
