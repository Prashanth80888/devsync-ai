import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Configure credentials attachment across axios requests if your app uses cookie sessions
axios.defaults.withCredentials = true;

export const usePlaygroundStore = create((set, get) => ({
  playgrounds: [],
  currentSandbox: null,
  isLoading: false,
  isAnalyzing: false,

  /**
   * Pull all available sandbox workspaces bound to a project
   */
  fetchProjectPlaygrounds: async (projectId) => {
    set({ isLoading: true });
    try {
      // Ensure your interceptors automatically inject headers or authorization keys
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.get(`${API_URL}/api/playgrounds/project/${projectId}`, config);
      
      if (response.data.success) {
        set({ playgrounds: response.data.playgrounds, isLoading: false });
        // Automatically default to the first workspace element if none is selected
        if (response.data.playgrounds.length > 0 && !get().currentSandbox) {
          set({ currentSandbox: response.data.playgrounds[0] });
        }
      }
    } catch (error) {
      console.error('Zustand pipeline playground collection failure:', error);
      set({ isLoading: false });
    }
  },

  /**
   * Set or focus on a specific code playground instance explicitly
   */
  setCurrentSandbox: (sandbox) => set({ currentSandbox: sandbox }),

  /**
   * Persist code buffer or workspace structural modifications back to database
   */
  saveSandboxSnippet: async (snippetPayload) => {
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.post(`${API_URL}/api/playgrounds/save`, snippetPayload, config);
      
      if (response.data.success) {
        const savedNode = response.data.playground;
        const currentList = get().playgrounds;
        
        // Check if updating an existing record or appending a brand new item instance
        const updatedList = currentList.some((p) => p.id === savedNode.id)
          ? currentList.map((p) => (p.id === savedNode.id ? { ...p, ...savedNode } : p))
          : [savedNode, ...currentList];

        set({ 
          playgrounds: updatedList, 
          currentSandbox: savedNode 
        });
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Processing fallback error.' };
    } catch (error) {
      console.error('Failed to commit code block to disk layer:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Network transport timeout occurred.' 
      };
    }
  },

  /**
   * Trigger real-time static code analysis via backend Gemini flash wrapper
   */
  analyzeCurrentCode: async (sandboxId) => {
    set({ isAnalyzing: true });
    try {
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const response = await axios.post(`${API_URL}/api/playgrounds/${sandboxId}/analyze`, {}, config);
      
      if (response.data.success) {
        const currentSandbox = get().currentSandbox;
        
        // Dynamically append the review text and updated timestamp matrix properties
        const enhancedSandbox = {
          ...currentSandbox,
          aiReviewCache: response.data.aiReview,
          lastAnalyzedAt: response.data.lastAnalyzedAt
        };

        // Sync updates cleanly across the general playgrounds tracking inventory array
        set((state) => ({
          currentSandbox: enhancedSandbox,
          playgrounds: state.playgrounds.map((p) => (p.id === sandboxId ? enhancedSandbox : p)),
          isAnalyzing: false
        }));

        return { success: true, analysis: response.data.aiReview };
      }
      set({ isAnalyzing: false });
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Gemini verification intercept execution fail:', error);
      set({ isAnalyzing: false });
      return { 
        success: false, 
        message: error.response?.data?.message || 'AI compiler infrastructure timeout.' 
      };
    }
  }
}));