import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import {
  identifyNfcChipArchitecture,
  SFCChipType,
} from "../utils/nfcIdentifier";

interface NfcContextType {
  scanResults: { token: string; chipType: SFCChipType } | null;
  registerScreenInterceptor: (isIntercepting: boolean) => void;
  resetGlobalScanner: () => void;
}

const NfcContext = createContext<NfcContextType | undefined>(undefined);

export type ScanResults = {
  token: string;
  chipType: SFCChipType;
};

function NFCProvider({ children }: { children: React.ReactNode }) {
  const [scanResults, setScanResults] = useState<ScanResults | null>(null);

  // Clean single-source mutable state tracker keys
  const isScreenIntercepting = useRef(false);
  const isHardwarePollerBusy = useRef(false);
  const isAuthenticated = useRef(false);

  useEffect(() => {
    // 1. Initialize the physical hardware controller once on boot
    NfcManager.start().catch(() =>
      console.warn("NFC hardware failure on boot."),
    );

    // 2. Track user authentication lifecycle parameter shifts
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      isAuthenticated.current = !!user;
      if (!user) {
        NfcManager.cancelTechnologyRequest().catch(() => {});
      }
    });

    // 3. THE FIXED HEARTBEAT INJECTOR: Replaces risky infinite recursion loops
    const pollingInterval = setInterval(async () => {
      // Safely skip this heartbeat beat if user is logged out, busy reading, or a screen claimed control
      if (
        !isAuthenticated.current ||
        isScreenIntercepting.current ||
        isHardwarePollerBusy.current
      ) {
        return;
      }

      try {
        isHardwarePollerBusy.current = true;

        // Wake up hardware link for a brief, safe 1-second scanning pass window
        await NfcManager.requestTechnology([NfcTech.Ndef, NfcTech.NfcA]);
        const tag = await NfcManager.getTag();

        if (tag && tag.id && !isScreenIntercepting.current) {
          const chipType = identifyNfcChipArchitecture(tag);
          setScanResults({ token: tag.id, chipType });
        }
      } catch (error) {
        // Expected quiet path timeouts when no physical card is placed near the device
      } finally {
        // Enforce an immediate clean hardware clear out sequence
        await NfcManager.cancelTechnologyRequest().catch(() => {});
        isHardwarePollerBusy.current = false;
      }
    }, 2000); // Heartbeat executes every 2 seconds cleanly

    return () => {
      unsubscribeAuth();
      clearInterval(pollingInterval);
      NfcManager.cancelTechnologyRequest().catch(() => {});
    };
  }, []);

  const registerScreenInterceptor = (isIntercepting: boolean) => {
    isScreenIntercepting.current = isIntercepting;

    // If a local screen takes over, immediately clear the current global poller pass channel
    if (isIntercepting) {
      NfcManager.cancelTechnologyRequest().catch(() => {});
    }
  };

  return (
    <NfcContext.Provider
      value={{
        scanResults,
        registerScreenInterceptor,
        resetGlobalScanner: () => setScanResults(null),
      }}
    >
      {children}
    </NfcContext.Provider>
  );
}

export default NFCProvider;
export function useGlobalNFC() {
  const context = useContext(NfcContext);
  if (!context)
    throw new Error(
      "useGlobalNfc must be executed strictly inside an NfcProvider",
    );
  return context;
}
