import { View, Text, Image } from "react-native";
import { cn } from "@/lib/utils";

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const textSizes = {
  sm: "text-xs",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
};

export function Avatar({ uri, name, size = "md", className }: AvatarProps) {
  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  if (uri) {
    return (
      <View
        className={cn(
          "rounded-full overflow-hidden bg-muted",
          sizeClasses[size],
          className
        )}
      >
        <Image
          source={{ uri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <View
      className={cn(
        "rounded-full bg-primary items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <Text className={cn("font-bold text-white", textSizes[size])}>
        {name ? getInitials(name) : "?"}
      </Text>
    </View>
  );
}
