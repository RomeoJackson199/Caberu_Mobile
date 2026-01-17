import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";

const BIOMETRIC_ENABLED_KEY = "biometric_auth_enabled";

export interface BiometricResult {
  success: boolean;
  error?: string;
}

// Check if device supports biometric authentication
export async function isBiometricSupported(): Promise<boolean> {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  if (!compatible) return false;

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return enrolled;
}

// Get available biometric types
export async function getBiometricTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
  return LocalAuthentication.supportedAuthenticationTypesAsync();
}

// Get biometric type name
export async function getBiometricTypeName(): Promise<string> {
  const types = await getBiometricTypes();

  if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return "Face ID";
  }
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return "Touch ID";
  }
  if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return "Iris";
  }

  return "Biometric";
}

// Authenticate with biometrics
export async function authenticateWithBiometrics(
  promptMessage?: string
): Promise<BiometricResult> {
  try {
    const isSupported = await isBiometricSupported();
    if (!isSupported) {
      return {
        success: false,
        error: "Biometric authentication is not available on this device",
      };
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage || "Authenticate to continue",
      cancelLabel: "Cancel",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
    });

    if (result.success) {
      return { success: true };
    }

    return {
      success: false,
      error: result.error || "Authentication failed",
    };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred during authentication",
    };
  }
}

// Check if biometric login is enabled
export async function isBiometricLoginEnabled(): Promise<boolean> {
  try {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return enabled === "true";
  } catch {
    return false;
  }
}

// Enable biometric login
export async function enableBiometricLogin(): Promise<BiometricResult> {
  const isSupported = await isBiometricSupported();
  if (!isSupported) {
    return {
      success: false,
      error: "Biometric authentication is not available",
    };
  }

  // Verify biometrics before enabling
  const authResult = await authenticateWithBiometrics(
    "Verify your identity to enable biometric login"
  );

  if (!authResult.success) {
    return authResult;
  }

  try {
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, "true");
    return { success: true };
  } catch {
    return {
      success: false,
      error: "Failed to save biometric preference",
    };
  }
}

// Disable biometric login
export async function disableBiometricLogin(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  } catch (error) {
    console.error("Error disabling biometric login:", error);
  }
}

// Authenticate for sensitive operations
export async function requireBiometricAuth(
  promptMessage: string
): Promise<BiometricResult> {
  const isEnabled = await isBiometricLoginEnabled();
  if (!isEnabled) {
    // Biometric not enabled, proceed without authentication
    return { success: true };
  }

  return authenticateWithBiometrics(promptMessage);
}
