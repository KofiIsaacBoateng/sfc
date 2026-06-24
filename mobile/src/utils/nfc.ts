import { Alert, Platform } from "react-native";
import NFCManager from "react-native-nfc-manager";

export const checkNFCHardwareSupport = async (): Promise<boolean> => {
  try {
    const isSupported = await NFCManager.isSupported();

    if (!isSupported) {
      console.log("[NFC HARDWARE] Not supported on this device");
      return false;
    }

    console.log("[NFC HARDWARE] Device supports internal NFC interactions.");
    return true;
  } catch (error) {
    console.error("NFC hardware support check error: ", error);
    return false;
  }
};

export async function verifyAndEnableNfcAntenna(): Promise<boolean> {
  try {
    const isEnabled = await NFCManager.isEnabled();

    if (!isEnabled) {
      console.warn(
        "[NFC SETTINGS]: NFC chip is physically turned off in device settings.",
      );

      if (Platform.OS === "android") {
        Alert.alert(
          "NFC is Disabled",
          "KudiTap needs your NFC antenna active to read your card. Please enable it in your phone settings now.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: async () => {
                // ⚡ Deep-links user directly into the Android system NFC configuration panel
                await NFCManager.goToNfcSetting();
              },
            },
          ],
        );
      } else {
        // iOS Fallback warning
        Alert.alert(
          "NFC Inactive",
          "Please pull down your Control Centre or open iOS System Settings to ensure NFC operations are allowed.",
        );
      }
      return false;
    }

    console.log("[NFC SETTINGS]: NFC antenna is active and powered up.");
    return true;
  } catch (error) {
    console.error(
      "[NFC SETTINGS]: Failed to read system antenna status:",
      error,
    );
    return false;
  }
}
