import { RefObject } from "react";
import { Alert, Platform } from "react-native";
import NFCManager, { NfcTech } from "react-native-nfc-manager";

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

export const readSFCPayload = async (
  isScreenActive: RefObject<boolean>,
): Promise<string | null> => {
  console.log("[LOCAL SCREEN SCANNER]: Activating antenna for SFC Hardware.");

  try {
    // Force radio to strictly look Ndef or NfcA formated hardwares
    await NFCManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]);

    if (!isScreenActive.current) return null;

    // capture the hardwares tag configuration
    const tag = await NFCManager.getTag();

    if (!tag) {
      console.error(
        "[LOCAL SCREEN SCANNER]: Hardware removed from scanning zone too quickly!",
      );
      return null;
    }

    console.log(
      "[LOCAL SCREEN SCANNER]: Verified custom Hardware signature: ",
      tag.id,
    );

    const hardwareSecureToken = tag.id;

    if (!hardwareSecureToken) {
      console.error(
        "[LOCAL SCREEN SCANNER]: Scanned Hardware does not match SFC manufacturing standards!",
      );

      return null;
    }

    return hardwareSecureToken;
  } catch (error: any) {
    console.warn("[LOCAL SCREEN SCANNER]: Interaction interrupted: ", error);

    if (
      !isScreenActive.current ||
      error === "User cancel" ||
      error?.message === "User cancel"
    ) {
      return null;
    }
    Alert.alert(
      "Scan Failed",
      "Hold your Hardware steady against the back of your phone.",
    );
    return null;
  } finally {
    if (isScreenActive) {
      await NFCManager.cancelTechnologyRequest()
        .then(() => {
          console.log("[LOCAL SCREEN SCANNER]: Cancelling antenna.");
        })
        .catch(() => {});
    }
  }
};
