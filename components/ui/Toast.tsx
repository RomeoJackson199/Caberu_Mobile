import { View, Text, Pressable, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, Toast as ToastType } from "@/hooks/useToast";

const toastStyles = {
  success: {
    bg: "bg-green-100",
    text: "text-green-800",
    icon: "checkmark-circle" as const,
    iconColor: "#166534",
  },
  error: {
    bg: "bg-red-100",
    text: "text-red-800",
    icon: "close-circle" as const,
    iconColor: "#991b1b",
  },
  warning: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    icon: "warning" as const,
    iconColor: "#92400e",
  },
  info: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    icon: "information-circle" as const,
    iconColor: "#1e40af",
  },
};

interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const style = toastStyles[toast.type];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -20,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss(toast.id));
  };

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
      className={cn(
        "flex flex-row items-center rounded-xl p-4 mb-2 mx-4 shadow-lg",
        style.bg
      )}
    >
      <Ionicons name={style.icon} size={24} color={style.iconColor} />
      <View className="flex-1 ml-3">
        <Text className={cn("font-semibold", style.text)}>{toast.title}</Text>
        {toast.description && (
          <Text className={cn("text-sm mt-0.5", style.text)}>
            {toast.description}
          </Text>
        )}
      </View>
      <Pressable onPress={handleDismiss} className="p-1">
        <Ionicons name="close" size={20} color={style.iconColor} />
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();
  const insets = useSafeAreaInsets();

  if (toasts.length === 0) return null;

  return (
    <View
      className="absolute left-0 right-0 z-50"
      style={{ top: insets.top + 8 }}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </View>
  );
}
