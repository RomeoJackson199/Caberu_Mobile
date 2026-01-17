import { Tabs } from "expo-router";
import { View, Text, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { router } from "expo-router";

export default function MainLayout() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <View className="flex-1 bg-background">
      {/* Custom Header */}
      <View
        className="bg-card border-b border-border px-4 pb-3"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex flex-row items-center justify-between">
          <View className="flex flex-row items-center">
            <View className="w-10 h-10 rounded-xl bg-white shadow-md items-center justify-center mr-3">
              <Image
                source={require("@/assets/icon.png")}
                className="w-7 h-7"
                resizeMode="contain"
              />
            </View>
            <Text className="text-lg font-bold text-foreground">
              First Smile AI
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            {user ? (
              <Pressable
                onPress={() => router.push("/(main)/settings")}
                className="w-10 h-10 rounded-full bg-muted items-center justify-center"
              >
                <Ionicons name="settings-outline" size={22} color="#6b7280" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => router.push("/(auth)/login")}
                className="px-4 py-2 rounded-lg bg-primary"
              >
                <Text className="text-white font-medium">{t.signIn}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e5e7eb",
            paddingTop: 8,
            paddingBottom: insets.bottom + 8,
            height: 60 + insets.bottom,
          },
          tabBarActiveTintColor: "#0891b2",
          tabBarInactiveTintColor: "#6b7280",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="chat"
          options={{
            title: t.chat,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="appointments"
          options={{
            title: t.appointments,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dentists"
          options={{
            title: "Dentists",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="people" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="appointments/[id]"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="book"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </View>
  );
}
