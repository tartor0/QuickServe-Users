# QuickServe Backend Blueprint
# Built specifically from the app audit — every endpoint maps to a real screen

## PART 1 — STACK DECISION

### Option A: Fast Path (Recommended if Solo Dev / Building MVP)
> Supabase = PostgreSQL + Auth + Realtime + Storage, all hosted, zero DevOps

| Layer | Tool |
|---|---|
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT built-in) |
| Realtime | Supabase Realtime (order tracking) |
| File storage | Supabase Storage |
| Payments | Stripe |
| Push notifications | Expo Push Notification Service |
| Maps/Geocoding | Google Maps API |
| Promo validation | Custom Supabase Edge Function |

### Option B: Full Control Path (If you want a traditional API)
| Layer | Tool |
|---|---|
| Runtime | Node.js 20 + TypeScript |
| Framework | NestJS (structured) OR Express (lighter) |
| Database | PostgreSQL (Neon.tech for managed) |
| ORM | Prisma |
| Auth | JWT (access + refresh) |
| Cache | Redis (Upstash, free tier) |
| Payments | Stripe |
| Push | Expo Push |
| File storage | Cloudinary (free tier is generous) |

**My recommendation: Start with Supabase (Option A).** You can replace pieces later. It eliminates 80% of the boilerplate and lets you focus on business logic.

---

## PART 2 — DATABASE SCHEMA

Map your hardcoded constants to real tables.

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  wallet_balance DECIMAL(10,2) DEFAULT 0.00,
  reward_points INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### addresses
```sql
-- Maps to AddressesScreen, EditAddressScreen, CheckoutScreen delivery picker
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,             -- 'Home', 'Work', 'Other'
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  zip TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_default BOOLEAN DEFAULT FALSE,
  delivery_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### sellers
```sql
-- Maps to HomeScreen SELLERS[], CategoryBrowseScreen SELLERS[], SellerScreen
CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,          -- 'food', 'grocery', 'pharmacy', 'courier', 'supplies'
  description TEXT,
  image_url TEXT,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  delivery_fee DECIMAL(6,2) DEFAULT 2.99,
  min_delivery_time INTEGER,       -- minutes
  max_delivery_time INTEGER,
  is_open BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### menu_items
```sql
-- Maps to SellerScreen menu section
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(8,2) NOT NULL,
  image_url TEXT,
  category TEXT,                   -- 'Burgers', 'Drinks', 'Sides'
  is_available BOOLEAN DEFAULT TRUE,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### payment_methods
```sql
-- Maps to PaymentMethodsScreen CARDS[]
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT NOT NULL,  -- Stripe's token, never raw card
  last_four TEXT NOT NULL,                  -- last 4 digits only
  brand TEXT NOT NULL,                      -- 'visa', 'mastercard'
  expiry_month INTEGER,
  expiry_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### orders
```sql
-- Maps to OrdersScreen ORDERS[], OrderDetailsScreen ORDER_DATA
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES sellers(id),
  delivery_address_id UUID REFERENCES addresses(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  status TEXT NOT NULL DEFAULT 'pending',
  -- status values: pending | confirmed | preparing | picked_up | nearby | arriving | delivered | cancelled
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(8,2) NOT NULL,
  service_fee DECIMAL(8,2) NOT NULL,
  tip DECIMAL(8,2) DEFAULT 0,
  tax DECIMAL(8,2) NOT NULL,
  discount DECIMAL(8,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  promo_code TEXT,
  delivery_instructions TEXT,
  estimated_delivery_time TIMESTAMPTZ,
  stripe_payment_intent_id TEXT,
  idempotency_key TEXT UNIQUE,       -- prevents double-orders on double-tap
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### order_items
```sql
-- Maps to ORDER_DATA.items[]
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  name TEXT NOT NULL,              -- snapshot at time of order
  price DECIMAL(8,2) NOT NULL,     -- snapshot at time of order
  quantity INTEGER NOT NULL DEFAULT 1,
  customizations TEXT[],           -- ['Extra cheese', 'No onions']
  item_total DECIMAL(8,2) NOT NULL
);
```

### promo_codes
```sql
-- Replaces the hardcoded "save10" in CartScreen
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL,     -- 'percent' | 'flat'
  discount_value DECIMAL(8,2) NOT NULL,
  min_order_amount DECIMAL(8,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);
```

### order_reviews
```sql
-- Maps to RateOrderScreen
CREATE TABLE order_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE REFERENCES orders(id),
  user_id UUID REFERENCES users(id),
  seller_id UUID REFERENCES sellers(id),
  food_rating INTEGER CHECK (food_rating BETWEEN 1 AND 5),
  delivery_rating INTEGER CHECK (delivery_rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## PART 3 — API ENDPOINTS

Every endpoint below maps directly to a screen or button in your app.

### Authentication
```
POST /auth/signup         ← SignupScreen handleSignup()
POST /auth/login          ← LoginScreen handleLogin()
POST /auth/logout         ← SettingsScreen logout
POST /auth/refresh        ← token refresh interceptor
POST /auth/forgot-password
POST /auth/reset-password
```

### Profile
```
GET    /profile           ← ProfileScreen
PUT    /profile           ← EditProfileScreen save button
DELETE /profile           ← DeleteAccountScreen handleDelete() (currently a stub)
```

### Addresses
```
GET    /addresses         ← AddressesScreen
POST   /addresses         ← EditAddressScreen save
PUT    /addresses/:id     ← EditAddressScreen edit
DELETE /addresses/:id     ← AddressesScreen delete
PUT    /addresses/:id/default
```

### Sellers
```
GET    /sellers                        ← HomeScreen SELLERS[] (replace hardcoded data)
GET    /sellers?category=food          ← CategoryBrowseScreen (filtered by id param)
GET    /sellers?lat=&lng=&radius=5km   ← location-based results
GET    /sellers/:id                    ← SellerScreen
GET    /sellers/:id/menu               ← SellerScreen menu items
```

### Cart (Server-Side Validation at Checkout)
```
POST /cart/validate       ← Called before checkout — validates item prices + availability
```
> Cart state lives on the client (Redux). The server validates it at checkout time.

### Promo Codes
```
POST /promos/validate     ← CartScreen applyPromo() (REPLACE the hardcoded "save10" check)
Body: { code, subtotal, user_id }
Returns: { valid, discount_type, discount_value, message }
```

### Orders
```
POST   /orders            ← CheckoutScreen handlePlaceOrder() (currently does nothing)
GET    /orders            ← OrdersScreen ORDERS[]
GET    /orders/active     ← OrdersScreen ACTIVE_ORDERS[]
GET    /orders/:id        ← OrderDetailsScreen ORDER_DATA (currently hardcoded)
GET    /orders/:id/track  ← OrderTrackingScreen (driver location + status)
POST   /orders/:id/cancel
POST   /orders/:id/reorder
POST   /orders/:id/review ← RateOrderScreen submit button
```

### Payments
```
POST /payments/setup-intent        ← creates Stripe SetupIntent for saving a card
POST /payments/methods             ← add new card after Stripe confirmation
GET  /payments/methods             ← PaymentMethodsScreen CARDS[]
DELETE /payments/methods/:id
PUT    /payments/methods/:id/default
```

### Rewards
```
GET /rewards/points                ← RewardsScreen
GET /rewards/referral-code        ← ReferralScreen
POST /rewards/redeem
```

---

## PART 4 — SUPABASE QUICKSTART (Option A — Fastest Path)

### Step 1: Create project
```
1. Go to supabase.com → New Project
2. Pick a region close to your users
3. Save your project URL and anon key
```

### Step 2: Install in your React Native app
```bash
cd "C:\Users\Christopher Obi-Gabr\Downloads\NATIVE APP"
npx expo install @supabase/supabase-js expo-secure-store
```

### Step 3: Create your Supabase client
Create `src/services/supabase.ts`:
```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

Create `.env` in your project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

### Step 4: Implement auth.ts (replace the empty file)
Create `src/services/api/auth.ts`:
```ts
import { supabase } from "../supabase";

export const authService = {
  async signup(email: string, password: string, fullName: string, phone: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone },
      },
    });
    if (error) throw error;
    return data;
  },

  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
};
```

### Step 5: Fix SignupScreen (wire to real auth)
In `src/screens/auth/SignupScreen.tsx`, replace `handleSignup`:
```ts
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSignup = async () => {
  if (!name || !email || !password) {
    setError("Please fill in all fields");
    return;
  }
  if (!agreeToTerms) {
    setError("Please agree to the Terms & Conditions");
    return;
  }

  setLoading(true);
  setError("");
  try {
    await authService.signup(email, password, name, phone);
    router.replace("/(tabs)");
  } catch (e: any) {
    setError(e.message || "Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

### Step 6: Add Route Guard to _layout.tsx
```ts
// app/_layout.tsx — inside RootLayoutNav()
const [session, setSession] = useState(null);
const [checking, setChecking] = useState(true);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    setChecking(false);
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });

  return () => subscription.unsubscribe();
}, []);

if (checking) return null; // or a splash screen

// Then in your Stack — add a redirect:
<Stack.Screen
  name="(tabs)"
  redirect={!session}   // redirects to onboarding if no session
/>
```

### Step 7: Implement sellers.ts
```ts
// src/services/api/sellers.ts
import { supabase } from "../supabase";

export const sellersService = {
  async list(category?: string) {
    let query = supabase.from("sellers").select("*").eq("is_open", true);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("sellers")
      .select("*, menu_items(*)")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};
```

### Step 8: Implement orders.ts
```ts
// src/services/api/orders.ts
import { supabase } from "../supabase";

export const ordersService = {
  async create(orderPayload: {
    seller_id: string;
    delivery_address_id: string;
    payment_method_id: string;
    items: { menu_item_id: string; quantity: number; customizations: string[] }[];
    promo_code?: string;
    tip: number;
    delivery_instructions?: string;
    idempotency_key: string;  // pass a UUID generated at cart creation time
  }) {
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: orderPayload,
    });
    if (error) throw error;
    return data;
  },

  async list() {
    const { data, error } = await supabase
      .from("orders")
      .select("*, sellers(name, image_url), order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        sellers(name, address, image_url),
        addresses(street, city),
        payment_methods(brand, last_four),
        order_items(*)
      `)
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};
```

---

## PART 5 — PROMO CODE EDGE FUNCTION

This replaces the hardcoded `"save10"` in CartScreen entirely.

In Supabase Dashboard → Edge Functions → New Function `validate-promo`:
```ts
// supabase/functions/validate-promo/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const { code, subtotal } = await req.json();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: promo } = await supabase
    .from("promo_codes")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!promo) {
    return new Response(JSON.stringify({ valid: false, message: "Invalid promo code" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
    return new Response(JSON.stringify({ valid: false, message: "Promo code has expired" }), {
      status: 200,
    });
  }

  if (subtotal < promo.min_order_amount) {
    return new Response(JSON.stringify({
      valid: false,
      message: `Minimum order of $${promo.min_order_amount} required`,
    }), { status: 200 });
  }

  const discountAmount =
    promo.discount_type === "percent"
      ? (subtotal * promo.discount_value) / 100
      : promo.discount_value;

  return new Response(JSON.stringify({
    valid: true,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    discount_amount: discountAmount,
    message: `${promo.discount_value}${promo.discount_type === "percent" ? "%" : "$"} off applied!`,
  }), { status: 200, headers: { "Content-Type": "application/json" } });
});
```

---

## PART 6 — STRIPE PAYMENT INTEGRATION

```bash
npx expo install @stripe/stripe-react-native
```

In `app/_layout.tsx`, wrap with StripeProvider:
```tsx
import { StripeProvider } from "@stripe/stripe-react-native";

<StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}>
  <ThemeProvider>
    <RootLayoutNav />
  </ThemeProvider>
</StripeProvider>
```

In `PaymentMethodsScreen`, replace the mock "Add New Payment Method" button:
```ts
import { useStripe } from "@stripe/stripe-react-native";

const { initPaymentSheet, presentPaymentSheet } = useStripe();

const handleAddCard = async () => {
  // 1. Get a SetupIntent from your backend
  const { data } = await supabase.functions.invoke("create-setup-intent");
  
  // 2. Init Stripe sheet
  await initPaymentSheet({
    setupIntentClientSecret: data.client_secret,
    merchantDisplayName: "QuickServe",
  });
  
  // 3. Present to user
  const { error } = await presentPaymentSheet();
  if (!error) {
    // Card saved — refresh payment methods list
  }
};
```

---

## PART 7 — REAL-TIME ORDER TRACKING

Supabase Realtime lets you subscribe to database row changes — perfect for live order status.

In `OrderTrackingScreen`, replace the static "Arriving in 4 mins":
```ts
import { supabase } from "@/src/services/supabase";
import { useEffect, useState } from "react";

const [orderStatus, setOrderStatus] = useState("preparing");
const [driverLocation, setDriverLocation] = useState(null);

useEffect(() => {
  const channel = supabase
    .channel(`order-${orderId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `id=eq.${orderId}`,
      },
      (payload) => {
        setOrderStatus(payload.new.status);
      }
    )
    .subscribe();

  return () => supabase.removeChannel(channel);
}, [orderId]);
```

---

## PART 8 — PUSH NOTIFICATIONS

```bash
npx expo install expo-notifications expo-device
```

In `src/services/notifications/pushNotifications.ts` (currently empty):
```ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { supabase } from "../supabase";

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  // Save token to user profile in Supabase
  await supabase
    .from("users")
    .update({ push_token: token })
    .eq("id", (await supabase.auth.getUser()).data.user?.id);

  return token;
}
```

Your backend sends notifications when order status changes:
```ts
// In your Supabase Edge Function (or webhook):
await fetch("https://exp.host/--/api/v2/push/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: user.push_token,
    title: "Order Update",
    body: "Your order is on the way! 🛵",
    data: { orderId },
  }),
});
```

---

## PART 9 — REDUX SLICE WIRING (Fix the Empty Slices)

### authSlice.ts
```ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/src/services/api/auth";

export const login = createAsyncThunk("auth/login", async ({ email, password }: any) => {
  return await authService.login(email, password);
});

export const signup = createAsyncThunk("auth/signup", async ({ email, password, name, phone }: any) => {
  return await authService.signup(email, password, name, phone);
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, session: null, loading: false, error: null },
  reducers: {
    clearAuth: (state) => { state.user = null; state.session = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
```

### cartSlice.ts
```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  seller_id: string;
  seller_name: string;
  image_url: string;
  customizations: string[];
}

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [] as CartItem[], idempotencyKey: "" },
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
        // Generate idempotency key on first item add
        if (!state.idempotencyKey) {
          state.idempotencyKey = Date.now().toString() + Math.random().toString(36);
        }
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
      state.items = state.items.filter((i) => i.quantity > 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.idempotencyKey = "";
    },
  },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

---

## PART 10 — IMPLEMENTATION ORDER

Do this in exactly this sequence. Don't skip steps.

### Week 1 — Foundation
```
Day 1-2:
  [ ] Create Supabase project
  [ ] Run the database schema SQL (Part 2) in Supabase SQL editor
  [ ] Install supabase-js in the app
  [ ] Create src/services/supabase.ts
  [ ] Create .env file with Supabase keys
  [ ] Add .env to .gitignore immediately

Day 3-4:
  [ ] Implement authService (auth.ts)
  [ ] Wire SignupScreen to real authService.signup()
  [ ] Wire LoginScreen to real authService.login()
  [ ] Add route guard to _layout.tsx
  [ ] Test: signing up creates a row in users table ✓
  [ ] Test: can't access tabs without logging in ✓

Day 5:
  [ ] Wire Redux store (fix store.ts)
  [ ] Wire authSlice and cartSlice
  [ ] Wrap _layout.tsx with Redux Provider
  [ ] Wire CartScreen items to Redux cartSlice instead of CART_ITEMS constant
```

### Week 2 — Core Features
```
Day 1-2:
  [ ] Seed sellers table with real data via Supabase dashboard
  [ ] Implement sellersService (sellers.ts)
  [ ] Wire HomeScreen to fetch real sellers instead of hardcoded SELLERS[]
  [ ] Wire CategoryBrowseScreen to filter sellers by category id param

Day 3-4:
  [ ] Deploy validate-promo Edge Function
  [ ] Wire CartScreen applyPromo() to call Edge Function instead of hardcoded check
  [ ] Implement ordersService (orders.ts)
  [ ] Wire CheckoutScreen handlePlaceOrder() to ordersService.create()
  [ ] Wire OrdersScreen to ordersService.list()
  [ ] Wire OrderDetailsScreen to ordersService.getById(id) using route param

Day 5:
  [ ] Implement addressesService
  [ ] Wire AddressesScreen, EditAddressScreen
  [ ] Wire CheckoutScreen address picker to user's actual addresses
```

### Week 3 — Payments & Notifications
```
[ ] Set up Stripe account (free)
[ ] Install @stripe/stripe-react-native
[ ] Deploy create-setup-intent Edge Function
[ ] Wire PaymentMethodsScreen "Add Card" to Stripe payment sheet
[ ] Wire CheckoutScreen payment method to real payment methods from DB
[ ] Implement create-order Edge Function that charges via Stripe
[ ] Set up push notifications (expo-notifications)
[ ] Test full end-to-end order flow
```

### Week 4 — Real-Time & Polish
```
[ ] Wire OrderTrackingScreen to Supabase Realtime order updates
[ ] Wire RateOrderScreen to ordersService.submitReview()
[ ] Wire DeleteAccountScreen to real authService.deleteAccount()
[ ] Add error boundaries
[ ] Add network error fallback screens
[ ] Remove ALL hardcoded constants from screens
[ ] Remove MISSING_FEATURES.md from the repo
```

---

## PART 11 — SEED DATA

Paste this in Supabase SQL editor to get real data in your app immediately:

```sql
-- Seed sellers
INSERT INTO sellers (id, name, category, description, image_url, rating, delivery_fee, min_delivery_time, max_delivery_time, is_open, is_featured) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Gourmet Burgers', 'food', 'Premium burgers made fresh daily', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.5, 2.99, 25, 35, true, true),
  ('11111111-0000-0000-0000-000000000002', 'Health First Pharmacy', 'pharmacy', 'Your local health store', 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400', 4.8, 1.99, 10, 20, true, false),
  ('11111111-0000-0000-0000-000000000003', 'Organic Harvest', 'grocery', 'Fresh organic produce', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', 4.2, 3.99, 30, 45, true, true);

-- Seed menu items for Gourmet Burgers
INSERT INTO menu_items (seller_id, name, description, price, category, is_popular) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Signature Whopper', 'Our legendary flame-grilled beef burger', 12.99, 'Burgers', true),
  ('11111111-0000-0000-0000-000000000001', 'Loaded Cheesy Fries', 'Crispy fries smothered in cheese sauce', 6.99, 'Sides', true),
  ('11111111-0000-0000-0000-000000000001', 'Strawberry Shake', 'Thick creamy strawberry milkshake', 4.50, 'Drinks', false);

-- Seed promo codes (replace the hardcoded "save10")
INSERT INTO promo_codes (code, discount_type, discount_value, min_order_amount, max_uses, is_active) VALUES
  ('SAVE10', 'percent', 10, 0, 1000, true),
  ('FIRST20', 'percent', 20, 15, 500, true),
  ('FLAT5', 'flat', 5, 20, 200, true);
```

---

## QUICK REFERENCE: Files to Change in Priority Order

| File | Current State | Action |
|---|---|---|
| `src/services/supabase.ts` | Doesn't exist | **CREATE** |
| `src/services/api/auth.ts` | 0 bytes | **IMPLEMENT** (Week 1 Day 3) |
| `src/store/store.ts` | 0 bytes | **IMPLEMENT** (Week 1 Day 5) |
| `src/store/slices/authSlice.ts` | 0 bytes | **IMPLEMENT** (Week 1 Day 5) |
| `src/store/slices/cartSlice.ts` | 0 bytes | **IMPLEMENT** (Week 1 Day 5) |
| `app/_layout.tsx` | No guard, no Provider | **PATCH** (Week 1 Day 4) |
| `src/screens/auth/SignupScreen.tsx` | Fake handler | **PATCH** (Week 1 Day 3) |
| `src/services/api/sellers.ts` | 0 bytes | **IMPLEMENT** (Week 2 Day 1) |
| `src/services/api/orders.ts` | 0 bytes | **IMPLEMENT** (Week 2 Day 3) |
| `src/screens/cart/CartScreen.tsx` | Hardcoded data + promo | **PATCH** (Week 2 Day 3) |
| `src/screens/checkout/CheckoutScreen.tsx` | Hardcoded total, fake order | **PATCH** (Week 2 Day 4) |
| `src/screens/orders/OrderDetailsScreen.tsx` | Ignores id param | **PATCH** (Week 2 Day 4) |
| `src/services/api/profile.ts` | 0 bytes | **IMPLEMENT** (Week 3) |
| `src/screens/profile/DeleteAccountScreen.tsx` | Fake delete | **PATCH** (Week 4) |
