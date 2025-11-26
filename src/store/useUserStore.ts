import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile } from '../core/types';

export type UserState = {
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
};

const STORAGE_KEY = 'thelab-user';

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      login: (profile) => set({ user: profile }),
      logout: () => set({ user: null }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) =>
          key === 'createdAt' || key === 'updatedAt' ? new Date(value as string) : value,
      }),
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
