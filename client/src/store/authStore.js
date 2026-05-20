import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({

  // ==================================================
  // GLOBAL AUTH STATE
  // ==================================================

  user: JSON.parse(localStorage.getItem('devsync_user')) || null,

  token:
    localStorage.getItem('devsync_token') ||
    localStorage.getItem('devsync_auth_token') ||
    null,

  isAuthenticated:
    !!localStorage.getItem('devsync_token') ||
    !!localStorage.getItem('devsync_auth_token'),

  isLoading: false,

  // ==================================================
  // LOGIN
  // ==================================================

  login: async (email, password) => {

    set({ isLoading: true });

    try {

      const response = await api.post(
        '/auth/login',
        { email, password }
      );

      // Supports both backend response structures
      const token =
        response.data?.token ||
        response.data?.data?.token;

      const user =
        response.data?.user ||
        response.data?.data?.user;

      // Persist Session
      localStorage.setItem(
        'devsync_token',
        token
      );

      localStorage.setItem(
        'devsync_auth_token',
        token
      );

      localStorage.setItem(
        'devsync_user',
        JSON.stringify(user)
      );

      // Update Store
      set({
        token,
        user,
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
          'Authentication failed.'
      };
    }
  },

  // ==================================================
  // REGISTER
  // ==================================================

  register: async (
    fullName,
    email,
    password
  ) => {

    set({ isLoading: true });

    try {

      const response = await api.post(
        '/auth/register',
        {
          fullName,
          email,
          password
        }
      );

      // Supports both backend response structures
      const token =
        response.data?.token ||
        response.data?.data?.token;

      const user =
        response.data?.user ||
        response.data?.data?.user;

      // Persist Session
      localStorage.setItem(
        'devsync_token',
        token
      );

      localStorage.setItem(
        'devsync_auth_token',
        token
      );

      localStorage.setItem(
        'devsync_user',
        JSON.stringify(user)
      );

      // Update Store
      set({
        token,
        user,
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
          'Registration failed.'
      };
    }
  },

  // ==================================================
  // AUTH STATUS VALIDATION
  // ==================================================

  checkAuthStatus: async () => {

    const storedToken =
      localStorage.getItem('devsync_token') ||
      localStorage.getItem('devsync_auth_token');

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

      const user =
        response.data?.user ||
        response.data?.data?.user;

      localStorage.setItem(
        'devsync_user',
        JSON.stringify(user)
      );

      set({
        user,
        token: storedToken,
        isAuthenticated: true,
        isLoading: false
      });

    } catch (error) {

      // Session Invalid
      localStorage.removeItem('devsync_token');
      localStorage.removeItem('devsync_auth_token');
      localStorage.removeItem('devsync_user');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  // ==================================================
  // ORGANIZATION CREATION
  // ==================================================

  createOrganization: async (orgName) => {

    set({ isLoading: true });

    try {

      const response = await api.post(
        '/orgs',
        { name: orgName }
      );

      const organization =
        response.data?.organization ||
        response.data?.data?.organization;

      const currentUser = get().user;

      // Updated User
      const updatedUser = {
        ...currentUser,
        orgId: organization.id,
        role: 'ORG_ADMIN'
      };

      // Persist Updated User
      localStorage.setItem(
        'devsync_user',
        JSON.stringify(updatedUser)
      );

      set({
        user: updatedUser,
        isLoading: false
      });

      return { success: true };

    } catch (error) {

      set({ isLoading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Failed to initialize workspace.'
      };
    }
  },

  // ==================================================
  // PROFILE UPDATE
  // ==================================================

  updateProfile: async (fullName) => {

    set({ isLoading: true });

    try {

      const response = await api.put(
        '/users/profile',
        { fullName }
      );

      const user =
        response.data?.user ||
        response.data?.data?.user;

      // Persist Updated Profile
      localStorage.setItem(
        'devsync_user',
        JSON.stringify(user)
      );

      set({
        user,
        isLoading: false
      });

      return { success: true };

    } catch (error) {

      set({ isLoading: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Profile update failed.'
      };
    }
  },

  // ==================================================
  // LOGOUT
  // ==================================================

  logout: () => {

    // Clear Local Storage
    localStorage.removeItem('devsync_token');
    localStorage.removeItem('devsync_auth_token');
    localStorage.removeItem('devsync_user');

    // Reset State
    set({
      token: null,
      user: null,
      isAuthenticated: false
    });

    // Redirect User
    window.location.href = '/auth/login';
  }

}));