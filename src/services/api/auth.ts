import { supabase } from "../supabase";

export interface SignupPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async signup({ email, password, fullName, phone }: SignupPayload) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone,
        },
      },
    });
    if (error) throw error;

    // Create a matching row in the public users table
    if (data.user) {
      const { error: profileError } = await supabase.from("users").insert({
        id: data.user.id,
        email,
        full_name: fullName,
        phone,
      });
      // Non-fatal — Supabase trigger can handle this too
      if (profileError) console.warn("Profile row creation:", profileError.message);
    }

    return data;
  },

  async login({ email, password }: LoginPayload) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  async deleteAccount() {
    // Calls a Supabase edge function that deletes the user server-side
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) throw error;
    await supabase.auth.signOut();
  },
};
