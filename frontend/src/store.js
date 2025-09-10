// diell/src/store/store.js

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axiosInstance from './lib/axios.js'; // Make sure the path is correct

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Persistent state - will be saved to localStorage
      isUnlocked: false,
      unlockTimestamp: null, // Store when the unlock happened
      
      unlock: () => set({ 
        isUnlocked: true,
        unlockTimestamp: Date.now() // Store current timestamp
      }),

      // Function to check if unlock has expired (30 minutes = 30 * 60 * 1000 ms)
      checkUnlockExpiry: () => {
        const state = get();
        if (!state.isUnlocked || !state.unlockTimestamp) {
          return false; // Already locked or no timestamp
        }
        
        const thirtyMinutes = 30 * 60 * 1000;
        const isExpired = Date.now() - state.unlockTimestamp > thirtyMinutes;
        
        if (isExpired) {
          set({ isUnlocked: false, unlockTimestamp: null });
          return true; // Was expired and now locked
        }
        
        return false; // Still valid
      },

      // Helper function to get unlock status (automatically checks expiry)
      getIsUnlocked: () => {
        const state = get();
        state.checkUnlockExpiry(); // This will auto-lock if expired
        return get().isUnlocked; // Get fresh state after potential lock
      },

      // Manual lock function
      lock: () => set({ 
        isUnlocked: false, 
        unlockTimestamp: null 
      }),

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
      // Persist both isUnlocked and unlockTimestamp
      partialize: (state) => ({ 
        isUnlocked: state.isUnlocked,
        unlockTimestamp: state.unlockTimestamp
      }),
    }
  )
);