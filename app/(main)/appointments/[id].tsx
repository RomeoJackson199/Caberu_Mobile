import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  Button,
  Badge,
  Avatar,
  AlertDialog,
  LoadingSpinner,
} from "@/components/ui";
import { formatDate, formatTime, formatDateTime } from "@/lib/utils";

interface AppointmentDetail {
  id: string;
  appointment_date: string;
  reason: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  urgency: "low" | "medium" | "high" | "emergency" | null;
  notes: string | null;
  patient_name: string | null;
  consultation_notes: string | null;
  created_at: string;
  dentist: {
    id: string;
    specialization: string | null;
    profiles: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  useEffect(() => {
    if (id && user) {
      fetchAppointment();
    }
  }, [id, user]);

  const fetchAppointment = async () => {
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user!.id)
        .single();

      if (!profileData) return;

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          appointment_date,
          reason,
          status,
          urgency,
          notes,
          patient_name,
          consultation_notes,
          created_at,
          dentist:dentists (
            id,
            specialization,
            profiles (
              first_name,
              last_name,
              email
            )
          )
        `
        )
        .eq("id", id)
        .eq("patient_id", profileData.id)
        .single();

      if (error) throw error;
      setAppointment(data as unknown as AppointmentDetail);
    } catch (error) {
      console.error("Error fetching appointment:", error);
      toast({
        title: t.error,
        description: "Failed to load appointment details",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!appointment || !user) return;

    try {
      const { error } = await supabase.rpc("cancel_appointment", {
        appointment_id: appointment.id,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.appointmentCancelled,
        type: "success",
      });

      router.back();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: t.error,
        description: t.failedToCancelAppointment,
        type: "error",
      });
    }
  };

  if (loading) {
    return <LoadingSpinner className="flex-1" />;
  }

  if (!appointment) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
        <Text className="text-muted-foreground mt-4">
          Appointment not found
        </Text>
        <Button onPress={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </View>
    );
  }

  const appointmentDate = new Date(appointment.appointment_date);
  const isUpcoming =
    appointmentDate >= new Date() &&
    appointment.status !== "cancelled" &&
    appointment.status !== "completed";

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex flex-row items-center px-4 py-3 border-b border-border bg-card">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#0891b2" />
        </Pressable>
        <Text className="text-lg font-bold text-foreground">
          {t.appointmentDetails}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        {/* Status Badge */}
        <View className="items-center mb-6">
          <Badge
            variant={
              appointment.status === "confirmed"
                ? "success"
                : appointment.status === "cancelled"
                ? "destructive"
                : appointment.status === "completed"
                ? "info"
                : "warning"
            }
            className="px-6 py-2"
          >
            <Text className="text-base font-semibold">
              {appointment.status.toUpperCase()}
            </Text>
          </Badge>
        </View>

        {/* Date & Time Card */}
        <Card className="mb-4">
          <CardContent className="p-6 items-center">
            <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
              <Ionicons name="calendar" size={32} color="#0891b2" />
            </View>
            <Text className="text-2xl font-bold text-foreground">
              {formatDate(appointmentDate)}
            </Text>
            <Text className="text-xl text-primary mt-1">
              {formatTime(appointmentDate.toTimeString().substring(0, 5))}
            </Text>
          </CardContent>
        </Card>

        {/* Dentist Info */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-sm text-muted-foreground mb-3">Dentist</Text>
            <View className="flex flex-row items-center">
              <Avatar
                name={`${appointment.dentist.profiles.first_name} ${appointment.dentist.profiles.last_name}`}
                size="lg"
                className="mr-4"
              />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Dr. {appointment.dentist.profiles.first_name}{" "}
                  {appointment.dentist.profiles.last_name}
                </Text>
                {appointment.dentist.specialization && (
                  <Text className="text-muted-foreground">
                    {appointment.dentist.specialization}
                  </Text>
                )}
                <Text className="text-sm text-muted-foreground mt-1">
                  {appointment.dentist.profiles.email}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Appointment Details */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-sm text-muted-foreground mb-3">Details</Text>

            {appointment.reason && (
              <View className="mb-3">
                <Text className="text-xs text-muted-foreground">Reason</Text>
                <Text className="text-foreground font-medium">
                  {appointment.reason}
                </Text>
              </View>
            )}

            {appointment.patient_name && (
              <View className="mb-3">
                <Text className="text-xs text-muted-foreground">Patient</Text>
                <Text className="text-foreground font-medium">
                  {appointment.patient_name}
                </Text>
              </View>
            )}

            {appointment.urgency && (
              <View className="mb-3">
                <Text className="text-xs text-muted-foreground">Urgency</Text>
                <Badge
                  variant={
                    appointment.urgency === "emergency"
                      ? "destructive"
                      : appointment.urgency === "high"
                      ? "warning"
                      : "success"
                  }
                  className="self-start mt-1"
                >
                  {appointment.urgency}
                </Badge>
              </View>
            )}

            {appointment.notes && (
              <View className="mb-3">
                <Text className="text-xs text-muted-foreground">Notes</Text>
                <Text className="text-foreground">{appointment.notes}</Text>
              </View>
            )}

            <View>
              <Text className="text-xs text-muted-foreground">Booked on</Text>
              <Text className="text-foreground">
                {formatDateTime(appointment.created_at)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Consultation Notes (if completed) */}
        {appointment.consultation_notes && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <Text className="text-sm text-muted-foreground mb-2">
                Consultation Notes
              </Text>
              <Text className="text-foreground">
                {appointment.consultation_notes}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {isUpcoming && (
          <View className="mt-4">
            <Button
              variant="destructive"
              onPress={() => setCancelDialogOpen(true)}
              leftIcon={<Ionicons name="close-circle" size={20} color="#fff" />}
            >
              {t.cancelAppointment}
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Cancel Dialog */}
      <AlertDialog
        visible={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        title={t.confirmCancellation}
        description={t.confirmCancellationMessage}
        confirmText={t.yesCancelAppointment}
        cancelText={t.keepAppointment}
        onConfirm={handleCancel}
        destructive
      />
    </View>
  );
}
