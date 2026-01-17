import { View, Text } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const badgeVariants = cva(
  "flex flex-row items-center rounded-full px-3 py-1",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        outline: "border border-border bg-transparent",
        success: "bg-green-100",
        warning: "bg-yellow-100",
        info: "bg-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const badgeTextVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-white",
      destructive: "text-white",
      outline: "text-foreground",
      success: "text-green-800",
      warning: "text-yellow-800",
      info: "text-blue-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
  textClassName?: string;
}

export function Badge({
  variant,
  children,
  className,
  textClassName,
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)}>
      {typeof children === "string" ? (
        <Text className={cn(badgeTextVariants({ variant }), textClassName)}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
