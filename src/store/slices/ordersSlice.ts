import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "@/src/services/supabase";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customizations: string[];
}

export interface Order {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerImage: string;
  status: "pending" | "confirmed" | "preparing" | "picked_up" | "nearby" | "arriving" | "delivered" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tip: number;
  tax: number;
  discount: number;
  total: number;
  deliveryAddress: string;
  createdAt: string;
  estimatedDeliveryTime: string | null;
}

interface OrdersState {
  orders: Order[];
  activeOrder: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  activeOrder: null,
  loading: false,
  error: null,
};

// Map raw Supabase row (snake_case + joined tables) → Order (camelCase)
function mapRow(row: any): Order {
  return {
    id: row.id,
    sellerId: row.seller_id,
    sellerName: row.sellers?.name ?? "",
    sellerImage: row.sellers?.image_url ?? "",
    status: row.status,
    items: (row.order_items ?? []).map((i: any) => ({
      id: i.id,
      name: i.name ?? i.menu_items?.name ?? "",
      price: i.unit_price ?? i.price ?? 0,
      quantity: i.quantity,
      customizations: i.customizations ?? [],
    })),
    subtotal: row.subtotal ?? 0,
    deliveryFee: row.delivery_fee ?? 0,
    serviceFee: row.service_fee ?? 0,
    tip: row.tip ?? 0,
    tax: row.tax ?? 0,
    discount: row.discount ?? 0,
    total: row.total ?? 0,
    deliveryAddress: row.addresses?.street ?? row.delivery_address ?? "",
    createdAt: row.created_at,
    estimatedDeliveryTime: row.estimated_delivery_time ?? null,
  };
}

export const fetchOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          sellers (id, name, image_url),
          order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Failed to fetch orders");
    }
  }
);

export const fetchActiveOrder = createAsyncThunk(
  "orders/fetchActive",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, sellers (id, name, image_url), order_items (*)`)
        .in("status", ["pending", "confirmed", "preparing", "picked_up", "nearby", "arriving"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Failed to fetch active order");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    updateOrderStatus(state, action: { payload: { orderId: string; status: Order["status"] } }) {
      // Called by the Supabase Realtime listener in OrderTrackingScreen
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
      if (state.activeOrder?.id === action.payload.orderId) {
        state.activeOrder.status = action.payload.status;
        if (action.payload.status === "delivered" || action.payload.status === "cancelled") {
          state.activeOrder = null;
        }
      }
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = (action.payload ?? []).map(mapRow);
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchActiveOrder.fulfilled, (state, action) => {
      state.activeOrder = action.payload ? mapRow(action.payload) : null;
    });
  },
});

export const { updateOrderStatus, clearOrderError } = ordersSlice.actions;
export default ordersSlice.reducer;
