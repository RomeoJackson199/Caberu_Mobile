import { View, Text, Pressable } from "react-native";
import { cn } from "@/lib/utils";
import { ReactNode, createContext, useContext, useState } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function Tabs({
  defaultValue,
  children,
  onValueChange,
  className,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <View className={cn("w-full", className)}>{children}</View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <View
      className={cn(
        "flex flex-row bg-muted rounded-xl p-1",
        className
      )}
    >
      {children}
    </View>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

export function TabsTrigger({
  value,
  children,
  className,
  icon,
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <Pressable
      onPress={() => setActiveTab(value)}
      className={cn(
        "flex-1 flex flex-row items-center justify-center gap-2 py-2.5 px-4 rounded-lg",
        isActive
          ? "bg-primary shadow-sm"
          : "bg-transparent active:bg-gray-200",
        className
      )}
    >
      {icon}
      <Text
        className={cn(
          "font-medium text-sm",
          isActive ? "text-white" : "text-muted-foreground"
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");

  const { activeTab } = context;

  if (activeTab !== value) return null;

  return <View className={cn("mt-4", className)}>{children}</View>;
}
