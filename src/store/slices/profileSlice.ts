import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "@/src/services/supabase";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  walletBalance: number;
  rewardPoints: number;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
  deliveryInstructions: string;
}

interface ProfileState {
  profile: UserProfile | null;
  addresses: Address[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  addresses: [],
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetch",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Failed to fetch profile");
    }
  }
);

export const fetchAddresses = createAsyncThunk(
  "profile/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .order("is_default", { ascending: false });
      if (error) throw error;
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Failed to fetch addresses");
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/update",
  async (
    updates: Partial<{ full_name: string; phone: string; avatar_url: string }>,
    { rejectWithValue }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? "Failed to update profile");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile(state) {
      state.profile = null;
      state.addresses = [];
      state.error = null;
    },
    clearProfileError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.profile = {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.full_name,
          phone: action.payload.phone ?? "",
          avatarUrl: action.payload.avatar_url ?? null,
          walletBalance: action.payload.wallet_balance ?? 0,
          rewardPoints: action.payload.reward_points ?? 0,
        };
      }
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchAddresses.fulfilled, (state, action) => {
      state.addresses = (action.payload ?? []).map((a: any) => ({
        id: a.id,
        label: a.label,
        street: a.street,
        city: a.city,
        state: a.state ?? "",
        zip: a.zip ?? "",
        isDefault: a.is_default,
        deliveryInstructions: a.delivery_instructions ?? "",
      }));
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      if (state.profile && action.payload) {
        state.profile.fullName = action.payload.full_name;
        state.profile.phone = action.payload.phone ?? "";
        state.profile.avatarUrl = action.payload.avatar_url ?? null;
      }
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearProfile, clearProfileError } = profileSlice.actions;
export default profileSlice.reducer;
