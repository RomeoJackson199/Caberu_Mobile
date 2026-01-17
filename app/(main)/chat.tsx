import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { supabase, fetchDentists, createAppointment } from "@/lib/supabase";
import { cn, generateSessionId } from "@/lib/utils";
import {
  PrivacyConsentWidget,
  AppointmentReasonWidget,
  DentistSelectionWidget,
  InlineCalendarWidget,
  TimeSlotsWidget,
  AppointmentConfirmationWidget,
  UrgencySliderWidget,
  QuickActionsWidget,
  QuickSettingsWidget,
  ImageUploadWidget,
  PersonalInfoFormWidget,
} from "@/components/chat/ChatWidgets";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  widget?: string;
}

interface BookingFlow {
  reason?: string;
  reasonLabel?: string;
  dentist?: any;
  date?: Date;
  time?: string;
  urgency?: string;
  patientName?: string;
}

type WidgetType =
  | "privacy_consent"
  | "appointment_reason"
  | "dentist_selection"
  | "calendar"
  | "time_slots"
  | "urgency"
  | "confirmation"
  | "quick_actions"
  | "quick_settings"
  | "image_upload"
  | "personal_info"
  | null;

export default function ChatScreen() {
  const { user, profile, refreshProfile } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const { toast } = useToast();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const [activeWidget, setActiveWidget] = useState<WidgetType>(null);
  const [bookingFlow, setBookingFlow] = useState<BookingFlow>({});
  const [dentists, setDentists] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<{ time: string; available: boolean }[]>([]);
  const [loadingDentists, setLoadingDentists] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [urgencyValue, setUrgencyValue] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(true); // Default to true for returning users

  useEffect(() => {
    // Send welcome message
    const welcomeName = profile?.first_name ? ` ${profile.first_name}` : "";
    const welcomeMessage: Message = {
      id: "welcome",
      content: `Welcome${welcomeName} to First Smile AI! 🦷✨

I'm your AI dental assistant, available 24/7 to help you with:

🤖 **AI Chat** - Get instant answers to your dental questions
📅 **Smart Booking** - Book appointments intelligently
📸 **Photo Analysis** - Upload photos for AI-powered dental analysis
👨‍👩‍👧‍👦 **Family Care** - Book for yourself or family members

💡 **Pro Tip**: Just tell me what's bothering you, and I'll guide you through everything!

How can I help you today?`,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [profile?.first_name]);

  const addBotMessage = (content: string, widget?: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: true,
      timestamp: new Date(),
      widget,
    };
    setMessages((prev) => [...prev, botMessage]);
    scrollToBottom();
  };

  const addUserMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setInputText("");
    setIsTyping(true);
    setActiveWidget(null);

    // Check for booking intent
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("book") ||
      lowerText.includes("appointment") ||
      lowerText.includes("schedule")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(
          "I'd be happy to help you book an appointment! Let's start by understanding what brings you in today."
        );
        setActiveWidget("appointment_reason");
      }, 800);
      return;
    }

    // Check for pain/emergency
    if (
      lowerText.includes("pain") ||
      lowerText.includes("hurt") ||
      lowerText.includes("emergency")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(
          "I'm sorry to hear you're in pain. Let me help you get an appointment as soon as possible. How urgent is your situation?"
        );
        setBookingFlow({ reason: "emergency", reasonLabel: "Pain/Emergency" });
        setActiveWidget("urgency");
      }, 800);
      return;
    }

    // Check for settings
    if (
      lowerText.includes("settings") ||
      lowerText.includes("language") ||
      lowerText.includes("theme")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Here are your quick settings:");
        setActiveWidget("quick_settings");
      }, 500);
      return;
    }

    // Check for profile/personal info
    if (
      lowerText.includes("profile") ||
      lowerText.includes("personal") ||
      lowerText.includes("update my info")
    ) {
      if (!user) {
        setTimeout(() => {
          setIsTyping(false);
          addBotMessage(
            "You need to sign in to update your personal information. Would you like to sign in?"
          );
        }, 500);
        return;
      }
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage("Let me help you update your personal information:");
        setActiveWidget("personal_info");
      }, 500);
      return;
    }

    // Check for appointments list
    if (
      lowerText.includes("my appointment") ||
      lowerText.includes("show appointment")
    ) {
      setTimeout(() => {
        setIsTyping(false);
        if (!user) {
          addBotMessage(
            "You need to sign in to view your appointments. Would you like to sign in?"
          );
        } else {
          addBotMessage(
            "Let me show you your appointments. Tap below to view them:"
          );
        }
      }, 500);
      return;
    }

    // Default: Call AI chat
    try {
      const { data, error } = await supabase.functions.invoke("dental-ai-chat", {
        body: {
          message: text,
          sessionId,
          userId: user?.id,
          language,
          userProfile: profile,
        },
      });

      if (error) throw error;

      setIsTyping(false);
      addBotMessage(
        data?.response ||
          "I apologize, I couldn't process your request. Please try again."
      );

      // Check if AI response suggests booking
      if (data?.suggestBooking) {
        setActiveWidget("appointment_reason");
      }
    } catch (error) {
      console.error("Chat error:", error);
      setIsTyping(false);
      addBotMessage(
        "I'm having trouble connecting right now. You can still book an appointment using the quick actions below, or try again in a moment."
      );
      setActiveWidget("quick_actions");
    }
  };

  // ============================================
  // Widget Handlers
  // ============================================

  const handlePrivacyAccept = () => {
    setHasAcceptedPrivacy(true);
    setActiveWidget(null);
    addBotMessage(
      "Thank you for accepting our privacy policy. How can I help you today?"
    );
  };

  const handlePrivacyDecline = () => {
    setActiveWidget(null);
    addBotMessage(
      "I understand. You can still browse our dentist profiles, but you'll need to accept the privacy policy to book appointments."
    );
  };

  const handleReasonSelect = async (reason: string, label: string) => {
    setBookingFlow({ reason, reasonLabel: label });
    addUserMessage(`I need: ${label}`);
    setActiveWidget(null);

    // Load dentists
    setLoadingDentists(true);
    addBotMessage("Great choice! Let me find available dentists for you...");

    try {
      const { data, error } = await fetchDentists();
      if (error) throw error;
      setDentists(data || []);
      setLoadingDentists(false);
      addBotMessage("Here are our available dentists:");
      setActiveWidget("dentist_selection");
    } catch (error) {
      setLoadingDentists(false);
      addBotMessage(
        "Sorry, I couldn't load the dentist list. Please try again."
      );
    }
  };

  const handleDentistSelect = (dentist: any) => {
    setBookingFlow((prev) => ({ ...prev, dentist }));
    addUserMessage(
      `I'll see Dr. ${dentist.profiles.first_name} ${dentist.profiles.last_name}`
    );
    setActiveWidget(null);
    addBotMessage(
      `Excellent choice! Dr. ${dentist.profiles.first_name} ${dentist.profiles.last_name} is one of our best. Now, let's pick a date:`
    );
    setActiveWidget("calendar");
  };

  const handleDateSelect = async (date: Date) => {
    setBookingFlow((prev) => ({ ...prev, date }));
    setActiveWidget(null);
    addBotMessage(
      `You selected ${date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })}. Let me check available times...`
    );

    // Load time slots
    setLoadingSlots(true);

    // Simulate loading slots (in real app, call API)
    setTimeout(() => {
      const slots = [
        { time: "09:00", available: true },
        { time: "09:30", available: true },
        { time: "10:00", available: false },
        { time: "10:30", available: true },
        { time: "11:00", available: true },
        { time: "11:30", available: false },
        { time: "14:00", available: true },
        { time: "14:30", available: true },
        { time: "15:00", available: true },
        { time: "15:30", available: false },
        { time: "16:00", available: true },
      ];
      setTimeSlots(slots);
      setLoadingSlots(false);
      setActiveWidget("time_slots");
    }, 1000);
  };

  const handleTimeSelect = (time: string) => {
    setBookingFlow((prev) => ({ ...prev, time }));
    addUserMessage(`I'll take the ${time} slot`);
    setActiveWidget(null);
    addBotMessage(
      "Perfect! Please review and confirm your appointment details:"
    );
    setActiveWidget("confirmation");
  };

  const handleUrgencyConfirm = async (urgency: string) => {
    setBookingFlow((prev) => ({ ...prev, urgency }));
    addUserMessage(`Urgency level: ${urgency}`);
    setActiveWidget(null);

    // Load dentists
    setLoadingDentists(true);
    addBotMessage(
      `I've noted that as ${urgency} priority. Let me find available dentists...`
    );

    try {
      const { data, error } = await fetchDentists();
      if (error) throw error;
      setDentists(data || []);
      setLoadingDentists(false);
      setActiveWidget("dentist_selection");
    } catch (error) {
      setLoadingDentists(false);
      addBotMessage(
        "Sorry, I couldn't load the dentist list. Please try again."
      );
    }
  };

  const handleConfirmBooking = async () => {
    if (!user || !profile) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your booking",
        type: "info",
      });
      router.push("/(auth)/login");
      return;
    }

    setBookingLoading(true);

    try {
      const appointmentDate = bookingFlow.date
        ? new Date(bookingFlow.date)
        : new Date();
      if (bookingFlow.time) {
        const [hours, minutes] = bookingFlow.time.split(":");
        appointmentDate.setHours(parseInt(hours), parseInt(minutes));
      }

      const { data, error } = await createAppointment({
        patient_id: profile.id,
        dentist_id: bookingFlow.dentist?.id,
        appointment_date: appointmentDate.toISOString(),
        reason: bookingFlow.reasonLabel,
        urgency: (bookingFlow.urgency as any) || "low",
        patient_name: `${profile.first_name} ${profile.last_name}`,
      });

      if (error) throw error;

      setActiveWidget(null);
      addBotMessage(
        `🎉 **Appointment Confirmed!**

Your appointment has been booked successfully:

📅 **Date**: ${bookingFlow.date?.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
⏰ **Time**: ${bookingFlow.time}
👨‍⚕️ **Dentist**: Dr. ${bookingFlow.dentist?.profiles?.first_name} ${bookingFlow.dentist?.profiles?.last_name}
🦷 **Reason**: ${bookingFlow.reasonLabel}

You'll receive a confirmation email shortly. Is there anything else I can help you with?`
      );

      // Reset booking flow
      setBookingFlow({});
      toast({
        title: t.success,
        description: t.appointmentConfirmed,
        type: "success",
      });
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: t.error,
        description: t.cannotCreateAppointment,
        type: "error",
      });
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = () => {
    setActiveWidget(null);
    setBookingFlow({});
    addBotMessage(
      "No problem! I've cancelled the booking. Let me know if you need anything else."
    );
  };

  const handleQuickAction = (action: string) => {
    setActiveWidget(null);
    switch (action) {
      case "appointments":
        if (!user) {
          addBotMessage(
            "You need to sign in to view your appointments. Would you like to sign in?"
          );
        } else {
          router.push("/(main)/appointments");
        }
        break;
      case "earliest":
        addBotMessage("Let me help you find the earliest available slot!");
        setActiveWidget("appointment_reason");
        break;
      case "emergency":
        addBotMessage(
          "I understand this is urgent. Let me help you get an emergency appointment."
        );
        setBookingFlow({ reason: "emergency", reasonLabel: "Emergency" });
        setActiveWidget("urgency");
        break;
      case "help":
        addBotMessage(
          `Here's what I can help you with:

• **Book an appointment** - Just say "book an appointment"
• **Check my appointments** - Say "show my appointments"
• **Dental questions** - Ask me anything about dental health
• **Emergency** - Say "emergency" for urgent care
• **Update profile** - Say "update my profile"
• **Change settings** - Say "settings"

What would you like to do?`
        );
        break;
    }
  };

  const handleLanguageChange = async (lang: string) => {
    await changeLanguage(lang as any);
    toast({
      title: t.languageUpdated,
      description: `${t.languageChangedTo} ${lang.toUpperCase()}`,
      type: "success",
    });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast({
      title: t.themeUpdated,
      description: `${t.switchedToMode} ${newTheme}`,
      type: "success",
    });
  };

  const handleImageUpload = async (type: "camera" | "gallery") => {
    setActiveWidget(null);

    let result;
    if (type === "camera") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        toast({
          title: t.error,
          description: "Camera permission is required",
          type: "error",
        });
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        toast({
          title: t.error,
          description: "Gallery permission is required",
          type: "error",
        });
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets[0]) {
      addBotMessage(
        "Thank you for sharing that image! I'm analyzing it now... (Note: AI image analysis is a premium feature in development)"
      );
    }
  };

  const handleSavePersonalInfo = async (data: any) => {
    if (!profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update(data)
        .eq("id", profile.id);

      if (error) throw error;

      await refreshProfile();
      setActiveWidget(null);
      addBotMessage(
        "Your personal information has been updated successfully! Is there anything else I can help you with?"
      );
      toast({
        title: t.success,
        description: t.personalInfoUpdated,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t.error,
        description: "Failed to update profile",
        type: "error",
      });
    }
  };

  // ============================================
  // Render
  // ============================================

  const renderMessage = (message: Message) => {
    const isBot = message.isBot;

    return (
      <View
        key={message.id}
        className={cn(
          "flex flex-row mb-3",
          isBot ? "justify-start" : "justify-end"
        )}
      >
        {/* Bot Avatar */}
        {isBot && (
          <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2 mt-1">
            <Text className="text-white text-sm">🦷</Text>
          </View>
        )}

        <View
          className={cn(
            "max-w-[80%] rounded-2xl px-4 py-3",
            isBot
              ? "bg-card border border-border rounded-tl-sm"
              : "bg-primary rounded-tr-sm"
          )}
        >
          <Text
            className={cn(
              "text-base leading-6",
              isBot ? "text-foreground" : "text-white"
            )}
          >
            {message.content}
          </Text>
        </View>

        {/* User Avatar */}
        {!isBot && (
          <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center ml-2 mt-1">
            <Ionicons name="person" size={16} color="#ffffff" />
          </View>
        )}
      </View>
    );
  };

  const renderActiveWidget = () => {
    switch (activeWidget) {
      case "privacy_consent":
        return (
          <PrivacyConsentWidget
            onAccept={handlePrivacyAccept}
            onDecline={handlePrivacyDecline}
          />
        );
      case "appointment_reason":
        return <AppointmentReasonWidget onSelect={handleReasonSelect} />;
      case "dentist_selection":
        return (
          <DentistSelectionWidget
            dentists={dentists}
            onSelect={handleDentistSelect}
            loading={loadingDentists}
          />
        );
      case "calendar":
        return (
          <InlineCalendarWidget
            selectedDate={bookingFlow.date}
            onDateSelect={handleDateSelect}
            dentistName={
              bookingFlow.dentist
                ? `Dr. ${bookingFlow.dentist.profiles.first_name} ${bookingFlow.dentist.profiles.last_name}`
                : undefined
            }
          />
        );
      case "time_slots":
        return (
          <TimeSlotsWidget
            slots={timeSlots}
            selectedTime={bookingFlow.time}
            onTimeSelect={handleTimeSelect}
            loading={loadingSlots}
            selectedDate={bookingFlow.date}
          />
        );
      case "urgency":
        return (
          <UrgencySliderWidget
            value={urgencyValue}
            onChange={setUrgencyValue}
            onConfirm={handleUrgencyConfirm}
          />
        );
      case "confirmation":
        return (
          <AppointmentConfirmationWidget
            appointment={{
              dentist: bookingFlow.dentist,
              date: bookingFlow.date,
              time: bookingFlow.time,
              reason: bookingFlow.reasonLabel,
            }}
            onConfirm={handleConfirmBooking}
            onCancel={handleCancelBooking}
            loading={bookingLoading}
          />
        );
      case "quick_actions":
        return <QuickActionsWidget onAction={handleQuickAction} />;
      case "quick_settings":
        return (
          <QuickSettingsWidget
            currentLanguage={language}
            currentTheme={theme}
            onLanguageChange={handleLanguageChange}
            onThemeChange={handleThemeChange}
            onClose={() => setActiveWidget(null)}
          />
        );
      case "image_upload":
        return (
          <ImageUploadWidget
            onTakePhoto={() => handleImageUpload("camera")}
            onSelectFromGallery={() => handleImageUpload("gallery")}
            onCancel={() => setActiveWidget(null)}
          />
        );
      case "personal_info":
        return (
          <PersonalInfoFormWidget
            initialData={{
              first_name: profile?.first_name || "",
              last_name: profile?.last_name || "",
              phone: profile?.phone || "",
              address: profile?.address || "",
              emergency_contact: profile?.emergency_contact || "",
              medical_history: profile?.medical_history || "",
            }}
            onSave={handleSavePersonalInfo}
            onCancel={() => setActiveWidget(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-background"
      keyboardVerticalOffset={90}
    >
      <View className="flex-1">
        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <View className="flex flex-row justify-start mb-3">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center mr-2">
                <Text className="text-white text-sm">🦷</Text>
              </View>
              <View className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <View className="flex flex-row items-center gap-1">
                  <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <View className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </View>
              </View>
            </View>
          )}

          {/* Active Widget */}
          {renderActiveWidget()}

          {/* Initial Quick Actions */}
          {messages.length <= 1 && !activeWidget && (
            <View className="mt-4">
              <Text className="text-muted-foreground text-sm mb-3 ml-10">
                Quick Actions:
              </Text>
              <View className="flex flex-row flex-wrap gap-2 ml-10">
                {[
                  { id: "book", label: "Book Appointment", icon: "calendar" as const },
                  { id: "pain", label: "Dental Pain", icon: "medical" as const },
                  { id: "checkup", label: "Routine Checkup", icon: "checkmark-circle" as const },
                  { id: "photo", label: "Upload Photo", icon: "camera" as const },
                ].map((action) => (
                  <Pressable
                    key={action.id}
                    onPress={() => {
                      if (action.id === "photo") {
                        setActiveWidget("image_upload");
                      } else if (action.id === "book") {
                        sendMessage("I'd like to book an appointment");
                      } else if (action.id === "pain") {
                        sendMessage("I'm experiencing dental pain");
                      } else if (action.id === "checkup") {
                        sendMessage("I need a routine checkup");
                      }
                    }}
                    className="flex flex-row items-center bg-card border border-border rounded-full px-4 py-2"
                  >
                    <Ionicons name={action.icon} size={16} color="#0891b2" />
                    <Text className="ml-2 text-foreground font-medium text-sm">
                      {action.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="border-t border-border bg-card px-4 py-3">
          <View className="flex flex-row items-end gap-2">
            {/* Attachment Button */}
            <Pressable
              onPress={() => setActiveWidget("image_upload")}
              className="w-10 h-10 rounded-full bg-muted items-center justify-center"
            >
              <Ionicons name="attach" size={20} color="#6b7280" />
            </Pressable>

            <View className="flex-1 bg-background border border-border rounded-2xl flex flex-row items-center px-4">
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={t.typeMessage}
                placeholderTextColor="#9ca3af"
                className="flex-1 py-3 text-foreground max-h-24"
                multiline
                onSubmitEditing={() => sendMessage(inputText)}
              />
            </View>

            <Pressable
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim() || isTyping}
              className={cn(
                "w-10 h-10 rounded-full items-center justify-center",
                inputText.trim() && !isTyping ? "bg-primary" : "bg-muted"
              )}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons
                  name="send"
                  size={18}
                  color={inputText.trim() ? "#ffffff" : "#9ca3af"}
                />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
