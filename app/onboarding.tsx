import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const { width } = Dimensions.get("window");

const ONBOARDING_KEY = "has_completed_onboarding";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "GB" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "nl", name: "Nederlands", flag: "NL" },
];

export default function OnboardingScreen() {
  const { t, setLanguage, language } = useLanguage();
  const [step, setStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);

  const handleLanguageSelect = async (lang: Language) => {
    setSelectedLanguage(lang);
    await setLanguage(lang);
  };

  const handleComplete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    router.replace("/(main)/chat");
  };

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-24 h-24 rounded-3xl bg-white shadow-lg items-center justify-center mb-8">
              <Image
                source={require("@/assets/icon.png")}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-4">
              {t.selectPreferredLanguage}
            </Text>
            <Text className="text-muted-foreground text-center mb-8">
              {t.languageSelectionDescription}
            </Text>
            <View className="w-full gap-3">
              {languages.map((lang) => (
                <Pressable
                  key={lang.code}
                  onPress={() => handleLanguageSelect(lang.code)}
                  className={cn(
                    "flex flex-row items-center p-4 rounded-xl border-2",
                    selectedLanguage === lang.code
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card"
                  )}
                >
                  <Text className="text-2xl mr-3">
                    {lang.flag === "GB"
                      ? "🇬🇧"
                      : lang.flag === "FR"
                      ? "🇫🇷"
                      : "🇳🇱"}
                  </Text>
                  <Text className="text-lg font-medium text-foreground flex-1">
                    {lang.name}
                  </Text>
                  {selectedLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={24} color="#0891b2" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 1:
        return (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-6">
              <Ionicons name="sparkles" size={40} color="#0891b2" />
            </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-4">
              {t.welcomeToFirstSmile}
            </Text>
            <Text className="text-muted-foreground text-center mb-8">
              {t.onboardingIntro}
            </Text>
            <View className="w-full gap-4">
              <View className="flex flex-row items-center bg-card p-4 rounded-xl border border-border">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
                  <Ionicons name="chatbubbles" size={24} color="#0891b2" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {t.aiChat}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {t.aiChatDesc}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center bg-card p-4 rounded-xl border border-border">
                <View className="w-12 h-12 rounded-full bg-secondary/10 items-center justify-center mr-4">
                  <Ionicons name="calendar" size={24} color="#22c55e" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {t.smartBooking}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {t.smartBookingDesc}
                  </Text>
                </View>
              </View>
              <View className="flex flex-row items-center bg-card p-4 rounded-xl border border-border">
                <View className="w-12 h-12 rounded-full bg-accent/10 items-center justify-center mr-4">
                  <Ionicons name="camera" size={24} color="#a855f7" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-foreground">
                    {t.photoAnalysis}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    {t.photoAnalysisDesc}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View className="flex-1 items-center justify-center px-6">
            <View className="w-20 h-20 rounded-full bg-secondary/10 items-center justify-center mb-6">
              <Ionicons name="people" size={40} color="#22c55e" />
            </View>
            <Text className="text-3xl font-bold text-foreground text-center mb-4">
              {t.familyCare}
            </Text>
            <Text className="text-muted-foreground text-center mb-8">
              {t.familyCareDesc}
            </Text>
            <View className="w-full bg-primary/10 p-6 rounded-2xl">
              <Text className="text-center text-foreground mb-4">
                Pro Tip: Just tell me what's bothering you, and I'll guide you
                through everything!
              </Text>
              <View className="flex flex-row justify-center gap-2">
                <View className="w-2 h-2 bg-primary rounded-full" />
                <View className="w-2 h-2 bg-primary/50 rounded-full" />
                <View className="w-2 h-2 bg-primary/30 rounded-full" />
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* Progress Dots */}
        <View className="flex flex-row justify-center gap-2 py-4">
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              className={cn(
                "h-2 rounded-full transition-all",
                i === step ? "w-8 bg-primary" : "w-2 bg-muted"
              )}
            />
          ))}
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {renderStep()}
        </ScrollView>

        {/* Navigation */}
        <View className="px-6 pb-4">
          <View className="flex flex-row gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                onPress={handleBack}
                className="flex-1"
              >
                {t.back}
              </Button>
            )}
            <Button
              onPress={handleNext}
              className={cn(step === 0 ? "w-full" : "flex-1")}
            >
              {step === 2 ? t.letsStart : t.next}
            </Button>
          </View>
          {step === 0 && (
            <Pressable onPress={handleComplete} className="mt-4">
              <Text className="text-center text-muted-foreground">
                {t.skip}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
