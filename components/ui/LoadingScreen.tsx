import { View, Text, ActivityIndicator, Image } from "react-native";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  submessage?: string;
  showLogo?: boolean;
}

export function LoadingScreen({
  message = "Loading...",
  submessage,
  showLogo = true,
}: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-background p-8">
      <View className="items-center space-y-6">
        {showLogo && (
          <View className="w-20 h-20 rounded-2xl bg-white shadow-lg items-center justify-center">
            <Image
              source={require("@/assets/icon.png")}
              className="w-14 h-14"
              resizeMode="contain"
            />
          </View>
        )}
        <View className="items-center space-y-2">
          <Text className="text-2xl font-bold text-primary">{message}</Text>
          {submessage && (
            <Text className="text-muted-foreground text-center max-w-xs">
              {submessage}
            </Text>
          )}
        </View>
        <View className="flex flex-row space-x-2 mt-4">
          <View className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <View className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
          <View className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
        </View>
      </View>
    </View>
  );
}

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "large",
  color = "#0891b2",
  className,
}: LoadingSpinnerProps) {
  return (
    <View className={cn("items-center justify-center p-4", className)}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}
