import { authService } from "@/features/auth/services/auth-service";
import { User } from "@/shared/types/auth";
import { create } from "zustand";
import { setLogoutCallback } from "@/shared/api/axios";

export interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  isInitializing: boolean;
  setIsLoading: (isLoading: boolean) => void;
  getMe: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const logout = () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  };

  const store: AuthStore = {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    isInitializing: true,
    setUser: (user) => set({ user }),
    logout,
    login: async (email, password) => {
      set({ isLoading: true });
      const { user, token } = await authService.login(email, password);
      localStorage.setItem("token", token);
      set({ user, token });
      set({ isLoading: false });
    },
    register: async (name, email, password) => {
      set({ isLoading: true });
      const { user, token } = await authService.register(name, email, password);
      localStorage.setItem("token", token);
      set({ user, token });
      set({ isLoading: false });
    },
    getMe: async () => {
      set({ isLoading: true });
      try {
        const user = await authService.getMe();
        set({ user });
      } catch (error) {
        localStorage.removeItem("token");
        set({ user: null, token: null });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    initializeAuth: async () => {
      const token = get().token;
      if (!token) {
        set({ isInitializing: false });
        return;
      }

      try {
        await get().getMe();
      } catch (error) {
        localStorage.removeItem("token");
        set({ user: null, token: null });
      } finally {
        set({ isInitializing: false });
      }
    },
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
  };

  if (typeof window !== "undefined") {
    setLogoutCallback(logout);
  }

  return store;
});
