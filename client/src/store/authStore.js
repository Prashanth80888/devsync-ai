import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('devsync_auth_token') || null,
  isAuthenticated: !!localStorage.getItem('devsync_auth_token'),
  isLoading: false,

  // Action: Authenticate user using credentials and initialize session
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const { token, data } = response.data;

      localStorage.setItem('devsync_auth_token', token);

      set({
        user: data.user,
        token: token,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };

    } catch (error) {

      set({ isLoading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Authentication operation failed.'
      };
    }
  },

  // Action: Register a fresh organization user account profile
  register: async (fullName, email, password) => {
    set({ isLoading: true });

    try {
      const response = await api.post('/auth/register', {
        fullName,
        email,
        password
      });

      const { token, data } = response.data;

      localStorage.setItem('devsync_auth_token', token);

      set({
        user: data.user,
        token: token,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };

    } catch (error) {

      set({ isLoading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Registration operation failed.'
      };
    }
  },

  // Action: Validate current session tokens and load telemetry on application entry boot
  checkAuthStatus: async () => {

    const storedToken = localStorage.getItem(
      'devsync_auth_token'
    );

    if (!storedToken) {
      set({
        isAuthenticated: false,
        user: null
      });

      return;
    }

    set({ isLoading: true });

    try {

      const response = await api.get('/auth/me');

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {

      // Handled automatically by the axios interceptor token invalidation logic
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  // Action: Wipe session identifiers and safely disconnect user profile
  logout: () => {

    localStorage.removeItem('devsync_auth_token');

    set({
      user: null,
      token: null,
      isAuthenticated: false
    });

    window.location.href = '/auth/login';
  }
}));