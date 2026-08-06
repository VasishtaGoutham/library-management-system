import { create } from 'zustand';

export interface User {
  id: number;
  fullName: string;
  email: string;
  studentIdNumber?: string;
  role: 'ROLE_ADMIN' | 'ROLE_STUDENT';
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
