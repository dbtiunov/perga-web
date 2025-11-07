import axios from 'axios';

const AUTH_API_URL = `${import.meta.env.VITE_API_BASE_URL}/auth`;

export type WeekStartDay = 'monday' | 'sunday';

export interface User {
  username: string;
  email: string;
  week_start_day: WeekStartDay;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  week_start_day?: WeekStartDay;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserSignin {
  username: string;
  password: string;
}

export interface UserSignup {
  username: string;
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  refresh_token?: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export const storeToken = (token: Token) => {
  localStorage.setItem('auth_token', token.access_token);
  localStorage.setItem('token_type', token.token_type);
  if (token.refresh_token) {
    localStorage.setItem('refresh_token', token.refresh_token);
  }
};

export const getToken = (): Token | null => {
  const access_token = localStorage.getItem('auth_token');
  const token_type = localStorage.getItem('token_type');
  const refresh_token = localStorage.getItem('refresh_token');

  if (access_token && token_type) {
    return { access_token, token_type, refresh_token: refresh_token || undefined };
  }

  return null;
};

export const removeToken = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_type');
  localStorage.removeItem('refresh_token');
};

export const isAuthenticated = (): boolean => {
  return Boolean(getToken());
};

// Create a new user
export const signup = (userData: UserSignup) =>
  axios.post<User>(`${AUTH_API_URL}/signup/`, userData);

export const signin = (userData: UserSignin) =>
  axios.post<Token>(`${AUTH_API_URL}/access_token_json/`, userData);

export const refreshToken = (refreshTokenData: RefreshTokenRequest) =>
  axios.post<Token>(`${AUTH_API_URL}/refresh_token/`, refreshTokenData);

export const getUser = () => axios.get<User>(`${AUTH_API_URL}/user/`);

export const updateUser = (userData: UserUpdate) =>
  axios.put<User>(`${AUTH_API_URL}/user/`, userData);

export const updatePassword = (data: UpdatePasswordRequest) =>
  axios.put<void>(`${AUTH_API_URL}/user/password/`, data);

// Configure axios to include the token in all requests
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token.access_token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Add response interceptor to handle 401 errors
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // If the error is a 401 Unauthorized and we haven't tried to refresh the token yet
      // Also, avoid attempting refresh for the refresh endpoint itself to prevent infinite loop
      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !originalRequest?.url?.includes('/auth/refresh_token/')
      ) {
        originalRequest._retry = true;

        const token = getToken();
        if (token && token.refresh_token) {
          try {
            const response = await refreshToken({ refresh_token: token.refresh_token });
            storeToken(response.data);

            // Update the Authorization header and retry the original request
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${response.data.access_token}`,
            };
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Failed to refresh token:', refreshError);
            // If refresh token is invalid, log the user out
            removeToken();
            // Redirect to signin page only if we're not already there
            if (!window.location.pathname.includes('/signin/')) {
              window.location.href = '/signin/';
            }
            return Promise.reject(refreshError);
          }
        } else {
          console.error('No refresh token available for request:', originalRequest.url);
          // If no refresh token is available, log the user out
          removeToken();
          // Redirect to signin page only if we're not already there
          if (!window.location.pathname.includes('/signin/')) {
            window.location.href = '/signin/';
          }
        }
      }
      return Promise.reject(error);
    },
  );
};
