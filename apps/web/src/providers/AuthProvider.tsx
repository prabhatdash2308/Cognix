"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@cognix/types";
import { apiClient, createAuthClient } from "@/lib/api-client";
import {
  clearAllTokens,
  getAccessToken,
  getRefreshToken,
  storeTokens,
  type TokenPair,
} from "@/lib/auth";

// ─── Context types ─────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  /** Re-fetch the current user (e.g. after profile update). */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async (): Promise<void> => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const client = createAuthClient(token);
      const me = await client.auth.me();
      setUser(me);
    } catch {
      // Token may be expired — try refresh
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const pair = await apiClient.auth.refresh({ refresh_token: refreshToken });
          storeTokens(pair as TokenPair);
          const client = createAuthClient(pair.access_token);
          const me = await client.auth.me();
          setUser(me);
        } catch {
          clearAllTokens();
          setUser(null);
        }
      } else {
        clearAllTokens();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount, restore session from stored tokens
  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const signIn = useCallback(
    async (email: string, password: string, rememberMe = false): Promise<void> => {
      const pair = await apiClient.auth.login({ email, password, remember_me: rememberMe });
      storeTokens(pair as TokenPair);
      const client = createAuthClient(pair.access_token);
      const me = await client.auth.me();
      setUser(me);
    },
    [],
  );

  const signOut = useCallback(async (): Promise<void> => {
    const token = getAccessToken();
    if (token) {
      try {
        const logoutClient = createAuthClient(token);
        const rf = getRefreshToken();
        await logoutClient.auth.logout({ ...(rf ? { refresh_token: rf } : {}) });
      } catch {
        // Best-effort logout
      }
    }
    clearAllTokens();
    setUser(null);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string): Promise<void> => {
      const pair = await apiClient.auth.register({ email, password, name });
      storeTokens(pair as TokenPair);
      const client = createAuthClient(pair.access_token);
      const me = await client.auth.me();
      setUser(me);
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        signIn,
        signOut,
        register,
        refresh: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
