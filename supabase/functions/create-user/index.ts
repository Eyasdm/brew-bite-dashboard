import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://brew-bite-dashboard.netlify.app";

function corsHeaders(origin: string) {
  const allowed = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
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
    const body = await req.json();

    const { email, password, full_name, role, is_active } = body;

    if (!email || !password || !full_name || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders(origin) }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1️⃣ Create Auth User
    const { data: auth, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    const userId = auth.user.id;

    // 2️⃣ Store role in JWT (app_metadata)
    const { error: metaError } =
      await supabase.auth.admin.updateUserById(userId, {
        app_metadata: { role },
      });

    if (metaError) throw metaError;

    // 3️⃣ Upsert profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name,
          role,
          is_active: is_active ?? true,
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (profileError) throw profileError;

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: {
        ...corsHeaders(origin),
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("CREATE USER FAILED:", err);

    return new Response(
      JSON.stringify({ error: err.message ?? "Create user failed" }),
      { status: 500, headers: corsHeaders(origin) }
    );
  }
});