import { create } from "zustand";
import { persist } from "zustand/middleware";

export const userStore = create(
  persist(
    (set) => ({
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      removeTokens: () =>
        set({
          accessToken: undefined,
          refreshToken: undefined,
          user: undefined,
        }),
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-store",
    }
  )
);
