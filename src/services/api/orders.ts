import { supabase } from "../supabase";
import { CartItem } from "@/src/store/slices/cartSlice";

export interface CreateOrderPayload {
  sellerId: string;
  deliveryAddressId: string;
  paymentMethodId: string;
  items: CartItem[];
  tip: number;
  promoCode?: string;
  promoDiscount?: number;
  deliveryInstructions?: string;
  idempotencyKey: string;
}

export interface ValidatePromoPayload {
  code: string;
  subtotal: number;
}

export interface PromoValidationResult {
  valid: boolean;
  discountType: "percent" | "flat" | null;
  discountValue: number;
  discountAmount: number;
  message: string;
}

export const ordersService = {
  async validatePromo(payload: ValidatePromoPayload): Promise<PromoValidationResult> {
    const { data, error } = await supabase.functions.invoke("validate-promo", {
      body: { code: payload.code, subtotal: payload.subtotal },
    });
    if (error) throw error;
    return {
      valid: data.valid,
      discountType: data.discount_type ?? null,
      discountValue: data.discount_value ?? 0,
      discountAmount: data.discount_amount ?? 0,
      message: data.message ?? "",
    };
  },

  async create(payload: CreateOrderPayload) {
    // Calculate totals server-side via Edge Function for security
    const { data, error } = await supabase.functions.invoke("create-order", {
      body: {
        seller_id: payload.sellerId,
        delivery_address_id: payload.deliveryAddressId,
        payment_method_id: payload.paymentMethodId,
        items: payload.items.map((i) => ({
          menu_item_id: i.id,
          quantity: i.quantity,
          customizations: i.customizations,
        })),
        tip: payload.tip,
        promo_code: payload.promoCode ?? null,
        promo_discount: payload.promoDiscount ?? 0,
        delivery_instructions: payload.deliveryInstructions ?? "",
        idempotency_key: payload.idempotencyKey,
      },
    });
    if (error) throw error;
    return data;
  },

  async list() {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        sellers (id, name, image_url),
        order_items (*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        sellers (id, name, address, image_url),
        addresses (street, city, state, zip),
        payment_methods (brand, last_four),
        order_items (*)
      `)
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async getActive() {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, sellers (id, name, image_url), order_items (*)`)
      .in("status", [
        "pending",
        "confirmed",
        "preparing",
        "picked_up",
        "nearby",
        "arriving",
      ])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data ?? null;
  },

  async cancel(orderId: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId)
      .in("status", ["pending", "confirmed"]); // can only cancel early

    if (error) throw error;
  },

  async submitReview(orderId: string, review: {
    foodRating: number;
    deliveryRating: number;
    comment: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data: order } = await supabase
      .from("orders")
      .select("seller_id")
      .eq("id", orderId)
      .single();

    const { error } = await supabase.from("order_reviews").insert({
      order_id: orderId,
      user_id: user.id,
      seller_id: order?.seller_id,
      food_rating: review.foodRating,
      delivery_rating: review.deliveryRating,
      comment: review.comment,
    });

    if (error) throw error;
  },
};
