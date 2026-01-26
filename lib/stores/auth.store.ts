import { create } from "zustand";
import { storage } from "../utils/storage";
import { User } from "@/types/user.type";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isRestoring: boolean;
  isLoggedIn: boolean;
  restoreUser: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isRestoring: true,
  isLoggedIn: false,
  restoreUser: async () => {
    try {
      // TODO: Get user from backend
      const user = { id: "1", name: "John Doe", email: "john.doe@example.com", avatar: "https://example.com/avatar.png", createdAt: new Date(), updatedAt: new Date() } as User; 
      if (user) {
        set({ user: user, isLoggedIn: true });
      }
    } catch (error) {
      set({ user: null, isLoggedIn: false });
    } finally {
      set({ isRestoring: false });
    }
  },
  login: async () => {
    // TODO: Login to backend
    const user = { id: "1", name: "John Doe", email: "john.doe@example.com", avatar: "https://example.com/avatar.png", createdAt: new Date(), updatedAt: new Date() } as User; 
    set({ user, isLoggedIn: true });
  },
  logout: async () => {
    // TODO: Logout from backend
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoggedIn: false,
    });
  },
}));
