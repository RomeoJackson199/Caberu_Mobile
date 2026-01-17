import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type { Database } from "./database.types";

const SUPABASE_URL = "https://gjvxcisbaxhhblhsytar.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnhjaXNiYXhoaGJsaHN5dGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjU4MDUsImV4cCI6MjA2NzY0MTgwNX0.p4HO2McB5IqP9iQ_p_Z6yHKCkKyDXuIm7ono6UJZcmM";

// Custom storage adapter that uses SecureStore for tokens and AsyncStorage for other data
const ExpoSecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      // Use SecureStore for auth tokens on native platforms
      if (Platform.OS !== "web") {
        const value = await SecureStore.getItemAsync(key);
        return value;
      }
      // Use AsyncStorage for web
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await SecureStore.setItemAsync(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS !== "web") {
        await SecureStore.deleteItemAsync(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper to get authenticated user
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Helper to get user session
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { first_name?: string; last_name?: string; phone?: string }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });
  return { data, error };
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Get user profile from profiles table
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data, error };
}

// Update user profile
export async function updateUserProfile(
  profileId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    date_of_birth?: string;
    medical_history?: string;
    address?: string;
    emergency_contact?: string;
    preferred_language?: string;
  }
) {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", profileId)
    .select()
    .single();
  return { data, error };
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
