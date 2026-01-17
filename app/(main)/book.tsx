import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { format, addDays, parseISO, isAfter, startOfDay } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import {
  Button,
  Card,
  CardContent,
  Input,
  Badge,
  Avatar,
  LoadingSpinner,
} from "@/components/ui";
import { cn } from "@/lib/utils";

interface Dentist {
  id: string;
  specialization: string | null;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface Slot {
  id: string;
  slot_time: string;
  is_available: boolean;
  emergency_only: boolean;
}

const REASONS = [
  { id: "general", label: "General Consultation", icon: "chatbubble" as const },
  { id: "checkup", label: "Routine Checkup", icon: "checkmark-circle" as const },
  { id: "pain", label: "Dental Pain", icon: "medical" as const },
  { id: "cleaning", label: "Cleaning", icon: "sparkles" as const },
  { id: "emergency", label: "Emergency", icon: "warning" as const },
  { id: "other", label: "Other", icon: "ellipsis-horizontal" as const },
];

export default function BookScreen() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const params = useLocalSearchParams<{ dentistId?: string }>();

  // Form state
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [selectedDentist, setSelectedDentist] = useState<string | null>(
    params.dentistId || null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isForUser, setIsForUser] = useState(true);

  // Data state
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Generate next 14 days
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login");
      return;
    }
    fetchDentists();
  }, [user]);

  useEffect(() => {
    if (selectedDentist && selectedDate) {
      fetchSlots();
    }
  }, [selectedDentist, selectedDate]);

  const fetchDentists = async () => {
    try {
      const { data, error } = await supabase
        .from("dentists")
        .select(
          `
          id,
          specialization,
          profiles (
            first_name,
            last_name
          )
        `
        )
        .eq("is_active", true);

      if (error) throw error;
      setDentists(data as unknown as Dentist[]);
    } catch (error) {
      console.error("Error fetching dentists:", error);
      toast({
        title: t.error,
        description: t.cannotLoadDentists,
        type: "error",
      });
    }
  };

  const fetchSlots = async () => {
    if (!selectedDentist || !selectedDate) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");

      // Generate slots for the date
      await supabase.rpc("generate_daily_slots", {
        p_dentist_id: selectedDentist,
        p_date: dateStr,
      });

      // Fetch available slots
      const { data, error } = await supabase
        .from("appointment_slots")
        .select("id, slot_time, is_available, emergency_only")
        .eq("dentist_id", selectedDentist)
        .eq("slot_date", dateStr)
        .eq("is_available", true)
        .order("slot_time", { ascending: true });

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      toast({
        title: t.error,
        description: t.cannotLoadSlots,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async () => {
    if (
      !selectedDentist ||
      !selectedDate ||
      !selectedSlot ||
      !selectedReason ||
      !profile
    ) {
      toast({
        title: t.missingInformation,
        description: t.selectDentistDateTime,
        type: "error",
      });
      return;
    }

    setBookingLoading(true);
    try {
      const appointmentDate = `${format(selectedDate, "yyyy-MM-dd")}T${
        selectedSlot.slot_time
      }`;

      // Create appointment
      const { data: appointmentData, error: appointmentError } = await supabase
        .from("appointments")
        .insert({
          patient_id: profile.id,
          dentist_id: selectedDentist,
          appointment_date: appointmentDate,
          reason: REASONS.find((r) => r.id === selectedReason)?.label || selectedReason,
          status: "pending",
          notes: notes || null,
          patient_name: isForUser
            ? `${profile.first_name} ${profile.last_name}`
            : patientName,
          is_for_user: isForUser,
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Book the slot
      const { error: slotError } = await supabase.rpc("book_appointment_slot", {
        p_dentist_id: selectedDentist,
        p_slot_date: format(selectedDate, "yyyy-MM-dd"),
        p_slot_time: selectedSlot.slot_time,
        p_appointment_id: appointmentData.id,
      });

      if (slotError) {
        // Rollback appointment
        await supabase
          .from("appointments")
          .delete()
          .eq("id", appointmentData.id);
        throw slotError;
      }

      toast({
        title: t.success,
        description: t.appointmentConfirmed,
        type: "success",
      });

      router.replace("/(main)/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: t.error,
        description: t.cannotCreateAppointment,
        type: "error",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              {t.consultationReason}
            </Text>
            <View className="flex flex-row flex-wrap gap-3">
              {REASONS.map((reason) => (
                <Pressable
                  key={reason.id}
                  onPress={() => setSelectedReason(reason.id)}
                  className={cn(
                    "flex flex-row items-center px-4 py-3 rounded-xl border-2",
                    selectedReason === reason.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  <Ionicons
                    name={reason.icon}
                    size={20}
                    color={selectedReason === reason.id ? "#0891b2" : "#6b7280"}
                  />
                  <Text
                    className={cn(
                      "ml-2 font-medium",
                      selectedReason === reason.id
                        ? "text-primary"
                        : "text-foreground"
                    )}
                  >
                    {reason.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              {t.chooseDentist}
            </Text>
            {dentists.map((dentist) => (
              <Pressable
                key={dentist.id}
                onPress={() => setSelectedDentist(dentist.id)}
              >
                <Card
                  className={cn(
                    "border-2",
                    selectedDentist === dentist.id
                      ? "border-primary"
                      : "border-transparent"
                  )}
                >
                  <CardContent className="p-4 flex flex-row items-center">
                    <Avatar
                      name={`${dentist.profiles.first_name} ${dentist.profiles.last_name}`}
                      size="md"
                      className="mr-3"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-foreground">
                        Dr. {dentist.profiles.first_name}{" "}
                        {dentist.profiles.last_name}
                      </Text>
                      {dentist.specialization && (
                        <Text className="text-sm text-muted-foreground">
                          {dentist.specialization}
                        </Text>
                      )}
                    </View>
                    {selectedDentist === dentist.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#0891b2"
                      />
                    )}
                  </CardContent>
                </Card>
              </Pressable>
            ))}
          </View>
        );

      case 3:
        return (
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              {t.selectDate}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-4 px-4"
            >
              <View className="flex flex-row gap-2">
                {dates.map((date) => {
                  const isSelected =
                    selectedDate &&
                    format(date, "yyyy-MM-dd") ===
                      format(selectedDate, "yyyy-MM-dd");
                  return (
                    <Pressable
                      key={date.toISOString()}
                      onPress={() => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                      className={cn(
                        "w-16 py-3 rounded-xl items-center border-2",
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border bg-card"
                      )}
                    >
                      <Text
                        className={cn(
                          "text-xs font-medium",
                          isSelected ? "text-white" : "text-muted-foreground"
                        )}
                      >
                        {format(date, "EEE")}
                      </Text>
                      <Text
                        className={cn(
                          "text-xl font-bold mt-1",
                          isSelected ? "text-white" : "text-foreground"
                        )}
                      >
                        {format(date, "d")}
                      </Text>
                      <Text
                        className={cn(
                          "text-xs",
                          isSelected ? "text-white/80" : "text-muted-foreground"
                        )}
                      >
                        {format(date, "MMM")}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Time Slots */}
            {selectedDate && (
              <View className="mt-4">
                <Text className="text-lg font-bold text-foreground mb-3">
                  {t.selectTime}
                </Text>
                {loading ? (
                  <LoadingSpinner />
                ) : slots.length === 0 ? (
                  <Card>
                    <CardContent className="items-center py-8">
                      <Ionicons name="time" size={32} color="#9ca3af" />
                      <Text className="text-muted-foreground mt-2">
                        No available slots for this date
                      </Text>
                    </CardContent>
                  </Card>
                ) : (
                  <View className="flex flex-row flex-wrap gap-2">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const time = slot.slot_time.substring(0, 5);
                      const hours = parseInt(time.split(":")[0]);
                      const ampm = hours >= 12 ? "PM" : "AM";
                      const displayHour = hours % 12 || 12;
                      const displayTime = `${displayHour}:${time.split(":")[1]} ${ampm}`;

                      return (
                        <Pressable
                          key={slot.id}
                          onPress={() => setSelectedSlot(slot)}
                          className={cn(
                            "px-4 py-2.5 rounded-lg border-2",
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border bg-card"
                          )}
                        >
                          <Text
                            className={cn(
                              "font-medium",
                              isSelected ? "text-white" : "text-foreground"
                            )}
                          >
                            {displayTime}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            )}
          </View>
        );

      case 4:
        return (
          <View className="gap-4">
            <Text className="text-lg font-bold text-foreground">
              Patient Information
            </Text>

            {/* For User or Family Member */}
            <View className="flex flex-row gap-3">
              <Pressable
                onPress={() => setIsForUser(true)}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 items-center",
                  isForUser
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <Ionicons
                  name="person"
                  size={20}
                  color={isForUser ? "#0891b2" : "#6b7280"}
                />
                <Text
                  className={cn(
                    "mt-1 font-medium",
                    isForUser ? "text-primary" : "text-foreground"
                  )}
                >
                  For Myself
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setIsForUser(false)}
                className={cn(
                  "flex-1 py-3 rounded-xl border-2 items-center",
                  !isForUser
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <Ionicons
                  name="people"
                  size={20}
                  color={!isForUser ? "#0891b2" : "#6b7280"}
                />
                <Text
                  className={cn(
                    "mt-1 font-medium",
                    !isForUser ? "text-primary" : "text-foreground"
                  )}
                >
                  For Family
                </Text>
              </Pressable>
            </View>

            {!isForUser && (
              <Input
                label="Patient Name"
                placeholder="Enter patient name"
                value={patientName}
                onChangeText={setPatientName}
              />
            )}

            <Input
              label="Additional Notes (Optional)"
              placeholder="Any specific concerns or information..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              className="h-24"
            />

            {/* Summary */}
            <Card className="bg-muted/50 mt-4">
              <CardContent className="p-4">
                <Text className="font-bold text-foreground mb-3">
                  Booking Summary
                </Text>
                <View className="gap-2">
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Reason:</Text>
                    <Text className="font-medium text-foreground">
                      {REASONS.find((r) => r.id === selectedReason)?.label}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Dentist:</Text>
                    <Text className="font-medium text-foreground">
                      Dr.{" "}
                      {
                        dentists.find((d) => d.id === selectedDentist)?.profiles
                          .first_name
                      }{" "}
                      {
                        dentists.find((d) => d.id === selectedDentist)?.profiles
                          .last_name
                      }
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Date:</Text>
                    <Text className="font-medium text-foreground">
                      {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Time:</Text>
                    <Text className="font-medium text-foreground">
                      {selectedSlot?.slot_time.substring(0, 5)}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Patient:</Text>
                    <Text className="font-medium text-foreground">
                      {isForUser
                        ? `${profile?.first_name} ${profile?.last_name}`
                        : patientName}
                    </Text>
                  </View>
                </View>
              </CardContent>
            </Card>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!selectedReason;
      case 2:
        return !!selectedDentist;
      case 3:
        return !!selectedDate && !!selectedSlot;
      case 4:
        return isForUser || !!patientName.trim();
      default:
        return false;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
    >
      {/* Header */}
      <View className="flex flex-row items-center px-4 py-3 border-b border-border bg-card">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#0891b2" />
        </Pressable>
        <Text className="text-lg font-bold text-foreground flex-1">
          {t.bookAppointment}
        </Text>
        <Text className="text-muted-foreground">Step {step}/4</Text>
      </View>

      {/* Progress Bar */}
      <View className="h-1 bg-muted">
        <View
          className="h-full bg-primary"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {renderStep()}
      </ScrollView>

      {/* Footer */}
      <View className="px-4 py-4 border-t border-border bg-card">
        <View className="flex flex-row gap-3">
          {step > 1 && (
            <Button
              variant="outline"
              onPress={() => setStep(step - 1)}
              className="flex-1"
            >
              {t.back}
            </Button>
          )}
          {step < 4 ? (
            <Button
              onPress={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1"
            >
              {t.next}
            </Button>
          ) : (
            <Button
              onPress={handleBook}
              loading={bookingLoading}
              disabled={!canProceed()}
              className="flex-1"
            >
              {t.bookNow}
            </Button>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
