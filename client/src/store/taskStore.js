import { create } from 'zustand';
import api from '../api/axios';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedProjectId: null,
  isLoading: false,

  setSelectedProjectId: (projectId) => set({ selectedProjectId: projectId }),

  // Action: Retrieve all tasks mapped to a project
  fetchProjectTasks: async (projectId) => {
    if (!projectId) return;
    set({ isLoading: true });
    try {
      const response = await api.get(`/tasks/project/${projectId}`);
      set({ tasks: response.data.data.tasks, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Failed to load project task index matrix:', error);
    }
  },

  // Action: Commit a fresh task asset to the active project lane
  createNewTask: async (taskPayload) => {
    try {
      const response = await api.post('/tasks', taskPayload);
      const { task } = response.data.data;
      set((state) => ({ tasks: [...state.tasks, task] }));
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to register your task asset.'
      };
    }
  },

  // Action: Modify specific task attributes (e.g., status, priority)
  updateTaskStatus: async (taskId, updatedFields) => {
    // Optimistic UI state updates for near-zero response lag perception
    const originalTasks = get().tasks;
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...updatedFields } : t))
    }));

    try {
      await api.patch(`/tasks/${taskId}`, updatedFields);
      return { success: true };
    } catch (error) {
      // Revert to original database state matrix if API communication encounters failure
      set({ tasks: originalTasks });
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to synchronize state update.'
      };
    }
  }
}));