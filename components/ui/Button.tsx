import { Pressable, Text, ActivityIndicator, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const buttonVariants = cva(
  "flex flex-row items-center justify-center rounded-lg active:opacity-80",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        outline: "border border-border bg-transparent",
        ghost: "bg-transparent",
        link: "bg-transparent",
      },
      size: {
        default: "h-12 px-6",
        sm: "h-10 px-4",
        lg: "h-14 px-8",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      default: "text-white",
      secondary: "text-white",
      destructive: "text-white",
      outline: "text-foreground",
      ghost: "text-foreground",
      link: "text-primary underline",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      lg: "text-lg",
      icon: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
  textClassName?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant,
  size,
  onPress,
  disabled,
  loading,
  children,
  className,
  textClassName,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        buttonVariants({ variant, size }),
        isDisabled && "opacity-50",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? "#0891b2" : "#ffffff"}
          size="small"
        />
      ) : (
        <View className="flex flex-row items-center gap-2">
          {leftIcon}
          {typeof children === "string" ? (
            <Text
              className={cn(buttonTextVariants({ variant, size }), textClassName)}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {rightIcon}
        </View>
      )}
    </Pressable>
  );
}
