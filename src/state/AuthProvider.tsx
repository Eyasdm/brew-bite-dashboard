import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuthSession } from "./useAuthSession";
import { useAuthProfile } from "./useAuthProfile";
import type { Profile, UserRole } from "../types";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  initLoading: boolean;
  login: (params: { email: string; password: string }) => Promise<unknown>;
  logout: () => Promise<void>;
  profile: Profile | null;
  role: UserRole | null;
  profileLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuthSession();
  const { profile, loading: profileLoading } = useAuthProfile(auth.user);

  const value = useMemo(
    () => ({
      ...auth,
      profile,
      role: profile?.role ?? null,
      profileLoading,
    }),
    [auth, profile, profileLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
