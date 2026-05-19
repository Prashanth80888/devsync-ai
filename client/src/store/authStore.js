import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('devsync_auth_token') || null,
  isAuthenticated: !!localStorage.getItem('devsync_auth_token'),
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, data } = response.data;
      localStorage.setItem('devsync_auth_token', token);
      set({ user: data.user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Authentication failed.' };
    }
  },

  register: async (fullName, email, password) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      const { token, data } = response.data;
      localStorage.setItem('devsync_auth_token', token);
      set({ user: data.user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Registration failed.' };
    }
  },

  checkAuthStatus: async () => {
    const storedToken = localStorage.getItem('devsync_auth_token');
    if (!storedToken) {
      set({ isAuthenticated: false, user: null });
      return;
    }
    set({ isLoading: true });
    try {
      const response = await api.get('/auth/me');
      set({ user: response.data.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  // NEW ACTION: Dispatches corporate registration updates to server endpoints
  createOrganization: async (orgName) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/orgs', { name: orgName });
      const { organization } = response.data.data;
      
      // Pull down the active user state profile memory partition cleanly
      const currentUser = get().user;
      
      // Instantly synchronize localized memory parameters with the returned database values
      set({
        user: { ...currentUser, orgId: organization.id, role: 'ORG_ADMIN' },
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { success: false, message: error.response?.data?.message || 'Failed to initialize workspace organization.' };
    }
  },

  logout: () => {
    localStorage.removeItem('devsync_auth_token');
    set({ user: null, token: null, isAuthenticated: false });
    window.location.href = '/auth/login';
  }
}));