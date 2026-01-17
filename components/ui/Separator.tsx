import { View } from "react-native";
import { cn } from "@/lib/utils";

interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Separator({
  orientation = "horizontal",
  className,
}: SeparatorProps) {
  return (
    <View
      className={cn(
        "bg-border",
        orientation === "horizontal" ? "h-px w-full my-4" : "w-px h-full mx-4",
        className
      )}
    />
  );
}
