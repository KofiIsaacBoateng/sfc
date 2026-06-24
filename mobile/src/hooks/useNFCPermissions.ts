import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import NfcManager from "react-native-nfc-manager";

export function useNfcPermissionLifecycle() {
  const [isNfcActive, setIsNfcActive] = useState(false);
  const [checking, setChecking] = useState(true);

  // Standalone verification function that checks both physical metrics sequentially
  const runHardwareAudit = async () => {
    try {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        setIsNfcActive(false);
        return;
      }

      const enabled = await NfcManager.isEnabled();
      setIsNfcActive(enabled);
    } catch (error) {
      setIsNfcActive(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    // ⚡ 1. Run the audit instantly the absolute moment the screen mounts
    runHardwareAudit();

    // ⚡ 2. Bind the native operating system app state change background thread listener
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        // If the app is transitioning back from background settings panels to the foreground view
        if (nextAppState === "active") {
          setChecking(true);
          console.log(
            "🔄 [NFC LIFECYCLE]: App foregrounded. Re-auditing antenna states...",
          );
          runHardwareAudit();
        }
      },
    );

    return () => {
      subscription.remove(); // Clean up thread hooks when screen unmounts
    };
  }, []);

  return { isNfcActive, checking, reCheck: runHardwareAudit };
}
