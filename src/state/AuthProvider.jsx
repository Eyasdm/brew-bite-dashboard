import { createContext, useContext, useMemo } from "react";
import { useAuthSession } from "./useAuthSession";
import { useAuthProfile } from "./useAuthProfile";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
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

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
