import { createContext } from 'react';

import { UserDTO, UserSigninDTO, UserSignupDTO, UserUpdateDTO, UpdatePasswordDTO } from '@api/auth';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDTO | null;
  signin: (credentials: UserSigninDTO) => Promise<void>;
  signup: (userData: UserSignupDTO) => Promise<void>;
  logout: () => void;
  fetchUser: () => void;
  updateUser: (userData: UserUpdateDTO) => Promise<void>;
  updatePassword: (data: UpdatePasswordDTO) => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
