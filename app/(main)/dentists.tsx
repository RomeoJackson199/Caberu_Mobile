import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  Card,
  CardContent,
  Badge,
  Avatar,
  LoadingSpinner,
  Button,
} from "@/components/ui";

interface Dentist {
  id: string;
  specialization: string | null;
  license_number: string | null;
  is_active: boolean;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function DentistsScreen() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const {
    data: dentists,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["dentists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dentists")
        .select(
          `
          id,
          specialization,
          license_number,
          is_active,
          profiles (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as unknown as Dentist[];
    },
  });

  const handleBookWithDentist = (dentistId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to book an appointment",
        type: "info",
      });
      router.push("/(auth)/login");
      return;
    }
    router.push({
      pathname: "/(main)/book",
      params: { dentistId },
    });
  };

  if (isLoading) {
    return <LoadingSpinner className="flex-1" />;
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingVertical: 16 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-foreground">
            {t.viewOurDentists}
          </Text>
          <Text className="text-muted-foreground mt-1">
            Choose a dentist for your appointment
          </Text>
        </View>

        {/* Dentist Cards */}
        {dentists?.map((dentist) => (
          <Card key={dentist.id} className="mb-4">
            <CardContent className="p-4">
              <View className="flex flex-row items-start">
                {/* Avatar */}
                <Avatar
                  name={`${dentist.profiles.first_name} ${dentist.profiles.last_name}`}
                  size="lg"
                  className="mr-4"
                />

                {/* Info */}
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground">
                    Dr. {dentist.profiles.first_name} {dentist.profiles.last_name}
                  </Text>

                  {dentist.specialization && (
                    <Badge variant="info" className="mt-1 self-start">
                      {dentist.specialization}
                    </Badge>
                  )}

                  <View className="mt-3 gap-2">
                    <View className="flex flex-row items-center">
                      <Ionicons name="mail" size={14} color="#6b7280" />
                      <Text className="text-sm text-muted-foreground ml-2">
                        {dentist.profiles.email}
                      </Text>
                    </View>

                    {dentist.license_number && (
                      <View className="flex flex-row items-center">
                        <Ionicons name="document-text" size={14} color="#6b7280" />
                        <Text className="text-sm text-muted-foreground ml-2">
                          License: {dentist.license_number}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Book Button */}
                  <Pressable
                    onPress={() => handleBookWithDentist(dentist.id)}
                    className="mt-4 bg-primary rounded-lg py-2.5 px-4 flex flex-row items-center justify-center"
                  >
                    <Ionicons name="calendar" size={18} color="#ffffff" />
                    <Text className="text-white font-medium ml-2">
                      {t.bookAppointment}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </CardContent>
          </Card>
        ))}

        {(!dentists || dentists.length === 0) && (
          <Card>
            <CardContent className="items-center py-12">
              <Ionicons name="people" size={48} color="#9ca3af" />
              <Text className="text-muted-foreground mt-3">
                No dentists available at the moment
              </Text>
            </CardContent>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}
