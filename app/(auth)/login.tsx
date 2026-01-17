import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { Button, Input } from "@/components/ui";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = t.requiredField;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.invalidEmailFormat;
    }

    if (!password) {
      newErrors.password = t.requiredField;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast({
          title: t.signInError,
          description: error.message,
          type: "error",
        });
      } else {
        toast({
          title: t.signInSuccess,
          description: t.welcomeToDentiBot,
          type: "success",
        });
        router.replace("/(main)/chat");
      }
    } catch (error) {
      toast({
        title: t.error,
        description: "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 px-6 justify-center">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-20 h-20 rounded-2xl bg-white shadow-lg items-center justify-center mb-4">
                <Image
                  source={require("@/assets/icon.png")}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {t.welcome}
              </Text>
              <Text className="text-muted-foreground mt-1">
                {t.signInOrCreate}
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <Input
                label={t.email}
                placeholder={t.enterEmail}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />

              <View>
                <Input
                  label={t.password}
                  placeholder={t.enterPassword}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={errors.password}
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9"
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#6b7280"
                  />
                </Pressable>
              </View>

              <Button onPress={handleLogin} loading={loading} className="mt-2">
                {t.signInButton}
              </Button>
            </View>

            {/* Divider */}
            <View className="flex flex-row items-center my-6">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-muted-foreground">{t.or}</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Google Sign In */}
            <Button
              variant="outline"
              leftIcon={
                <Ionicons name="logo-google" size={20} color="#4285F4" />
              }
            >
              {t.continueWithGoogle}
            </Button>

            {/* Sign Up Link */}
            <View className="flex flex-row justify-center mt-8">
              <Text className="text-muted-foreground">
                Don't have an account?{" "}
              </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="text-primary font-semibold">
                    {t.createAccountButton}
                  </Text>
                </Pressable>
              </Link>
            </View>

            {/* Skip to Chat */}
            <Pressable
              onPress={() => router.replace("/(main)/chat")}
              className="mt-6"
            >
              <Text className="text-center text-muted-foreground">
                Continue without signing in
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
