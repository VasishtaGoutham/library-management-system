import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'obsidian' | 'porcelain' | 'emerald' | 'violet';

interface ThemeState {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'obsidian',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'library-theme-storage',
    }
  )
);
