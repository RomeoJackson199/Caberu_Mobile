import { View, Text, ViewProps, TextProps } from "react-native";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-xl bg-card border border-border p-4 shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

interface CardHeaderProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className, ...props }: CardHeaderProps) {
  return (
    <View className={cn("mb-4", className)} {...props}>
      {children}
    </View>
  );
}

interface CardTitleProps extends TextProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className, ...props }: CardTitleProps) {
  return (
    <Text
      className={cn("text-xl font-bold text-foreground", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

interface CardDescriptionProps extends TextProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({
  children,
  className,
  ...props
}: CardDescriptionProps) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground mt-1", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

interface CardContentProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({
  children,
  className,
  ...props
}: CardContentProps) {
  return (
    <View className={cn("", className)} {...props}>
      {children}
    </View>
  );
}

interface CardFooterProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className, ...props }: CardFooterProps) {
  return (
    <View
      className={cn("flex flex-row items-center mt-4 pt-4 border-t border-border", className)}
      {...props}
    >
      {children}
    </View>
  );
}
