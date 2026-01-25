import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";

export function useAuthProfile(user) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    async function fetchProfile() {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, full_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (!cancelled) {
        setProfile(error ? null : data);
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
