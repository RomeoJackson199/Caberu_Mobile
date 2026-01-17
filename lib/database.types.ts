export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      appointment_slots: {
        Row: {
          appointment_id: string | null;
          created_at: string;
          dentist_id: string;
          emergency_only: boolean | null;
          id: string;
          is_available: boolean;
          slot_date: string;
          slot_time: string;
          updated_at: string;
        };
        Insert: {
          appointment_id?: string | null;
          created_at?: string;
          dentist_id: string;
          emergency_only?: boolean | null;
          id?: string;
          is_available?: boolean;
          slot_date: string;
          slot_time: string;
          updated_at?: string;
        };
        Update: {
          appointment_id?: string | null;
          created_at?: string;
          dentist_id?: string;
          emergency_only?: boolean | null;
          id?: string;
          is_available?: boolean;
          slot_date?: string;
          slot_time?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          appointment_date: string;
          consultation_notes: string | null;
          created_at: string;
          dentist_id: string;
          duration_minutes: number | null;
          id: string;
          is_for_user: boolean | null;
          notes: string | null;
          patient_age: number | null;
          patient_id: string;
          patient_name: string | null;
          patient_relationship: string | null;
          photo_url: string | null;
          reason: string | null;
          status: Database["public"]["Enums"]["appointment_status"] | null;
          updated_at: string;
          urgency: Database["public"]["Enums"]["urgency_level"] | null;
        };
        Insert: {
          appointment_date: string;
          consultation_notes?: string | null;
          created_at?: string;
          dentist_id: string;
          duration_minutes?: number | null;
          id?: string;
          is_for_user?: boolean | null;
          notes?: string | null;
          patient_age?: number | null;
          patient_id: string;
          patient_name?: string | null;
          patient_relationship?: string | null;
          photo_url?: string | null;
          reason?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"] | null;
          updated_at?: string;
          urgency?: Database["public"]["Enums"]["urgency_level"] | null;
        };
        Update: {
          appointment_date?: string;
          consultation_notes?: string | null;
          created_at?: string;
          dentist_id?: string;
          duration_minutes?: number | null;
          id?: string;
          is_for_user?: boolean | null;
          notes?: string | null;
          patient_age?: number | null;
          patient_id?: string;
          patient_name?: string | null;
          patient_relationship?: string | null;
          photo_url?: string | null;
          reason?: string | null;
          status?: Database["public"]["Enums"]["appointment_status"] | null;
          updated_at?: string;
          urgency?: Database["public"]["Enums"]["urgency_level"] | null;
        };
      };
      chat_messages: {
        Row: {
          created_at: string;
          id: string;
          is_bot: boolean | null;
          message: string;
          message_type: string | null;
          metadata: Json | null;
          session_id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_bot?: boolean | null;
          message: string;
          message_type?: string | null;
          metadata?: Json | null;
          session_id: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_bot?: boolean | null;
          message?: string;
          message_type?: string | null;
          metadata?: Json | null;
          session_id?: string;
          user_id?: string | null;
        };
      };
      dentist_availability: {
        Row: {
          break_end_time: string | null;
          break_start_time: string | null;
          created_at: string;
          day_of_week: number;
          dentist_id: string;
          end_time: string;
          id: string;
          is_available: boolean | null;
          start_time: string;
          updated_at: string;
        };
        Insert: {
          break_end_time?: string | null;
          break_start_time?: string | null;
          created_at?: string;
          day_of_week: number;
          dentist_id: string;
          end_time: string;
          id?: string;
          is_available?: boolean | null;
          start_time: string;
          updated_at?: string;
        };
        Update: {
          break_end_time?: string | null;
          break_start_time?: string | null;
          created_at?: string;
          day_of_week?: number;
          dentist_id?: string;
          end_time?: string;
          id?: string;
          is_available?: boolean | null;
          start_time?: string;
          updated_at?: string;
        };
      };
      dentists: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean | null;
          license_number: string | null;
          profile_id: string;
          specialization: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_active?: boolean | null;
          license_number?: string | null;
          profile_id: string;
          specialization?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean | null;
          license_number?: string | null;
          profile_id?: string;
          specialization?: string | null;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          address: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string;
          emergency_contact: string | null;
          first_name: string;
          id: string;
          last_name: string;
          medical_history: string | null;
          phone: string | null;
          preferred_language: string | null;
          role: Database["public"]["Enums"]["user_role"];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          address?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email: string;
          emergency_contact?: string | null;
          first_name: string;
          id?: string;
          last_name: string;
          medical_history?: string | null;
          phone?: string | null;
          preferred_language?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          address?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string;
          emergency_contact?: string | null;
          first_name?: string;
          id?: string;
          last_name?: string;
          medical_history?: string | null;
          phone?: string | null;
          preferred_language?: string | null;
          role?: Database["public"]["Enums"]["user_role"];
          updated_at?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      book_appointment_slot: {
        Args: {
          p_dentist_id: string;
          p_slot_date: string;
          p_slot_time: string;
          p_appointment_id: string;
        };
        Returns: boolean;
      };
      cancel_appointment: {
        Args: { appointment_id: string; user_id: string };
        Returns: boolean;
      };
      generate_daily_slots: {
        Args: { p_dentist_id: string; p_date: string };
        Returns: undefined;
      };
      release_appointment_slot: {
        Args: { p_appointment_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      appointment_status: "pending" | "confirmed" | "completed" | "cancelled";
      urgency_level: "low" | "medium" | "high" | "emergency";
      user_role: "patient" | "dentist" | "admin";
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
