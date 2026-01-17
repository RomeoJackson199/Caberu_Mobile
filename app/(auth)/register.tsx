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

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      email?: string;
      password?: string;
    } = {};

    if (!firstName.trim()) {
      newErrors.firstName = t.requiredField;
    }

    if (!lastName.trim()) {
      newErrors.lastName = t.requiredField;
    }

    if (!email) {
      newErrors.email = t.requiredField;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = t.invalidEmailFormat;
    }

    if (!password) {
      newErrors.password = t.requiredField;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
      });

      if (error) {
        toast({
          title: t.signUpError,
          description: error.message,
          type: "error",
        });
      } else {
        toast({
          title: t.accountCreatedSuccess,
          description: t.checkEmailConfirm,
          type: "success",
        });
        router.replace("/(auth)/login");
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
          <View className="flex-1 px-6 py-8">
            {/* Back Button */}
            <Pressable
              onPress={() => router.back()}
              className="flex flex-row items-center mb-6"
            >
              <Ionicons name="arrow-back" size={24} color="#0891b2" />
              <Text className="text-primary ml-2">{t.back}</Text>
            </Pressable>

            {/* Header */}
            <View className="items-center mb-6">
              <View className="w-16 h-16 rounded-2xl bg-white shadow-lg items-center justify-center mb-3">
                <Image
                  source={require("@/assets/icon.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {t.createAccount}
              </Text>
              <Text className="text-muted-foreground mt-1">
                Join First Smile AI today
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              <View className="flex flex-row gap-3">
                <View className="flex-1">
                  <Input
                    label={t.firstName}
                    placeholder={t.enterFirstName}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    error={errors.firstName}
                  />
                </View>
                <View className="flex-1">
                  <Input
                    label={t.lastName}
                    placeholder={t.enterLastName}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    error={errors.lastName}
                  />
                </View>
              </View>

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

              <Input
                label={`${t.phone} (${t.optional})`}
                placeholder={t.enterPhoneNumber}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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

              <Button
                onPress={handleRegister}
                loading={loading}
                className="mt-2"
              >
                {t.createAccountButton}
              </Button>
            </View>

            {/* Divider */}
            <View className="flex flex-row items-center my-6">
              <View className="flex-1 h-px bg-border" />
              <Text className="mx-4 text-muted-foreground">{t.or}</Text>
              <View className="flex-1 h-px bg-border" />
            </View>

            {/* Google Sign Up */}
            <Button
              variant="outline"
              leftIcon={
                <Ionicons name="logo-google" size={20} color="#4285F4" />
              }
            >
              {t.continueWithGoogle}
            </Button>

            {/* Sign In Link */}
            <View className="flex flex-row justify-center mt-6">
              <Text className="text-muted-foreground">
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="text-primary font-semibold">
                    {t.signInButton}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
