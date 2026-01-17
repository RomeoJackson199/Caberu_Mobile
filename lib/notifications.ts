import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { supabase } from "./supabase";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationData {
  type: "appointment_reminder" | "appointment_confirmed" | "appointment_cancelled" | "general";
  appointmentId?: string;
  title: string;
  body: string;
}

// Request notification permissions and get push token
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission not granted");
    return null;
  }

  // Get Expo push token
  try {
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: "your-project-id", // Replace with your Expo project ID
    });

    // Configure Android channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#0891b2",
      });

      await Notifications.setNotificationChannelAsync("appointments", {
        name: "Appointments",
        description: "Notifications about your dental appointments",
        importance: Notifications.AndroidImportance.HIGH,
        sound: "default",
      });
    }

    return token.data;
  } catch (error) {
    console.error("Error getting push token:", error);
    return null;
  }
}

// Save push token to database
export async function savePushToken(userId: string, token: string) {
  try {
    // First, get the profile ID for this user
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (!profile) {
      console.error("No profile found for user");
      return;
    }

    // Note: You'll need to create a push_tokens table in your Supabase database
    // For now, we'll log the token
    console.log("Push token for user:", userId, token);

    // Uncomment when you have the push_tokens table:
    // await supabase
    //   .from("push_tokens")
    //   .upsert({
    //     user_id: userId,
    //     token: token,
    //     platform: Platform.OS,
    //     updated_at: new Date().toISOString(),
    //   });
  } catch (error) {
    console.error("Error saving push token:", error);
  }
}

// Schedule a local notification
export async function scheduleLocalNotification(
  data: NotificationData,
  triggerDate: Date
) {
  const trigger = triggerDate.getTime() - Date.now();

  if (trigger <= 0) {
    console.log("Cannot schedule notification in the past");
    return null;
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: data.title,
      body: data.body,
      data: {
        type: data.type,
        appointmentId: data.appointmentId,
      },
      sound: true,
    },
    trigger: {
      seconds: Math.floor(trigger / 1000),
    },
  });

  return id;
}

// Schedule appointment reminder (24h before)
export async function scheduleAppointmentReminder(
  appointmentId: string,
  appointmentDate: Date,
  dentistName: string,
  reason?: string
) {
  const reminderDate = new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000); // 24 hours before

  if (reminderDate <= new Date()) {
    console.log("Appointment is too soon for 24h reminder");
    return null;
  }

  return scheduleLocalNotification(
    {
      type: "appointment_reminder",
      appointmentId,
      title: "Appointment Reminder",
      body: `You have an appointment with Dr. ${dentistName} tomorrow${
        reason ? ` for ${reason}` : ""
      }.`,
    },
    reminderDate
  );
}

// Cancel scheduled notification
export async function cancelNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

// Cancel all scheduled notifications
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Add notification response listener
export function addNotificationResponseListener(
  callback: (response: Notifications.NotificationResponse) => void
) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Add notification received listener
export function addNotificationReceivedListener(
  callback: (notification: Notifications.Notification) => void
) {
  return Notifications.addNotificationReceivedListener(callback);
}
