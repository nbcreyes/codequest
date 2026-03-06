// Zustand store for authentication state.
// Zustand is a lightweight state management library — no providers needed,
// just import and use the hook anywhere in the component tree.

import { create } from "zustand";
import { persist } from "zustand/middleware";

// persist middleware saves the store to localStorage automatically
// so the user stays logged in across page refreshes

const useAuthStore = create(
  persist(
    (set) => ({
      // Parent auth state
      parentToken: null,
      parent: null,

      // Child session state
      childToken: null,
      currentChild: null,

      // Actions
      setParentAuth: (token, parent) =>
        set({ parentToken: token, parent }),

      setChildSession: (token, child) =>
        set({ childToken: token, currentChild: child }),

      updateParent: (updates) =>
        set((state) => ({
          parent: state.parent ? { ...state.parent, ...updates } : null,
        })),

      updateCurrentChild: (updates) =>
        set((state) => ({
          currentChild: state.currentChild
            ? { ...state.currentChild, ...updates }
            : null,
        })),

      clearChildSession: () =>
        set({ childToken: null, currentChild: null }),

      clearAuth: () =>
        set({
          parentToken: null,
          parent: null,
          childToken: null,
          currentChild: null,
        }),
    }),
    {
      name: "codequest-auth", // localStorage key
      // Only persist tokens and minimal user data — not derived state
      partialize: (state) => ({
        parentToken: state.parentToken,
        parent: state.parent,
        childToken: state.childToken,
        currentChild: state.currentChild,
      }),
    }
  )
);

export default useAuthStore;