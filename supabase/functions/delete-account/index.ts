// Supabase Edge Function: delete-account
// Uses service_role to delete the auth user — this cannot be done from the client
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) return json({ error: "Unauthorized" }, 401);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Delete user data in correct FK order (children before parents)
  await admin.from("order_reviews").delete().eq("user_id", user.id);
  await admin.from("order_items").delete().in(
    "order_id",
    (await admin.from("orders").select("id").eq("user_id", user.id)).data?.map((o: any) => o.id) ?? [],
  );
  await admin.from("orders").delete().eq("user_id", user.id);
  await admin.from("addresses").delete().eq("user_id", user.id);
  await admin.from("payment_methods").delete().eq("user_id", user.id);
  await admin.from("users").delete().eq("id", user.id);

  // Finally delete the auth user — this is the action that requires service_role
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    console.error("Failed to delete auth user:", deleteError);
    return json({ error: "Failed to delete account" }, 500);
  }

  return json({ success: true }, 200);
});

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
