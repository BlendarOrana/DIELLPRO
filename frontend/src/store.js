// diell/src/store/store.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from './lib/axios.js'; // Make sure the path is correct

export const useAppStore = create(
  persist(
    (set) => ({
      // Persistent state - will be saved to localStorage
      isUnlocked: false,
      unlock: () => set({ isUnlocked: true }),

      // Non-persistent state for form handling - these shouldn't persist across sessions
      isLoading: false,
      error: null,
      successMessage: null,

      // Async function to send the email via our backend
      sendEmail: async (formData) => {
        // 1. Set loading state and clear previous messages
        set({ isLoading: true, error: null, successMessage: null });

        try {
          // 2. Make the API call
          const response = await axiosInstance.post('/send-email', formData);
          
          // 3. Set success state
          set({ 
            isLoading: false, 
            successMessage: response.data.message 
          });

        } catch (err) {
          // 4. Set error state
          const errorMessage = err.response?.data?.error || 'An unexpected error occurred. Please try again.';
          set({ 
            isLoading: false, 
            error: errorMessage 
          });
        }
      },

      // Function to reset the status (e.g., when the form modal is closed)
      resetFormStatus: () => set({
        isLoading: false,
        error: null,
        successMessage: null,
      }),
    }),
    {
      name: 'diell-app-storage', // unique name for localStorage key
      // Only persist the isUnlocked state, not the form states
      partialize: (state) => ({ 
        isUnlocked: state.isUnlocked 
      }),
    }
  )
);