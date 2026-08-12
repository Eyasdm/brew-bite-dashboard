import { useEffect, useState, useCallback } from "react";
import { supabase } from "../services/supabase";
import type { Session, User } from "@supabase/supabase-js";
import type { AuthError } from "@supabase/supabase-js";

interface LoginParams {
  email: string;
  password: string;
}

interface AuthSessionReturn {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  initLoading: boolean;
  login: (params: LoginParams) => Promise<{ data: { session: Session | null; user: User | null }; error: AuthError | null }>;
  logout: () => Promise<void>;
}

export function useAuthSession(): AuthSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
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

  const login = useCallback(async ({ email, password }: LoginParams) => {
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
