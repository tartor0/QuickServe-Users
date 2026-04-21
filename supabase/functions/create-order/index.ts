// Supabase Edge Function: create-order
// Deno runtime — runs server-side with service_role key
// This is the ONLY place order totals are calculated to prevent price manipulation
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // ── 1. Authenticate caller ─────────────────────────────────────────────────
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return json({ error: "Missing Authorization header" }, 401);
  }

  // Client SDK (anon key + user JWT) — for authenticating the calling user
  const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return json({ error: "Unauthorized" }, 401);
  }

  // Admin client (service role) — bypasses RLS for server-side inserts
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  const {
    seller_id,
    delivery_address_id,
    payment_method_id,
    items,
    tip = 0,
    promo_code = null,
    promo_discount = 0,
    delivery_instructions = "",
    idempotency_key,
  } = await req.json();

  if (!seller_id || !delivery_address_id || !items?.length || !idempotency_key) {
    return json({ error: "Missing required fields" }, 400);
  }

  // ── 3. Idempotency check ───────────────────────────────────────────────────
  const { data: existing } = await admin
    .from("orders")
    .select("id")
    .eq("idempotency_key", idempotency_key)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return json({ id: existing.id, duplicate: true }, 200);
  }

  // ── 4. Fetch real menu item prices (never trust client prices) ─────────────
  const itemIds = items.map((i: any) => i.menu_item_id);
  const { data: menuItems, error: menuError } = await admin
    .from("menu_items")
    .select("id, price, name, is_available")
    .in("id", itemIds);

  if (menuError || !menuItems?.length) {
    return json({ error: "Failed to fetch menu items" }, 400);
  }

  // Validate all items are available
  const unavailable = menuItems.filter((m: any) => !m.is_available);
  if (unavailable.length > 0) {
    return json({
      error: `Item(s) no longer available: ${unavailable.map((u: any) => u.name).join(", ")}`,
    }, 409);
  }

  // ── 5. Calculate totals server-side ───────────────────────────────────────
  const priceMap = Object.fromEntries(menuItems.map((m: any) => [m.id, m.price]));

  const orderItems = items.map((i: any) => ({
    menu_item_id: i.menu_item_id,
    quantity: i.quantity,
    unit_price: priceMap[i.menu_item_id],
    customizations: i.customizations ?? [],
  }));

  const subtotal = orderItems.reduce(
    (sum: number, i: any) => sum + i.unit_price * i.quantity,
    0,
  );

  // Validate promo discount is not inflated
  const validPromoDiscount = Math.min(promo_discount, subtotal);
  const deliveryFee = 2.99;
  const serviceFee = subtotal * 0.05;
  const tax = (subtotal - validPromoDiscount) * 0.08;
  const tipAmount = Math.max(0, tip);
  const total = subtotal - validPromoDiscount + deliveryFee + serviceFee + tipAmount + tax;

  // ── 6. Insert order ────────────────────────────────────────────────────────
  const { data: order, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      seller_id,
      delivery_address_id,
      payment_method_id: payment_method_id ?? null,
      status: "pending",
      subtotal,
      delivery_fee: deliveryFee,
      service_fee: serviceFee,
      tip: tipAmount,
      tax,
      discount: validPromoDiscount,
      total,
      promo_code: promo_code ?? null,
      delivery_instructions,
      idempotency_key,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Order insert failed:", orderError);
    return json({ error: "Failed to create order" }, 500);
  }

  // ── 7. Insert order items ──────────────────────────────────────────────────
  const { error: itemsError } = await admin.from("order_items").insert(
    orderItems.map((i: any) => ({ ...i, order_id: order.id })),
  );

  if (itemsError) {
    // Roll back the order if items fail
    await admin.from("orders").delete().eq("id", order.id);
    console.error("Order items insert failed:", itemsError);
    return json({ error: "Failed to create order items" }, 500);
  }

  // ── 8. Decrement promo code usage (if applicable) ─────────────────────────
  if (promo_code) {
    await admin.rpc("increment_promo_usage", { code: promo_code });
  }

  return json({ id: order.id, total, status: "pending" }, 201);
});

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
