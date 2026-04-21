import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;             // menu_item_id from DB
  name: string;
  price: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  imageUrl: string;
  customizations: string[];
}

interface CartState {
  items: CartItem[];
  idempotencyKey: string; // prevents double-orders on double-tap, generated on first add
  promoCode: string;
  promoDiscount: number;  // server-validated discount amount in dollars
  promoType: "percent" | "flat" | null;
}

const initialState: CartState = {
  items: [],
  idempotencyKey: "",
  promoCode: "",
  promoDiscount: 0,
  promoType: null,
};

function generateKey(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      // If cart has items from a different seller, clear it first
      if (state.items.length > 0 && state.items[0].sellerId !== action.payload.sellerId) {
        state.items = [];
        state.promoCode = "";
        state.promoDiscount = 0;
        state.promoType = null;
      }

      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      // Generate idempotency key on first item
      if (!state.idempotencyKey) {
        state.idempotencyKey = generateKey();
      }
    },

    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      if (state.items.length === 0) {
        state.idempotencyKey = "";
        state.promoCode = "";
        state.promoDiscount = 0;
        state.promoType = null;
      }
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.items = state.items.filter((i) => i.quantity > 0);
    },

    applyPromo(
      state,
      action: PayloadAction<{
        code: string;
        discountAmount: number;
        discountType: "percent" | "flat";
      }>
    ) {
      state.promoCode = action.payload.code;
      state.promoDiscount = action.payload.discountAmount;
      state.promoType = action.payload.discountType;
    },

    removePromo(state) {
      state.promoCode = "";
      state.promoDiscount = 0;
      state.promoType = null;
    },

    clearCart(state) {
      state.items = [];
      state.idempotencyKey = "";
      state.promoCode = "";
      state.promoDiscount = 0;
      state.promoType = null;
    },
  },
});

// ─── Selectors ───────────────────────────────────────────────────────────────

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectPromoDiscount = (state: { cart: CartState }) =>
  state.cart.promoDiscount;
export const selectIdempotencyKey = (state: { cart: CartState }) =>
  state.cart.idempotencyKey;

export const {
  addItem,
  removeItem,
  updateQuantity,
  applyPromo,
  removePromo,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
