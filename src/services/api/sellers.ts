import { supabase } from "../supabase";

export interface Seller {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  address: string;
  rating: number;
  ratingCount: number;
  deliveryFee: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  isOpen: boolean;
  isFeatured: boolean;
}

export interface MenuItem {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  isPopular: boolean;
}

function mapSeller(raw: any): Seller {
  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    description: raw.description ?? "",
    imageUrl: raw.image_url ?? "",
    address: raw.address ?? "",
    rating: raw.rating ?? 0,
    ratingCount: raw.rating_count ?? 0,
    deliveryFee: raw.delivery_fee ?? 0,
    minDeliveryTime: raw.min_delivery_time ?? 0,
    maxDeliveryTime: raw.max_delivery_time ?? 0,
    isOpen: raw.is_open ?? true,
    isFeatured: raw.is_featured ?? false,
  };
}

function mapMenuItem(raw: any): MenuItem {
  return {
    id: raw.id,
    sellerId: raw.seller_id,
    name: raw.name,
    description: raw.description ?? "",
    price: raw.price,
    imageUrl: raw.image_url ?? "",
    category: raw.category ?? "",
    isAvailable: raw.is_available ?? true,
    isPopular: raw.is_popular ?? false,
  };
}

export const sellersService = {
  async list(category?: string): Promise<Seller[]> {
    let query = supabase
      .from("sellers")
      .select("*")
      .eq("is_open", true)
      .order("is_featured", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(mapSeller);
  },

  async getFeatured(): Promise<Seller[]> {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("is_featured", true)
      .eq("is_open", true)
      .order("rating", { ascending: false })
      .limit(10);

    if (error) throw error;
    return (data ?? []).map(mapSeller);
  },

  async getById(id: string): Promise<Seller> {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return mapSeller(data);
  },

  async getMenu(sellerId: string): Promise<MenuItem[]> {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("seller_id", sellerId)
      .eq("is_available", true)
      .order("is_popular", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(mapMenuItem);
  },

  async search(query: string): Promise<Seller[]> {
    const { data, error } = await supabase
      .from("sellers")
      .select("*")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq("is_open", true)
      .limit(20);

    if (error) throw error;
    return (data ?? []).map(mapSeller);
  },
};
