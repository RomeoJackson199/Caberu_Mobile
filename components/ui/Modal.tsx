import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: "sm" | "md" | "lg" | "full";
}

export function Modal({
  visible,
  onClose,
  title,
  children,
  className,
  showCloseButton = true,
  size = "md",
}: ModalProps) {
  const sizeClasses = {
    sm: "max-w-xs",
    md: "max-w-md",
    lg: "max-w-lg",
    full: "w-full h-full",
  };

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center p-4"
          onPress={onClose}
        >
          <Pressable
            className={cn(
              "bg-card rounded-2xl w-full overflow-hidden",
              sizeClasses[size],
              size === "full" && "rounded-none",
              className
            )}
            onPress={(e) => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <View className="flex flex-row items-center justify-between p-4 border-b border-border">
                {title && (
                  <Text className="text-lg font-bold text-foreground flex-1">
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <Pressable
                    onPress={onClose}
                    className="p-1 rounded-full active:bg-muted"
                  >
                    <Ionicons name="close" size={24} color="#6b7280" />
                  </Pressable>
                )}
              </View>
            )}
            <ScrollView
              className="max-h-96"
              showsVerticalScrollIndicator={false}
            >
              <View className="p-4">{children}</View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

interface AlertDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  destructive?: boolean;
}

export function AlertDialog({
  visible,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  destructive = false,
}: AlertDialogProps) {
  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false} size="sm">
      <View className="items-center">
        <Text className="text-lg font-bold text-foreground text-center mb-2">
          {title}
        </Text>
        <Text className="text-sm text-muted-foreground text-center mb-6">
          {description}
        </Text>
        <View className="flex flex-row gap-3 w-full">
          <Pressable
            onPress={onClose}
            className="flex-1 py-3 rounded-lg border border-border active:bg-muted"
          >
            <Text className="text-center font-medium text-foreground">
              {cancelText}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 py-3 rounded-lg active:opacity-80",
              destructive ? "bg-destructive" : "bg-primary"
            )}
          >
            <Text className="text-center font-medium text-white">
              {confirmText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
