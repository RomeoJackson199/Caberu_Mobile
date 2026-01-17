import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const SUPABASE_URL = "https://gjvxcisbaxhhblhsytar.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqdnhjaXNiYXhoaGJsaHN5dGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjU4MDUsImV4cCI6MjA2NzY0MTgwNX0.p4HO2McB5IqP9iQ_p_Z6yHKCkKyDXuIm7ono6UJZcmM";

// Custom storage adapter for React Native using AsyncStorage
// Note: SecureStore has a 2048 byte limit which JWT tokens can exceed
// So we use AsyncStorage for all Supabase auth data for reliability
const ExpoStorageAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoStorageAdapter,
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

// Fetch dentists
export async function fetchDentists() {
  const { data, error } = await supabase
    .from("dentists")
    .select(`
      id,
      specialization,
      license_number,
      is_active,
      profiles:profile_id (
        first_name,
        last_name,
        email
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  return { data, error };
}

// Fetch user appointments
export async function fetchUserAppointments(profileId: string) {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      appointment_date,
      reason,
      status,
      urgency,
      patient_name,
      notes,
      consultation_notes,
      dentist:dentist_id (
        id,
        specialization,
        profiles:profile_id (
          first_name,
          last_name
        )
      )
    `)
    .eq("patient_id", profileId)
    .order("appointment_date", { ascending: true });
  return { data, error };
}

// Create appointment
export async function createAppointment(appointment: {
  patient_id: string;
  dentist_id: string;
  appointment_date: string;
  reason?: string;
  urgency?: "low" | "medium" | "high" | "emergency";
  patient_name?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("appointments")
    .insert({
      ...appointment,
      status: "pending",
    })
    .select()
    .single();
  return { data, error };
}

// Book appointment slot (RPC)
export async function bookAppointmentSlot(
  dentistId: string,
  slotDate: string,
  slotTime: string,
  appointmentId: string
) {
  const { data, error } = await supabase.rpc("book_appointment_slot", {
    p_dentist_id: dentistId,
    p_slot_date: slotDate,
    p_slot_time: slotTime,
    p_appointment_id: appointmentId,
  });
  return { data, error };
}

// Cancel appointment (RPC)
export async function cancelAppointmentRPC(appointmentId: string, userId: string) {
  const { data, error } = await supabase.rpc("cancel_appointment", {
    appointment_id: appointmentId,
    user_id: userId,
  });
  return { data, error };
}

// Generate daily slots (RPC)
export async function generateDailySlots(dentistId: string, date: string) {
  const { data, error } = await supabase.rpc("generate_daily_slots", {
    p_dentist_id: dentistId,
    p_date: date,
  });
  return { data, error };
}

// Fetch available slots for a dentist on a date
export async function fetchAvailableSlots(dentistId: string, date: string) {
  const { data, error } = await supabase
    .from("appointment_slots")
    .select("id, slot_time, is_available, emergency_only")
    .eq("dentist_id", dentistId)
    .eq("slot_date", date)
    .eq("is_available", true)
    .order("slot_time");
  return { data, error };
}

export { SUPABASE_URL, SUPABASE_ANON_KEY };
