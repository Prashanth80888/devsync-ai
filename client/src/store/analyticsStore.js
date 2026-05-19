import { create } from 'zustand';
import api from '../api/axios';

export const useAnalyticsStore = create((set) => ({
  metrics: null,
  isMetricsLoading: false,

  // Action: Trigger structural aggregation computation endpoints from the backend
  fetchSummaryMetrics: async () => {
    set({ isMetricsLoading: true });
    try {
      const response = await api.get('/analytics/summary');
      set({ metrics: response.data.data, isMetricsLoading: false });
    } catch (error) {
      set({ isMetricsLoading: false });
      console.error('Failed to compile application summary metrics:', error);
    }
  }
}));