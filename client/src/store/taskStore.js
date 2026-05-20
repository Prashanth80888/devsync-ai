import { create } from 'zustand';
import api from '../api/axios';
import axios from 'axios';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000';

export const useTaskStore = create((set, get) => ({

  // ==================================================
  // GLOBAL TASK STATE
  // ==================================================

  tasks: [],

  selectedProjectId: null,

  isLoading: false,

  // Tracks AI analysis loading state per task
  isAiAnalyzing: {},

  // ==================================================
  // SET ACTIVE PROJECT
  // ==================================================

  setSelectedProjectId: (projectId) =>

    set({
      selectedProjectId: projectId
    }),

  // ==================================================
  // FETCH PROJECT TASKS
  // ==================================================

  fetchProjectTasks: async (projectId) => {

    if (!projectId) return;

    set({
      isLoading: true
    });

    try {

      // Existing backend structure preserved
      const response = await api.get(
        `/tasks/project/${projectId}`
      );

      set({
        tasks: response.data.data.tasks,
        isLoading: false
      });

    } catch (error) {

      console.error(
        'Failed to load project task index matrix:',
        error
      );

      set({
        isLoading: false
      });
    }
  },

  // ==================================================
  // CREATE TASK
  // ==================================================

  createNewTask: async (taskPayload) => {

    try {

      const response = await api.post(
        '/tasks',
        taskPayload
      );

      const { task } = response.data.data;

      set((state) => ({
        tasks: [
          ...state.tasks,
          task
        ]
      }));

      return {
        success: true
      };

    } catch (error) {

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Failed to register your task asset.'
      };
    }
  },

  // ==================================================
  // UPDATE TASK STATUS
  // ==================================================

  updateTaskStatus: async (
    taskId,
    updatedFields
  ) => {

    // Preserve current state for rollback safety
    const originalTasks = get().tasks;

    // ==================================================
    // OPTIMISTIC UI UPDATE
    // ==================================================

    set((state) => ({

      tasks: state.tasks.map((task) =>

        task.id === taskId
          ? {
              ...task,
              ...updatedFields
            }
          : task
      )

    }));

    try {

      await api.patch(
        `/tasks/${taskId}`,
        updatedFields
      );

      return {
        success: true
      };

    } catch (error) {

      // ==================================================
      // ROLLBACK ON FAILURE
      // ==================================================

      set({
        tasks: originalTasks
      });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Failed to synchronize state update.'
      };
    }
  },

  // ==================================================
  // AI TASK ANALYSIS
  // ==================================================

  analyzeTaskWithAI: async (taskId) => {

    // Enable loading state for this task only
    set((state) => ({

      isAiAnalyzing: {
        ...state.isAiAnalyzing,
        [taskId]: true
      }

    }));

    try {

      const response = await axios.post(
        `${API_URL}/api/ai/tasks/${taskId}/ai-analyze`
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      if (response.data.success) {

        set((state) => ({

          tasks: state.tasks.map((task) =>

            task.id === taskId
              ? response.data.data
              : task
          ),

          isAiAnalyzing: {
            ...state.isAiAnalyzing,
            [taskId]: false
          }

        }));

        return {
          success: true
        };
      }

      // ==================================================
      // FAILURE
      // ==================================================

      set((state) => ({

        isAiAnalyzing: {
          ...state.isAiAnalyzing,
          [taskId]: false
        }

      }));

      return {
        success: false,
        message: response.data.message
      };

    } catch (error) {

      console.error(
        'Error processing AI analytics:',
        error
      );

      set((state) => ({

        isAiAnalyzing: {
          ...state.isAiAnalyzing,
          [taskId]: false
        }

      }));

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'AI pipeline timeout exception occurred.'
      };
    }
  }

}));