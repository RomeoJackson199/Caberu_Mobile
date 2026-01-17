import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/ui";

const ONBOARDING_KEY = "has_completed_onboarding";
const LANGUAGE_KEY = "preferred-language";

export default function Index() {
  const { user, loading } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [hasLanguage, setHasLanguage] = useState<boolean | null>(null);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const [onboardingDone, language] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(LANGUAGE_KEY),
      ]);
      setIsFirstLaunch(onboardingDone !== "true");
      setHasLanguage(!!language);
    } catch (error) {
      console.error("Error checking first launch:", error);
      setIsFirstLaunch(false);
      setHasLanguage(true);
    }
  };

  if (loading || isFirstLaunch === null || hasLanguage === null) {
    return (
      <LoadingScreen
        message="Initializing your experience"
        submessage="Preparing your personalized dental assistant powered by advanced AI technology"
      />
    );
  }

  // Show onboarding if first launch or no language selected
  if (isFirstLaunch || !hasLanguage) {
    return <Redirect href="/onboarding" />;
  }

  // Go to main app (auth not required for chat)
  return <Redirect href="/(main)/chat" />;
}
