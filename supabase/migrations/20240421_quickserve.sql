-- QuickServe Database Schema & Helper Functions
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ─── PROMO CODES TABLE ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code            text UNIQUE NOT NULL,
  discount_type   text NOT NULL CHECK (discount_type IN ('percent', 'flat')),
  discount_value  numeric(8,2) NOT NULL,
  max_discount_amount numeric(8,2),      -- cap for percent discounts
  minimum_order_amount numeric(8,2),     -- minimum cart to qualify
  max_uses        integer,               -- null = unlimited
  current_uses    integer NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  starts_at       timestamptz NOT NULL DEFAULT now(),
  expires_at      timestamptz,           -- null = never expires
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Example promo codes (remove before production)
INSERT INTO public.promo_codes (code, discount_type, discount_value, minimum_order_amount, max_uses)
VALUES
  ('WELCOME10', 'percent', 10, 15.00, 1000),
  ('FLAT5',     'flat',     5, 20.00, 500),
  ('SAVE20',    'percent', 20, 30.00, 200)
ON CONFLICT (code) DO NOTHING;

-- ─── INCREMENT PROMO USAGE RPC ────────────────────────────────────────────────
-- Called by the create-order Edge Function after a successful order
CREATE OR REPLACE FUNCTION increment_promo_usage(code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.promo_codes
  SET current_uses = current_uses + 1
  WHERE promo_codes.code = increment_promo_usage.code;
END;
$$;

-- ─── USER FAVORITES TABLE ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  seller_id   uuid NOT NULL REFERENCES public.sellers (id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, seller_id)
);

-- ─── IDEMPOTENCY KEY COLUMN ON ORDERS ────────────────────────────────────────
-- Add if not already present; safe to run multiple times
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS idempotency_key text,
  ADD COLUMN IF NOT EXISTS estimated_delivery_time text;

CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_idx
  ON public.orders (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

-- ─── PAYMENT METHODS TABLE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  brand        text NOT NULL DEFAULT 'visa',   -- visa | mastercard | amex
  last_four    text NOT NULL,
  expiry_month integer NOT NULL,
  expiry_year  integer NOT NULL,
  is_default   boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

-- promo_codes: anyone authenticated can read; only service role writes
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "promo_codes_read" ON public.promo_codes
  FOR SELECT USING (auth.role() = 'authenticated');

-- user_favorites: each user owns their rows
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "favorites_own" ON public.user_favorites
  USING (user_id = auth.uid());

-- payment_methods: each user owns their rows
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payment_methods_own" ON public.payment_methods
  USING (user_id = auth.uid());
