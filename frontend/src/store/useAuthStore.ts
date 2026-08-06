import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  fullName: string;
  email: string;
  studentIdNumber?: string;
  role: 'ROLE_ADMIN' | 'ROLE_STUDENT';
  token?: string;
  jwt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (data) => {
        const token = data.token || data.jwt || null;
        set({ user: data, token });
        if (token && typeof window !== 'undefined') {
          localStorage.setItem('token', token);
        }
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
        set({ user: null, token: null });
      },
    }),
    {
      name: 'library-auth',
    }
  )
);
