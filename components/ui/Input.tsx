import { TextInput, View, Text, TextInputProps } from "react-native";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, className, containerClassName, ...props }, ref) => {
    return (
      <View className={cn("w-full", containerClassName)}>
        {label && (
          <Text className="text-sm font-medium text-foreground mb-2">
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            "w-full h-12 px-4 rounded-lg border bg-background text-foreground",
            error ? "border-destructive" : "border-input",
            "focus:border-primary",
            className
          )}
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {error && (
          <Text className="text-sm text-destructive mt-1">{error}</Text>
        )}
      </View>
    );
  }
);

Input.displayName = "Input";
