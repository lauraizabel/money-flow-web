import { authService } from "@/features/auth/services/auth-service";
import { User } from "@/shared/types/auth";
import { create } from "zustand";

export interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, token: null }),
  login: async (email, password) => {
    set({ isLoading: true });
    const { user, token } = await authService.login(email, password);
    set({ user, token });
    set({ isLoading: false });
  },
  register: async (name, email, password) => {
    set({ isLoading: true });
    const { user, token } = await authService.register(name, email, password);
    set({ user, token });
    set({ isLoading: false });
  },
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

