import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

// Deliberately in-memory only, per instruction — this means a page refresh
// logs the user out. That's expected for now; once refresh-token rotation
// lands, this is the file that grows a silent-refresh-on-load flow.
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setToken: (token) => set({ accessToken: token, isAuthenticated: true }),
  logout: () => set({ accessToken: null, isAuthenticated: false }),
}));
