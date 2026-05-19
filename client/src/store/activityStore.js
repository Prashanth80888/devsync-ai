import { create } from 'zustand';
import api from '../api/axios';

export const useActivityStore = create((set) => ({
  activities: [],
  isFeedLoading: false,

  // Action: Load the newest 15 organization audit actions from the database
  fetchWorkspaceActivities: async () => {
    set({ isFeedLoading: true });
    try {
      const response = await api.get('/activity');
      set({ activities: response.data.data.activities, isFeedLoading: false });
    } catch (error) {
      set({ isFeedLoading: false });
      console.error('Failed to retrieve workspace audit tracking array:', error);
    }
  }
}));