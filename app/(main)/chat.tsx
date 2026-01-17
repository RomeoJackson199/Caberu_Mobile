import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { supabase } from "@/lib/supabase";
import { cn, generateSessionId } from "@/lib/utils";
import { Card, Button, Badge } from "@/components/ui";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  widget?: string;
}

const QUICK_ACTIONS = [
  { id: "book", label: "Book Appointment", icon: "calendar" as const },
  { id: "pain", label: "Dental Pain", icon: "medical" as const },
  { id: "checkup", label: "Routine Checkup", icon: "checkmark-circle" as const },
  { id: "emergency", label: "Emergency", icon: "warning" as const },
];

export default function ChatScreen() {
  const { user, profile } = useAuth();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const [showQuickActions, setShowQuickActions] = useState(true);

  useEffect(() => {
    // Send welcome message
    const welcomeMessage: Message = {
      id: "welcome",
      content: profile?.first_name
        ? t.detailedWelcomeMessage.replace(
            "Welcome to First Smile AI!",
            `Welcome ${profile.first_name} to First Smile AI!`
          )
        : t.detailedWelcomeMessage,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [profile?.first_name]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setShowQuickActions(false);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Call Supabase Edge Function for AI response
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

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || "I apologize, I couldn't process your request. Please try again.",
        isBot: true,
        timestamp: new Date(),
        widget: data.widget,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);

      // Fallback response
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting right now. You can still book an appointment by tapping the button below, or try again in a moment.",
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "book":
        sendMessage("I'd like to book an appointment");
        break;
      case "pain":
        sendMessage("I'm experiencing dental pain");
        break;
      case "checkup":
        sendMessage("I need a routine checkup");
        break;
      case "emergency":
        sendMessage("I have a dental emergency");
        break;
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book an appointment",
        type: "info",
      });
      router.push("/(auth)/login");
      return;
    }
    router.push("/(main)/book");
  };

  const renderMessage = (message: Message) => {
    const isBot = message.isBot;

    return (
      <View
        key={message.id}
        className={cn(
          "flex flex-row mb-4",
          isBot ? "justify-start" : "justify-end"
        )}
      >
        <View
          className={cn(
            "max-w-[85%] rounded-2xl px-4 py-3",
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

          {/* Quick Book Button for bot messages suggesting booking */}
          {isBot &&
            (message.content.toLowerCase().includes("book") ||
              message.content.toLowerCase().includes("appointment")) && (
              <Pressable
                onPress={handleBookNow}
                className="mt-3 flex flex-row items-center bg-primary/10 rounded-lg px-3 py-2"
              >
                <Ionicons name="calendar" size={18} color="#0891b2" />
                <Text className="ml-2 text-primary font-medium">
                  {t.bookNow}
                </Text>
              </Pressable>
            )}
        </View>
      </View>
    );
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
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map(renderMessage)}

          {/* Typing Indicator */}
          {isTyping && (
            <View className="flex flex-row justify-start mb-4">
              <View className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <View className="flex flex-row items-center gap-1">
                  <View className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <View className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <View className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          {showQuickActions && messages.length <= 1 && (
            <View className="mt-4">
              <Text className="text-muted-foreground text-sm mb-3">
                Quick Actions:
              </Text>
              <View className="flex flex-row flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <Pressable
                    key={action.id}
                    onPress={() => handleQuickAction(action.id)}
                    className="flex flex-row items-center bg-card border border-border rounded-full px-4 py-2"
                  >
                    <Ionicons
                      name={action.icon}
                      size={16}
                      color="#0891b2"
                    />
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
                "w-12 h-12 rounded-full items-center justify-center",
                inputText.trim() && !isTyping
                  ? "bg-primary"
                  : "bg-muted"
              )}
            >
              {isTyping ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons
                  name="send"
                  size={20}
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
