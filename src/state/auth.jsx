import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "../services/supabase";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  const [profile, setProfile] = useState(null);
  const [initLoading, setInitLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useLocalStorageState(
    false,
    "is-authenticated"
  );

  const fetchProfile = useCallback(async (userId) => {
    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, full_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      setProfile(data ?? null);
    } catch (err) {
      console.error("fetchProfile error:", err);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      const { data, error } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (error) console.error("getSession error:", error);

      const s = data?.session ?? null;
      const u = s?.user ?? null;

      setSession(s);
      setUser(u);
      setIsAuthenticated(!!s);

      if (u) fetchProfile(u.id); // بدون await
      else setProfile(null);

      setInitLoading(false);
    }

    init();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (!isMounted) return;

        const u = newSession?.user ?? null;

        setSession(newSession);
        setUser(u);
        setIsAuthenticated(!!newSession);

        if (u) {
          // نفّذ بعد ما يخلص callback
          setTimeout(() => fetchProfile(u.id), 0);
        } else {
          setProfile(null);
        }

        setInitLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription?.subscription?.unsubscribe();
    };
  }, [fetchProfile, setIsAuthenticated]);

  const login = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    // profile & isAuthenticated will be updated via onAuthStateChange
    return data;
  }, []);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setSession(null);
    setUser(null);
    setProfile(null);
    setIsAuthenticated(false);
  }, [setIsAuthenticated]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      role: profile?.role ?? null,
      isAuthenticated,

      initLoading,
      profileLoading,

      login,
      logout,
    }),
    [
      session,
      user,
      profile,
      isAuthenticated,
      initLoading,
      profileLoading,
      login,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}
