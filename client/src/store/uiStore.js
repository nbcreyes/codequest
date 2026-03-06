// Zustand store for global UI state.
// Tracks things like loading states and toast notifications
// that need to be accessible across the component tree.

import { create } from "zustand";

const useUiStore = create((set) => ({
  // Global loading overlay — used during auth operations
  isGlobalLoading: false,
  setGlobalLoading: (value) => set({ isGlobalLoading: value }),

  // Toast notifications queue
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: Date.now().toString(),
          type: "info", // info | success | error | warning
          duration: 4000,
          ...toast,
        },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export default useUiStore;