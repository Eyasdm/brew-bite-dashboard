import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://brew-bite-dashboard.netlify.app";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin") ?? "";

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔐 Authorize caller — must be a signed-in admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing authorization" }),
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: corsHeaders(origin) }
      );
    }

    if (user.app_metadata?.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admins only" }),
        { status: 403, headers: corsHeaders(origin) }
      );
    }

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing userId" }),
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    if (userId === user.id) {
      return new Response(
        JSON.stringify({ error: "You can't delete your own account" }),
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    const { error: profileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: corsHeaders(origin) }
    );
  } catch (err: any) {
    console.error("DELETE USER FAILED:", err);

    return new Response(
      JSON.stringify({ error: err.message ?? "Delete user failed" }),
      { status: 500, headers: corsHeaders(origin) }
    );
  }
});