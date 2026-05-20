import { create } from 'zustand';
import axios from 'axios';
import { io } from 'socket.io-client';

// ==================================================
// API BASE URL
// ==================================================

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ==================================================
// GLOBAL SOCKET CONNECTION
// ==================================================

const socket = io(API_URL, {
  autoConnect: true,
  reconnection: true
});

// ==================================================
// GLOBAL AXIOS CONFIG
// ==================================================

axios.defaults.withCredentials = true;

// ==================================================
// PLAYGROUND STORE
// ==================================================

export const usePlaygroundStore = create((set, get) => ({

  playgrounds: [],

  currentSandbox: null,

  isLoading: false,

  isAnalyzing: false,

  // ==================================================
  // FETCH PROJECT PLAYGROUNDS
  // ==================================================

  fetchProjectPlaygrounds: async (projectId) => {

    set({ isLoading: true });

    try {

      const token =
        localStorage.getItem('token');

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : {};

      const response = await axios.get(
        `${API_URL}/api/playgrounds/project/${projectId}`,
        config
      );

      if (response.data.success) {

        set({
          playgrounds: response.data.playgrounds,
          isLoading: false
        });

        // Auto select first sandbox if none selected
        if (
          response.data.playgrounds.length > 0 &&
          !get().currentSandbox
        ) {

          set({
            currentSandbox:
              response.data.playgrounds[0]
          });
        }
      }

    } catch (error) {

      console.error(
        'Zustand pipeline playground collection failure:',
        error
      );

      set({ isLoading: false });
    }
  },

  // ==================================================
  // SET CURRENT SANDBOX
  // ==================================================

  setCurrentSandbox: (sandbox) =>

    set({
      currentSandbox: sandbox
    }),

  // ==================================================
  // SAVE SANDBOX SNIPPET
  // ==================================================

  saveSandboxSnippet: async (snippetPayload) => {

    try {

      const token =
        localStorage.getItem('token');

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : {};

      const response = await axios.post(
        `${API_URL}/api/playgrounds/save`,
        snippetPayload,
        config
      );

      if (response.data.success) {

        const savedNode =
          response.data.playground;

        const currentList =
          get().playgrounds;

        // Update existing or insert new
        const updatedList =
          currentList.some(
            (p) => p.id === savedNode.id
          )
            ? currentList.map((p) =>
                p.id === savedNode.id
                  ? { ...p, ...savedNode }
                  : p
              )
            : [savedNode, ...currentList];

        set({
          playgrounds: updatedList,
          currentSandbox: savedNode
        });

        return { success: true };
      }

      return {
        success: false,
        message:
          response.data.message ||
          'Processing fallback error.'
      };

    } catch (error) {

      console.error(
        'Failed to commit code block to disk layer:',
        error
      );

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'Network transport timeout occurred.'
      };
    }
  },

  // ==================================================
  // AI ANALYSIS
  // ==================================================

  analyzeCurrentCode: async (sandboxId) => {

    set({ isAnalyzing: true });

    try {

      const token =
        localStorage.getItem('token');

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        : {};

      const response = await axios.post(
        `${API_URL}/api/playgrounds/${sandboxId}/analyze`,
        {},
        config
      );

      if (response.data.success) {

        const currentSandbox =
          get().currentSandbox;

        const enhancedSandbox = {
          ...currentSandbox,
          aiReviewCache:
            response.data.aiReview,
          lastAnalyzedAt:
            response.data.lastAnalyzedAt
        };

        set((state) => ({
          currentSandbox: enhancedSandbox,

          playgrounds:
            state.playgrounds.map((p) =>
              p.id === sandboxId
                ? enhancedSandbox
                : p
            ),

          isAnalyzing: false
        }));

        return {
          success: true,
          analysis: response.data.aiReview
        };
      }

      set({ isAnalyzing: false });

      return {
        success: false,
        message: response.data.message
      };

    } catch (error) {

      console.error(
        'Gemini verification intercept execution fail:',
        error
      );

      set({ isAnalyzing: false });

      return {
        success: false,
        message:
          error.response?.data?.message ||
          'AI compiler infrastructure timeout.'
      };
    }
  },

  // ==================================================
  // SOCKET LISTENERS
  // ==================================================

  listenToSandboxSocket: (sandboxId) => {

    if (!sandboxId) return;

    // Join dedicated room
    socket.emit('sandbox:join', {
      sandboxId
    });

    // Listen for code updates
    socket.on(
      'sandbox:code_updated',
      (data) => {

        const { currentSandbox } = get();

        if (
          currentSandbox &&
          currentSandbox.id === data.sandboxId
        ) {

          if (
            currentSandbox.code !== data.code
          ) {

            set({
              currentSandbox: {
                ...currentSandbox,
                code: data.code,
                updatedAt:
                  new Date().toISOString()
              }
            });
          }
        }
      }
    );

    // Listen for AI analysis completion
    socket.on(
      'sandbox:analysis_completed',
      (data) => {

        const { currentSandbox } = get();

        if (
          currentSandbox &&
          currentSandbox.id === data.sandboxId
        ) {

          set({
            currentSandbox: {
              ...currentSandbox,
              aiReviewCache:
                data.aiReviewCache,

              lastAnalyzedAt:
                data.lastAnalyzedAt
            }
          });
        }
      }
    );
  },

  // ==================================================
  // BROADCAST CODE CHANGES
  // ==================================================

  broadcastCodeChange: (
    sandboxId,
    updatedCode
  ) => {

    if (!sandboxId) return;

    socket.emit('sandbox:edit_code', {
      sandboxId,
      code: updatedCode
    });
  },

  // ==================================================
  // LEAVE SOCKET ROOM
  // ==================================================

  leaveSandboxSocket: (sandboxId) => {

    if (!sandboxId) return;

    socket.emit('sandbox:leave', {
      sandboxId
    });

    socket.off('sandbox:code_updated');

    socket.off(
      'sandbox:analysis_completed'
    );
  }

}));