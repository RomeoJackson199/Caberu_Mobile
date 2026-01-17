import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { router } from "expo-router";
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
  AlertDialog,
  LoadingSpinner,
} from "@/components/ui";
import { formatDate, formatTime, getStatusColor } from "@/lib/utils";

interface Appointment {
  id: string;
  appointment_date: string;
  reason: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  urgency: "low" | "medium" | "high" | "emergency" | null;
  patient_name: string | null;
  dentist: {
    id: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
    specialization: string | null;
  };
}

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async () => {
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
          patient_name,
          dentist:dentists (
            id,
            specialization,
            profiles (
              first_name,
              last_name
            )
          )
        `
        )
        .eq("patient_id", profileData.id)
        .order("appointment_date", { ascending: true });

      if (error) throw error;

      // Type assertion to match our interface
      setAppointments((data as unknown as Appointment[]) || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: t.error,
        description: "Failed to load appointments",
        type: "error",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleCancelAppointment = async () => {
    if (!selectedAppointment || !user) return;

    try {
      const { error } = await supabase.rpc("cancel_appointment", {
        appointment_id: selectedAppointment.id,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: t.success,
        description: t.appointmentCancelled,
        type: "success",
      });

      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: t.error,
        description: t.failedToCancelAppointment,
        type: "error",
      });
    } finally {
      setCancelDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  const upcomingAppointments = appointments.filter(
    (apt) =>
      new Date(apt.appointment_date) >= new Date() &&
      apt.status !== "cancelled" &&
      apt.status !== "completed"
  );

  const pastAppointments = appointments.filter(
    (apt) =>
      new Date(apt.appointment_date) < new Date() ||
      apt.status === "completed" ||
      apt.status === "cancelled"
  );

  if (!user) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <View className="w-20 h-20 rounded-full bg-muted items-center justify-center mb-6">
          <Ionicons name="calendar" size={40} color="#6b7280" />
        </View>
        <Text className="text-xl font-bold text-foreground mb-2">
          {t.signIn} Required
        </Text>
        <Text className="text-muted-foreground text-center mb-6">
          Please sign in to view your appointments
        </Text>
        <Button onPress={() => router.push("/(auth)/login")}>
          {t.signIn}
        </Button>
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner className="flex-1" />;
  }

  const renderAppointmentCard = (appointment: Appointment) => {
    const appointmentDate = new Date(appointment.appointment_date);
    const dateStr = formatDate(appointmentDate);
    const timeStr = formatTime(
      appointmentDate.toTimeString().substring(0, 5)
    );
    const isUpcoming =
      appointmentDate >= new Date() &&
      appointment.status !== "cancelled" &&
      appointment.status !== "completed";

    return (
      <Pressable
        key={appointment.id}
        onPress={() => router.push(`/(main)/appointments/${appointment.id}`)}
      >
        <Card className="mb-3">
          <CardContent className="p-0">
            <View className="flex flex-row">
              {/* Date Column */}
              <View className="w-20 bg-primary/10 rounded-l-xl items-center justify-center p-3">
                <Text className="text-primary text-sm font-medium">
                  {appointmentDate.toLocaleDateString("en-US", {
                    month: "short",
                  })}
                </Text>
                <Text className="text-primary text-2xl font-bold">
                  {appointmentDate.getDate()}
                </Text>
                <Text className="text-primary text-sm">{timeStr}</Text>
              </View>

              {/* Details Column */}
              <View className="flex-1 p-3">
                <View className="flex flex-row items-start justify-between mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">
                      Dr. {appointment.dentist?.profiles?.first_name}{" "}
                      {appointment.dentist?.profiles?.last_name}
                    </Text>
                    {appointment.dentist?.specialization && (
                      <Text className="text-sm text-muted-foreground">
                        {appointment.dentist.specialization}
                      </Text>
                    )}
                  </View>
                  <Badge
                    variant={
                      appointment.status === "confirmed"
                        ? "success"
                        : appointment.status === "cancelled"
                        ? "destructive"
                        : "warning"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </View>

                {appointment.reason && (
                  <Text className="text-sm text-muted-foreground mb-2">
                    {appointment.reason}
                  </Text>
                )}

                {appointment.patient_name && (
                  <View className="flex flex-row items-center">
                    <Ionicons name="person" size={14} color="#6b7280" />
                    <Text className="text-sm text-muted-foreground ml-1">
                      For: {appointment.patient_name}
                    </Text>
                  </View>
                )}

                {/* Actions */}
                {isUpcoming && (
                  <View className="flex flex-row gap-2 mt-3 pt-3 border-t border-border">
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appointment);
                        setCancelDialogOpen(true);
                      }}
                      className="flex flex-row items-center"
                    >
                      <Ionicons
                        name="close-circle"
                        size={16}
                        color="#ef4444"
                      />
                      <Text className="text-destructive text-sm ml-1">
                        {t.cancelAppointment}
                      </Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </CardContent>
        </Card>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Book New Button */}
        <Button
          onPress={() => router.push("/(main)/book")}
          leftIcon={<Ionicons name="add" size={20} color="#ffffff" />}
          className="mb-6"
        >
          {t.bookAppointment}
        </Button>

        {/* Upcoming Appointments */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            {t.upcomingAppointments}
          </Text>
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="items-center py-8">
                <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
                <Text className="text-muted-foreground mt-3">
                  {t.noUpcomingAppointments}
                </Text>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map(renderAppointmentCard)
          )}
        </View>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <View>
            <Text className="text-lg font-bold text-foreground mb-3">
              {t.pastAppointments}
            </Text>
            {pastAppointments.map(renderAppointmentCard)}
          </View>
        )}
      </ScrollView>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        visible={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        title={t.confirmCancellation}
        description={t.confirmCancellationMessage}
        confirmText={t.yesCancelAppointment}
        cancelText={t.keepAppointment}
        onConfirm={handleCancelAppointment}
        destructive
      />
    </View>
  );
}
