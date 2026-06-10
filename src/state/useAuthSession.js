import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase";

export function useAuthSession() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        // Stale or revoked refresh token — wipe it from localStorage so it
        // doesn't cause repeated 400 errors on every subsequent request.
        supabase.auth.signOut({ scope: "local" });
        setSession(null);
        setUser(null);
      } else {
        setSession(data.session ?? null);
        setUser(data.session?.user ?? null);
      }
      setInitLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // SIGNED_OUT fires when: explicit logout, refresh token is revoked,
        // or the refresh-token exchange returns a 400.
        if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
        } else if (newSession) {
          setSession(newSession);
          setUser(newSession.user ?? null);
        } else {
          setSession(null);
          setUser(null);
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    user,
    isAuthenticated: !!session,
    initLoading,
    login,
    logout,
  };
}
