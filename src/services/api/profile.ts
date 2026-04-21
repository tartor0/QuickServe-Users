import { supabase } from "../supabase";

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface AddressPayload {
  label: string;
  street: string;
  city: string;
  state?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  deliveryInstructions?: string;
  isDefault?: boolean;
}

export const profileService = {
  async getProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const updates: Record<string, any> = {};
    if (payload.fullName !== undefined) updates.full_name = payload.fullName;
    if (payload.phone !== undefined) updates.phone = payload.phone;
    if (payload.avatarUrl !== undefined) updates.avatar_url = payload.avatarUrl;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAddresses() {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async addAddress(payload: AddressPayload) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // If this is marked as default, clear existing default first
    if (payload.isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { data, error } = await supabase
      .from("addresses")
      .insert({
        user_id: user.id,
        label: payload.label,
        street: payload.street,
        city: payload.city,
        state: payload.state ?? null,
        zip: payload.zip ?? null,
        latitude: payload.latitude ?? null,
        longitude: payload.longitude ?? null,
        delivery_instructions: payload.deliveryInstructions ?? null,
        is_default: payload.isDefault ?? false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAddress(id: string, payload: Partial<AddressPayload>) {
    const updates: Record<string, any> = {};
    if (payload.label !== undefined) updates.label = payload.label;
    if (payload.street !== undefined) updates.street = payload.street;
    if (payload.city !== undefined) updates.city = payload.city;
    if (payload.state !== undefined) updates.state = payload.state;
    if (payload.zip !== undefined) updates.zip = payload.zip;
    if (payload.deliveryInstructions !== undefined)
      updates.delivery_instructions = payload.deliveryInstructions;

    const { error } = await supabase
      .from("addresses")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
  },

  async deleteAddress(id: string) {
    const { error } = await supabase
      .from("addresses")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },

  async setDefaultAddress(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Clear existing default
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    // Set new default
    const { error } = await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", id);

    if (error) throw error;
  },

  async deleteAccount() {
    // This calls a Supabase Edge Function that uses the service role key
    // to delete the auth user — cannot be done from the client directly
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) throw error;
    await supabase.auth.signOut();
  },
};
