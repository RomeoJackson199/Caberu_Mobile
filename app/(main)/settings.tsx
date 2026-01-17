import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Switch,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/useToast";
import { updateUserProfile } from "@/lib/supabase";
import {
  Button,
  Input,
  Card,
  CardContent,
  Modal,
  Separator,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "GB" },
  { code: "fr", name: "Français", flag: "FR" },
  { code: "nl", name: "Nederlands", flag: "NL" },
];

export default function SettingsScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const colorScheme = useColorScheme();

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [emergencyContact, setEmergencyContact] = useState(
    profile?.emergency_contact || ""
  );
  const [medicalHistory, setMedicalHistory] = useState(
    profile?.medical_history || ""
  );

  const handleSaveProfile = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await updateUserProfile(profile.id, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        address: address || undefined,
        emergency_contact: emergencyContact || undefined,
        medical_history: medicalHistory || undefined,
      });

      if (error) throw error;

      await refreshProfile();
      toast({
        title: t.success,
        description: t.personalInfoUpdated,
        type: "success",
      });
      setEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t.error,
        description: "Failed to update profile",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageChange = async (lang: Language) => {
    await setLanguage(lang);
    setShowLanguageModal(false);
    toast({
      title: t.languageUpdated,
      description: `${t.languageChangedTo} ${
        languages.find((l) => l.code === lang)?.name
      }`,
      type: "success",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/(auth)/login");
  };

  if (!user || !profile) {
    return (
      <View className="flex-1 bg-background items-center justify-center p-6">
        <Text className="text-muted-foreground">Please sign in to view settings</Text>
        <Button onPress={() => router.push("/(auth)/login")} className="mt-4">
          {t.signIn}
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex flex-row items-center px-4 py-3 border-b border-border bg-card">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#0891b2" />
        </Pressable>
        <Text className="text-lg font-bold text-foreground">{t.settings}</Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
      >
        {/* Profile Section */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-foreground">
                {t.personalInformation}
              </Text>
              <Pressable
                onPress={() => setEditingProfile(!editingProfile)}
                className="flex flex-row items-center"
              >
                <Ionicons
                  name={editingProfile ? "close" : "pencil"}
                  size={20}
                  color="#0891b2"
                />
                <Text className="text-primary ml-1">
                  {editingProfile ? t.cancel : "Edit"}
                </Text>
              </Pressable>
            </View>

            {editingProfile ? (
              <View className="gap-4">
                <View className="flex flex-row gap-3">
                  <Input
                    label={t.firstName}
                    value={firstName}
                    onChangeText={setFirstName}
                    containerClassName="flex-1"
                  />
                  <Input
                    label={t.lastName}
                    value={lastName}
                    onChangeText={setLastName}
                    containerClassName="flex-1"
                  />
                </View>
                <Input
                  label={t.phoneNumber}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
                <Input
                  label={t.address}
                  value={address}
                  onChangeText={setAddress}
                  multiline
                />
                <Input
                  label={t.emergencyContact}
                  value={emergencyContact}
                  onChangeText={setEmergencyContact}
                />
                <Input
                  label={t.medicalHistory}
                  value={medicalHistory}
                  onChangeText={setMedicalHistory}
                  multiline
                  numberOfLines={3}
                  className="h-24"
                />
                <Button onPress={handleSaveProfile} loading={saving}>
                  {t.save}
                </Button>
              </View>
            ) : (
              <View className="gap-3">
                <View className="flex flex-row justify-between">
                  <Text className="text-muted-foreground">Name</Text>
                  <Text className="font-medium text-foreground">
                    {profile.first_name} {profile.last_name}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-muted-foreground">Email</Text>
                  <Text className="font-medium text-foreground">
                    {profile.email}
                  </Text>
                </View>
                {profile.phone && (
                  <View className="flex flex-row justify-between">
                    <Text className="text-muted-foreground">Phone</Text>
                    <Text className="font-medium text-foreground">
                      {profile.phone}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <Text className="text-lg font-bold text-foreground mb-4">
              Preferences
            </Text>

            {/* Language */}
            <Pressable
              onPress={() => setShowLanguageModal(true)}
              className="flex flex-row items-center justify-between py-3"
            >
              <View className="flex flex-row items-center">
                <Ionicons name="language" size={24} color="#6b7280" />
                <Text className="text-foreground ml-3">{t.language}</Text>
              </View>
              <View className="flex flex-row items-center">
                <Text className="text-muted-foreground mr-2">
                  {languages.find((l) => l.code === language)?.name}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </View>
            </Pressable>

            <Separator className="my-0" />

            {/* Notifications */}
            <View className="flex flex-row items-center justify-between py-3">
              <View className="flex flex-row items-center">
                <Ionicons name="notifications" size={24} color="#6b7280" />
                <Text className="text-foreground ml-3">Push Notifications</Text>
              </View>
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: "#e5e7eb", true: "#0891b2" }}
              />
            </View>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <View className="flex flex-row items-start">
              <Ionicons name="shield-checkmark" size={24} color="#0891b2" />
              <View className="flex-1 ml-3">
                <Text className="font-medium text-foreground">
                  Privacy & Security
                </Text>
                <Text className="text-sm text-muted-foreground mt-1">
                  {t.privacyNotice}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <Button
          variant="destructive"
          onPress={handleSignOut}
          leftIcon={<Ionicons name="log-out" size={20} color="#ffffff" />}
        >
          {t.signOut}
        </Button>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t.selectPreferredLanguage}
      >
        <View className="gap-3">
          {languages.map((lang) => (
            <Pressable
              key={lang.code}
              onPress={() => handleLanguageChange(lang.code)}
              className={cn(
                "flex flex-row items-center p-4 rounded-xl border-2",
                language === lang.code
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              )}
            >
              <Text className="text-2xl mr-3">
                {lang.flag === "GB" ? "🇬🇧" : lang.flag === "FR" ? "🇫🇷" : "🇳🇱"}
              </Text>
              <Text className="text-lg font-medium text-foreground flex-1">
                {lang.name}
              </Text>
              {language === lang.code && (
                <Ionicons name="checkmark-circle" size={24} color="#0891b2" />
              )}
            </Pressable>
          ))}
        </View>
      </Modal>
    </View>
  );
}
