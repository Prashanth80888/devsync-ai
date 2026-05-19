import { create } from 'zustand';
import api from '../api/axios';

export const useProjectStore = create((set, get) => ({
  projects: [],
  teams: [],
  isLoading: false,

  // Action: Fetch all projects tied to the validated tenant workspace organization
  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/projects');
      set({ projects: response.data.data.projects, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load project listings:', error);
    }
  },

  // Action: Fetch all operational teams under the organization cluster
  fetchTeams: async () => {
    try {
      const response = await api.get('/teams');
      set({ teams: response.data.data.teams });
    } catch (error) {
      console.error('Failed to load team directories:', error);
    }
  },

  // Action: Launch and register a clean corporate project asset 
  createNewProject: async (name, description, teamId) => {
    try {
      const response = await api.post('/projects', { name, description, teamId: teamId || null });
      const { project } = response.data.data;
      
      // Inject synthetic relational models into localized cache parameters to avoid an unnecessary API refresh
      const enrichedProject = {
        ...project,
        team: teamId ? get().teams.find(t => t.id === teamId) : null,
        _count: { tasks: 0 }
      };

      set((state) => ({
        projects: [enrichedProject, ...state.projects]
      }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to initialize project configuration.'
      };
    }
  }
}));