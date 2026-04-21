// Supabase Edge Function: validate-promo
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Unauthorized" }, 401);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return json({ error: "Unauthorized" }, 401);

  const { code, subtotal } = await req.json();
  if (!code) return json({ valid: false, message: "No code provided", discount_amount: 0 }, 200);

  const now = new Date().toISOString();

  const { data: promo } = await admin
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .lte("starts_at", now)
    .or(`expires_at.is.null,expires_at.gte.${now}`)
    .maybeSingle();

  if (!promo) {
    return json({ valid: false, message: "Invalid or expired promo code", discount_amount: 0 }, 200);
  }

  // Check usage limit
  if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
    return json({ valid: false, message: "This promo code has reached its usage limit", discount_amount: 0 }, 200);
  }

  // Check minimum order
  if (promo.minimum_order_amount && subtotal < promo.minimum_order_amount) {
    return json({
      valid: false,
      message: `Minimum order of $${promo.minimum_order_amount.toFixed(2)} required`,
      discount_amount: 0,
    }, 200);
  }

  // Check if user already used this promo
  const { count } = await admin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("promo_code", promo.code);

  if (count && count > 0) {
    return json({ valid: false, message: "You have already used this promo code", discount_amount: 0 }, 200);
  }

  // Calculate discount
  let discountAmount = 0;
  if (promo.discount_type === "percent") {
    discountAmount = subtotal * (promo.discount_value / 100);
    if (promo.max_discount_amount) {
      discountAmount = Math.min(discountAmount, promo.max_discount_amount);
    }
  } else if (promo.discount_type === "flat") {
    discountAmount = Math.min(promo.discount_value, subtotal);
  }

  return json({
    valid: true,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    discount_amount: parseFloat(discountAmount.toFixed(2)),
    message: `${promo.discount_type === "percent" ? `${promo.discount_value}%` : `$${promo.discount_value}`} off applied!`,
  }, 200);
});

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
