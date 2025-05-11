import { create } from "zustand";

type User = {
  id: number;
  name: string;
  email: string;
  vip: boolean;
  avatarURL: string | null;
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  cleanError: () => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  cleanError: () => set({ error: null }),
  logout: async () => {
    try {
      set({ isLoading: true });

      const response = await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      set({ user: null, isLoading: false });
    } catch (error) {
      console.error("Error during logout:", error);
      set({
        isLoading: false,
        error: "Failed to logout",
      });
    }
  },
  fetchUser: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch("/api/v1/user/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        set({ user: null, isLoading: false });
        return;
      }

      const data = await response.json();
      set({ user: data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({
        user: null,
        isLoading: false,
        error: "Failed to fetch user data",
      });
    }
  },
}));
