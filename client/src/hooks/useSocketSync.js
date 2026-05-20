import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useTaskStore } from '../store/taskStore';

// Points directly to your Express server runtime port
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocketSync = () => {
  const { selectedProjectId, fetchProjectTasks } = useTaskStore();

  useEffect(() => {
    if (!selectedProjectId) return;

    // Open connection namespace channel
    const socket = io(SOCKET_URL);

    // Isolate workspace updates by joining project room channel
    socket.emit('join:project', selectedProjectId);

    // Sync a new task built by another user on the canvas
    socket.on('task:created', (newTask) => {
      if (newTask.projectId === selectedProjectId) {
        useTaskStore.setState((state) => {
          const exists = state.tasks.some((t) => t.id === newTask.id);
          if (exists) return state;
          return { tasks: [...state.tasks, newTask] };
        });
      }
    });

    // Sync state mutations or lane movements
    socket.on('task:updated', (updatedTask) => {
      if (updatedTask.projectId === selectedProjectId) {
        useTaskStore.setState((state) => ({
          tasks: state.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
        }));
      }
    });

    // Fallback sync trigger to force clear any mismatched states on deep updates
    socket.on('project:refresh', () => {
      fetchProjectTasks(selectedProjectId);
    });

    // Teardown connections to avoid memory leak multiplexing
    return () => {
      socket.emit('leave:project', selectedProjectId);
      socket.disconnect();
    };
  }, [selectedProjectId]);
};