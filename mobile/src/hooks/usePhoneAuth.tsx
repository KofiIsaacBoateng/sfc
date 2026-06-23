import { useState } from "react";
import {
  FirebaseAuthTypes,
  getAuth,
  signInWithPhoneNumber,
} from "@react-native-firebase/auth";
import { router } from "expo-router";
import { Alert } from "react-native";
import { authCache } from "@/services/authCache";

export function usePhoneAuth() {
  const [loading, setLoading] = useState(false);

  /**
   * Step 1: Request SMS verification gateway dispatch
   */
  const sendOtpCode = async (formattedPhone: string) => {
    setLoading(true);
    try {
      const authInstance = getAuth();
      // Fires native device safety checks and requests the SMS dispatch
      const confirmation = await signInWithPhoneNumber(
        authInstance,
        formattedPhone,
      );
      authCache.setConfirmation(confirmation);

      // Cache verification target phone and send user to verification viewport
      router.push({
        pathname: "/verify",
        params: { phone: formattedPhone },
      });
    } catch (error: any) {
      console.error("❌ Firebase OTP Dispatch Failure:", error);
      Alert.alert(
        "Verification Failed",
        error.message || "Could not send SMS code.",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2: Confirm incoming OTP string payload code
   */
  const verifyOtpCode = async (otpCode: string) => {
    setLoading(true);
    const confirmation = authCache.getConfirmation();

    if (!confirmation) {
      Alert.alert(
        "Session Expired",
        "The authentication handshake transaction has timed out. Please try again.",
      );
      router.back();
      return;
    }

    try {
      // Validates the code cryptographically against the initial transaction footprint
      const userCredential = await confirmation.confirm(otpCode);

      if (userCredential) {
        // User logged in locally! Return credential info to pass to our Node backend
        return userCredential.user;
      }
    } catch (error: any) {
      console.error("❌ OTP Verification Code Invalid:", error);
      Alert.alert(
        "Invalid Code",
        "The 6-digit code entered is incorrect or expired.",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtpCode,
    verifyOtpCode,
    loading,
  };
}
