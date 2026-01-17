import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, Button, Badge, Avatar } from "@/components/ui";
import { cn } from "@/lib/utils";

// ============================================
// Privacy Consent Widget
// ============================================
interface PrivacyConsentWidgetProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function PrivacyConsentWidget({
  onAccept,
  onDecline,
}: PrivacyConsentWidgetProps) {
  const { t } = useLanguage();

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-3">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="shield-checkmark" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Welcome to First Smile AI
          </Text>
          <Text className="text-sm text-muted-foreground">
            Your digital dental assistant
          </Text>
        </View>

        <View className="bg-muted/30 rounded-lg p-3 mb-4">
          <Text className="text-sm text-foreground leading-5">
            <Text className="font-bold">Privacy & Data Policy:</Text> We collect
            your name, contact details, and appointment information to manage
            your bookings and assist your dentist. You can withdraw consent at
            any time.
          </Text>
        </View>

        <View className="flex flex-row gap-2">
          <Pressable
            onPress={onDecline}
            className="flex-1 border border-border rounded-lg py-3 items-center"
          >
            <Text className="text-foreground font-medium">I Do Not Accept</Text>
          </Pressable>
          <Pressable
            onPress={onAccept}
            className="flex-1 bg-primary rounded-lg py-3 items-center"
          >
            <Text className="text-white font-medium">I Accept</Text>
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Appointment Reason Widget
// ============================================
interface AppointmentReasonWidgetProps {
  onSelect: (reason: string, label: string) => void;
}

export function AppointmentReasonWidget({
  onSelect,
}: AppointmentReasonWidgetProps) {
  const reasons = [
    { id: "routine", label: "Routine check-up", icon: "🦷" },
    { id: "braces", label: "Braces tightening", icon: "🔧" },
    { id: "emergency", label: "Pain/Emergency", icon: "🚨" },
    { id: "cleaning", label: "Cleaning", icon: "✨" },
  ];

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="calendar" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            What brings you here today?
          </Text>
        </View>

        <View className="gap-2">
          {reasons.map((reason) => (
            <Pressable
              key={reason.id}
              onPress={() => onSelect(reason.id, reason.label)}
              className="flex flex-row items-center border border-border rounded-lg p-4 active:bg-muted"
            >
              <Text className="text-2xl mr-3">{reason.icon}</Text>
              <Text className="text-foreground font-medium flex-1">
                {reason.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </Pressable>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Dentist Selection Widget
// ============================================
interface Dentist {
  id: string;
  specialization: string | null;
  profiles: {
    first_name: string;
    last_name: string;
    email?: string;
  };
}

interface DentistSelectionWidgetProps {
  dentists: Dentist[];
  onSelect: (dentist: Dentist) => void;
  loading?: boolean;
}

export function DentistSelectionWidget({
  dentists,
  onSelect,
  loading = false,
}: DentistSelectionWidgetProps) {
  if (loading) {
    return (
      <Card className="mx-2 my-3 border-primary/20">
        <CardContent className="p-6 items-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="text-muted-foreground mt-2">Loading dentists...</Text>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="person" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Choose Your Dentist
          </Text>
        </View>

        <View className="gap-3">
          {dentists.map((dentist) => (
            <Card key={dentist.id} className="border-border">
              <CardContent className="p-3">
                <View className="flex flex-row items-center">
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
                    <Badge variant="success" className="self-start mt-1">
                      Available
                    </Badge>
                  </View>
                  <Pressable
                    onPress={() => onSelect(dentist)}
                    className="bg-primary px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-medium">Select</Text>
                  </Pressable>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Inline Calendar Widget
// ============================================
interface InlineCalendarWidgetProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  dentistName?: string;
}

export function InlineCalendarWidget({
  selectedDate,
  onDateSelect,
  dentistName,
}: InlineCalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || date.getDay() === 0 || date.getDay() === 6;
  };

  const isSameDay = (d1: Date, d2?: Date) => {
    if (!d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="calendar" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">Select Date</Text>
          {dentistName && (
            <Text className="text-sm text-muted-foreground">{dentistName}</Text>
          )}
        </View>

        {/* Month Navigation */}
        <View className="flex flex-row items-center justify-between mb-4">
          <Pressable
            onPress={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
              )
            }
            className="p-2"
          >
            <Ionicons name="chevron-back" size={24} color="#0891b2" />
          </Pressable>
          <Text className="font-semibold text-foreground">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Text>
          <Pressable
            onPress={() =>
              setCurrentMonth(
                new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
              )
            }
            className="p-2"
          >
            <Ionicons name="chevron-forward" size={24} color="#0891b2" />
          </Pressable>
        </View>

        {/* Day Names */}
        <View className="flex flex-row mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <View key={day} className="flex-1 items-center">
              <Text className="text-xs text-muted-foreground font-medium">
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex flex-row flex-wrap">
          {days.map((day, index) => (
            <View key={index} className="w-[14.28%] aspect-square p-0.5">
              {day ? (
                <Pressable
                  onPress={() => !isDateDisabled(day) && onDateSelect(day)}
                  disabled={isDateDisabled(day)}
                  className={cn(
                    "flex-1 items-center justify-center rounded-lg",
                    isSameDay(day, selectedDate) && "bg-primary",
                    isDateDisabled(day) && "opacity-30"
                  )}
                >
                  <Text
                    className={cn(
                      "text-sm",
                      isSameDay(day, selectedDate)
                        ? "text-white font-bold"
                        : "text-foreground"
                    )}
                  >
                    {day.getDate()}
                  </Text>
                </Pressable>
              ) : (
                <View className="flex-1" />
              )}
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Time Slots Widget
// ============================================
interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotsWidgetProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  loading?: boolean;
  selectedDate?: Date;
}

export function TimeSlotsWidget({
  slots,
  selectedTime,
  onTimeSelect,
  loading = false,
  selectedDate,
}: TimeSlotsWidgetProps) {
  const availableSlots = slots.filter((slot) => slot.available);

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="time" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Available Times
          </Text>
          {selectedDate && (
            <Text className="text-sm text-muted-foreground">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
          )}
        </View>

        {loading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#0891b2" />
            <Text className="text-sm text-muted-foreground mt-2">
              Loading times...
            </Text>
          </View>
        ) : availableSlots.length === 0 ? (
          <View className="py-8 items-center">
            <Ionicons name="calendar-outline" size={40} color="#9ca3af" />
            <Text className="text-muted-foreground mt-2">
              No available slots for this date
            </Text>
          </View>
        ) : (
          <View className="flex flex-row flex-wrap gap-2">
            {availableSlots.map((slot) => (
              <Pressable
                key={slot.time}
                onPress={() => onTimeSelect(slot.time)}
                className={cn(
                  "px-4 py-2 rounded-lg border",
                  selectedTime === slot.time
                    ? "bg-primary border-primary"
                    : "border-border"
                )}
              >
                <Text
                  className={cn(
                    "font-medium",
                    selectedTime === slot.time ? "text-white" : "text-foreground"
                  )}
                >
                  {slot.time}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// Appointment Confirmation Widget
// ============================================
interface AppointmentConfirmationWidgetProps {
  appointment: {
    dentist?: Dentist;
    date?: Date;
    time?: string;
    reason?: string;
    patientName?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function AppointmentConfirmationWidget({
  appointment,
  onConfirm,
  onCancel,
  loading = false,
}: AppointmentConfirmationWidgetProps) {
  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-green-500/10 items-center justify-center mb-2">
            <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Confirm Appointment
          </Text>
        </View>

        <View className="bg-muted/30 rounded-lg p-4 mb-4 gap-3">
          {appointment.dentist && (
            <View className="flex flex-row items-center">
              <Ionicons name="person" size={18} color="#6b7280" />
              <Text className="ml-2 text-foreground">
                Dr. {appointment.dentist.profiles.first_name}{" "}
                {appointment.dentist.profiles.last_name}
              </Text>
            </View>
          )}

          {appointment.date && (
            <View className="flex flex-row items-center">
              <Ionicons name="calendar" size={18} color="#6b7280" />
              <Text className="ml-2 text-foreground">
                {appointment.date.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
          )}

          {appointment.time && (
            <View className="flex flex-row items-center">
              <Ionicons name="time" size={18} color="#6b7280" />
              <Text className="ml-2 text-foreground">{appointment.time}</Text>
            </View>
          )}

          {appointment.reason && (
            <View className="flex flex-row items-center">
              <Ionicons name="heart" size={18} color="#6b7280" />
              <Text className="ml-2 text-foreground">{appointment.reason}</Text>
            </View>
          )}

          {appointment.patientName && (
            <View className="flex flex-row items-center">
              <Ionicons name="people" size={18} color="#6b7280" />
              <Text className="ml-2 text-foreground">
                For: {appointment.patientName}
              </Text>
            </View>
          )}
        </View>

        <View className="flex flex-row gap-2">
          <Pressable
            onPress={onCancel}
            disabled={loading}
            className="flex-1 border border-border rounded-lg py-3 items-center"
          >
            <Text className="text-foreground font-medium">Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            disabled={loading}
            className={cn(
              "flex-1 bg-primary rounded-lg py-3 items-center flex flex-row justify-center",
              loading && "opacity-70"
            )}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-medium">Confirm</Text>
            )}
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Urgency Slider Widget
// ============================================
interface UrgencySliderWidgetProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm: (urgency: string) => void;
}

export function UrgencySliderWidget({
  value,
  onChange,
  onConfirm,
}: UrgencySliderWidgetProps) {
  const urgencyLevels = [
    { label: "Low", color: "#22c55e", icon: "checkmark-circle" as const },
    { label: "Medium", color: "#eab308", icon: "alert-circle" as const },
    { label: "High", color: "#f97316", icon: "warning" as const },
    { label: "Emergency", color: "#ef4444", icon: "alert" as const },
  ];

  const current = urgencyLevels[value];

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-orange-500/10 items-center justify-center mb-2">
            <Ionicons name="alert-circle" size={24} color="#f97316" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            How urgent is this?
          </Text>
        </View>

        {/* Urgency Buttons */}
        <View className="flex flex-row gap-2 mb-4">
          {urgencyLevels.map((level, index) => (
            <Pressable
              key={level.label}
              onPress={() => onChange(index)}
              className={cn(
                "flex-1 py-3 rounded-lg items-center border",
                value === index
                  ? "border-2"
                  : "border-border"
              )}
              style={{
                borderColor: value === index ? level.color : undefined,
                backgroundColor: value === index ? `${level.color}10` : undefined,
              }}
            >
              <Ionicons
                name={level.icon}
                size={20}
                color={value === index ? level.color : "#6b7280"}
              />
              <Text
                className={cn(
                  "text-xs mt-1 font-medium",
                  value === index ? "" : "text-muted-foreground"
                )}
                style={{ color: value === index ? level.color : undefined }}
              >
                {level.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => onConfirm(current.label.toLowerCase())}
          className="bg-primary rounded-lg py-3 items-center"
        >
          <Text className="text-white font-medium">
            Continue with {current.label} urgency
          </Text>
        </Pressable>
      </CardContent>
    </Card>
  );
}

// ============================================
// Quick Actions Widget
// ============================================
interface QuickActionsWidgetProps {
  onAction: (action: string) => void;
}

export function QuickActionsWidget({ onAction }: QuickActionsWidgetProps) {
  const actions = [
    { id: "appointments", label: "Show my appointments", icon: "calendar" as const },
    { id: "earliest", label: "Find earliest slot", icon: "time" as const },
    { id: "emergency", label: "Emergency booking", icon: "alert" as const },
    { id: "help", label: "Help & FAQ", icon: "help-circle" as const },
  ];

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="information-circle" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Quick Actions
          </Text>
        </View>

        <View className="gap-2">
          {actions.map((action) => (
            <Pressable
              key={action.id}
              onPress={() => onAction(action.id)}
              className="flex flex-row items-center border border-border rounded-lg p-3 active:bg-muted"
            >
              <Ionicons name={action.icon} size={20} color="#0891b2" />
              <Text className="ml-3 text-foreground font-medium flex-1">
                {action.label}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </Pressable>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}

// ============================================
// Quick Settings Widget
// ============================================
interface QuickSettingsWidgetProps {
  currentLanguage: string;
  currentTheme: string;
  onLanguageChange: (lang: string) => void;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
}

export function QuickSettingsWidget({
  currentLanguage,
  currentTheme,
  onLanguageChange,
  onThemeChange,
  onClose,
}: QuickSettingsWidgetProps) {
  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  ];

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="globe" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Quick Settings
          </Text>
        </View>

        {/* Language Selection */}
        <Text className="text-sm font-medium text-foreground mb-2">
          Language
        </Text>
        <View className="flex flex-row gap-2 mb-4">
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => onLanguageChange(lang.code)}
              className={cn(
                "flex-1 py-2 rounded-lg items-center border",
                currentLanguage === lang.code
                  ? "bg-primary border-primary"
                  : "border-border"
              )}
            >
              <Text className="text-lg">{lang.flag}</Text>
              <Text
                className={cn(
                  "text-xs mt-1",
                  currentLanguage === lang.code
                    ? "text-white font-medium"
                    : "text-foreground"
                )}
              >
                {lang.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Theme Selection */}
        <Text className="text-sm font-medium text-foreground mb-2">Theme</Text>
        <View className="flex flex-row gap-2 mb-4">
          <Pressable
            onPress={() => onThemeChange("light")}
            className={cn(
              "flex-1 py-3 rounded-lg items-center border flex flex-row justify-center",
              currentTheme === "light"
                ? "bg-primary border-primary"
                : "border-border"
            )}
          >
            <Ionicons
              name="sunny"
              size={20}
              color={currentTheme === "light" ? "#ffffff" : "#0891b2"}
            />
            <Text
              className={cn(
                "ml-2 font-medium",
                currentTheme === "light" ? "text-white" : "text-foreground"
              )}
            >
              Light
            </Text>
          </Pressable>
          <Pressable
            onPress={() => onThemeChange("dark")}
            className={cn(
              "flex-1 py-3 rounded-lg items-center border flex flex-row justify-center",
              currentTheme === "dark"
                ? "bg-primary border-primary"
                : "border-border"
            )}
          >
            <Ionicons
              name="moon"
              size={20}
              color={currentTheme === "dark" ? "#ffffff" : "#0891b2"}
            />
            <Text
              className={cn(
                "ml-2 font-medium",
                currentTheme === "dark" ? "text-white" : "text-foreground"
              )}
            >
              Dark
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={onClose}
          className="bg-muted rounded-lg py-3 items-center"
        >
          <Text className="text-foreground font-medium">Done</Text>
        </Pressable>
      </CardContent>
    </Card>
  );
}

// ============================================
// Image Upload Widget
// ============================================
interface ImageUploadWidgetProps {
  onTakePhoto: () => void;
  onSelectFromGallery: () => void;
  onCancel: () => void;
}

export function ImageUploadWidget({
  onTakePhoto,
  onSelectFromGallery,
  onCancel,
}: ImageUploadWidgetProps) {
  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="camera" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">Upload Image</Text>
          <Text className="text-sm text-muted-foreground">
            Share a photo or X-ray
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={onTakePhoto}
            className="flex flex-row items-center border border-border rounded-lg p-4 active:bg-muted"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <Ionicons name="camera" size={20} color="#0891b2" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-medium text-foreground">Take Photo</Text>
              <Text className="text-sm text-muted-foreground">
                Use your camera
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </Pressable>

          <Pressable
            onPress={onSelectFromGallery}
            className="flex flex-row items-center border border-border rounded-lg p-4 active:bg-muted"
          >
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
              <Ionicons name="images" size={20} color="#0891b2" />
            </View>
            <View className="ml-3 flex-1">
              <Text className="font-medium text-foreground">
                Choose from Gallery
              </Text>
              <Text className="text-sm text-muted-foreground">
                Select existing photo
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </Pressable>
        </View>

        <Pressable
          onPress={onCancel}
          className="mt-4 border border-border rounded-lg py-3 items-center"
        >
          <Text className="text-foreground font-medium">Cancel</Text>
        </Pressable>
      </CardContent>
    </Card>
  );
}

// ============================================
// Personal Info Form Widget
// ============================================
interface PersonalInfoFormWidgetProps {
  initialData: {
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
    emergency_contact: string;
    medical_history: string;
  };
  onSave: (data: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function PersonalInfoFormWidget({
  initialData,
  onSave,
  onCancel,
  loading = false,
}: PersonalInfoFormWidgetProps) {
  const [formData, setFormData] = useState(initialData);
  const { t } = useLanguage();

  return (
    <Card className="mx-2 my-3 border-primary/20">
      <CardContent className="p-4">
        <View className="items-center mb-4">
          <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
            <Ionicons name="create" size={24} color="#0891b2" />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Update Personal Information
          </Text>
        </View>

        <View className="gap-3">
          <View className="flex flex-row gap-2">
            <View className="flex-1">
              <Text className="text-sm text-muted-foreground mb-1">
                {t.firstName}
              </Text>
              <TextInput
                value={formData.first_name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, first_name: text }))
                }
                className="border border-border rounded-lg px-3 py-2 text-foreground"
                placeholderTextColor="#9ca3af"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-muted-foreground mb-1">
                {t.lastName}
              </Text>
              <TextInput
                value={formData.last_name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, last_name: text }))
                }
                className="border border-border rounded-lg px-3 py-2 text-foreground"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View>
            <Text className="text-sm text-muted-foreground mb-1">
              {t.phoneNumber}
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, phone: text }))
              }
              className="border border-border rounded-lg px-3 py-2 text-foreground"
              keyboardType="phone-pad"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm text-muted-foreground mb-1">
              {t.address}
            </Text>
            <TextInput
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              className="border border-border rounded-lg px-3 py-2 text-foreground"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm text-muted-foreground mb-1">
              {t.emergencyContact}
            </Text>
            <TextInput
              value={formData.emergency_contact}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, emergency_contact: text }))
              }
              className="border border-border rounded-lg px-3 py-2 text-foreground"
              placeholder="Name and phone number"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View>
            <Text className="text-sm text-muted-foreground mb-1">
              {t.medicalHistory}
            </Text>
            <TextInput
              value={formData.medical_history}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, medical_history: text }))
              }
              className="border border-border rounded-lg px-3 py-3 text-foreground min-h-[80px]"
              multiline
              numberOfLines={3}
              placeholder="Allergies, medications, conditions..."
              placeholderTextColor="#9ca3af"
              textAlignVertical="top"
            />
          </View>
        </View>

        <View className="flex flex-row gap-2 mt-4">
          <Pressable
            onPress={onCancel}
            disabled={loading}
            className="flex-1 border border-border rounded-lg py-3 items-center"
          >
            <Text className="text-foreground font-medium">{t.cancel}</Text>
          </Pressable>
          <Pressable
            onPress={() => onSave(formData)}
            disabled={loading}
            className={cn(
              "flex-1 bg-primary rounded-lg py-3 items-center",
              loading && "opacity-70"
            )}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text className="text-white font-medium">{t.save}</Text>
            )}
          </Pressable>
        </View>
      </CardContent>
    </Card>
  );
}
