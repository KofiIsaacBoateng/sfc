import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import NfcManager from "react-native-nfc-manager";

export function useNfcPermissionLifecycle() {
  const [isNfcActive, setIsNfcActive] = useState(false);
  const [checking, setChecking] = useState(true);

  // Standalone verification function that checks both physical metrics sequentially
  const checkNFCEnabled = async () => {
    try {
      const enabled = await NfcManager.isEnabled();
      setIsNfcActive(enabled);
    } catch (error) {
      setIsNfcActive(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkNFCEnabled();

    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        // If the app is transitioning back from background settings panels to the foreground view
        if (nextAppState === "active") {
          setChecking(true);
          console.log(
            "[NFC LIFECYCLE]: App foregrounded. Re-auditing antenna states...",
          );
          checkNFCEnabled();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return { isNfcActive, checking, reCheck: checkNFCEnabled };
}
