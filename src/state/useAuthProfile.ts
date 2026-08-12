import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "../types";

interface AuthProfileReturn {
  profile: Profile | null;
  loading: boolean;
}

export function useAuthProfile(user: User | null): AuthProfileReturn {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, full_name, avatar_url")
        .eq("id", user!.id)
        .single();

      if (!cancelled) {
        setProfile(error ? null : (data as Profile));
        setLoading(false);
      }
    }

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return {
    profile: user ? profile : null,
    loading,
  };
}
