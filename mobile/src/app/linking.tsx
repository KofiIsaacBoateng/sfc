import Intro from "@/components/global/Intro";
import { ToastNotification } from "@/components/global/Notification";
import CheckList from "@/components/linking/CheckList";
import { useGlobalNFC } from "@/context/NFCContext";
import { useNfcPermissionLifecycle } from "@/hooks/useNFCPermissions";
import {
  checkNFCHardwareSupport,
  readSFCPayload,
  verifyAndEnableNfcAntenna,
} from "@/utils/nfc";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import nfcManager from "react-native-nfc-manager";

interface Status {
  supported: boolean | undefined;
  enabled: boolean | undefined;
  validated: boolean | undefined;
  linked: boolean | undefined;
}
const linking = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [toast, setToast] = useState<
    { type: "error" | "info" | "success"; message: string } | undefined
  >(undefined);
  const { isNfcActive, checking } = useNfcPermissionLifecycle();
  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(false);
  const isScreenActive = useRef(true);
  const [secureToken, setSecureToken] = useState<string | null>(null);
  const { registerScreenInterceptor } = useGlobalNFC();
  const [status, setStatus] = useState<Status>({
    supported: undefined,
    enabled: undefined,
    validated: undefined,
    linked: undefined,
  });
  // const { scanState } = useGlobalNFC();
  useEffect(() => {
    // Turn on intercept mode the microsecond this screen mounts!
    // This blocks the global quick-actions popup from interrupting this process.
    isScreenActive.current = true;
    registerScreenInterceptor(true);

    return () => {
      // Release control back to the global engine when the user exits this screen
      isScreenActive.current = false;
      registerScreenInterceptor(false);
      nfcManager.cancelTechnologyRequest().catch(() => {}); // Force-close the radio wave thread silently
    };
  }, []);

  // check if device has hardware nfc support
  const checkSupport = async () => {
    // support logic with react-native-nfc goes here
    setLoading(true);

    const supported = await checkNFCHardwareSupport();

    setStatus((prev) => ({ ...prev, supported }));
    if (supported) {
      setCurrentStage(1);
      setLoading(false);
      enableNFC();
      return;
    }

    setLoading(false);
  };

  // turn of nfc cycle
  const enableNFC = async () => {
    setLoading(true);
    if (!isNfcActive) {
      // If it is off, execute our alert from item 2 to redirect them back to settings
      await verifyAndEnableNfcAntenna();
      setLoading(false);
      return;
    }

    setStatus((prev) => ({ ...prev, enabled: isNfcActive }));
    setCurrentStage(2);
    setLoading(false);
    validateProduct();
  };

  useEffect(() => {
    if (currentStage === 1) {
      enableNFC();
      return;
    }

    // if user turns off while on stage 3, return back to stage 2
    if (currentStage > 1 && !isNfcActive) {
      setCurrentStage(1);
    }
  }, [isNfcActive, currentStage]);

  // verify sfc hardware
  const initiateValidation = () => {
    // slide up validation screen
    setIsValidating(true);
  };

  const validateProduct = async () => {
    setLoading(true);

    try {
      // Triggers the active radio loop
      const securedCardToken = await readSFCPayload(isScreenActive);

      if (securedCardToken) {
        console.log(
          "🚀 [NFC METRICS]: Card Payload Extracted:",
          securedCardToken,
        );

        // 🎯 SUCCESS: Pass the payload instantly into Item 4 (Registering the card on the database server)
        setSecureToken(securedCardToken);
        registerHardware(securedCardToken);
        setStatus((prev) => ({ ...prev, validated: true }));
        setCurrentStage(3);
        return;
      }

      setStatus((prev) => ({ ...prev, validated: false }));
    } catch (error) {
      console.error("Scan execution error: ", error);
      setStatus((prev) => ({ ...prev, validated: false }));
    } finally {
      setLoading(false);
    }
  };

  const registerHardware = (token: string | null) => {
    setStatus((prev) => ({ ...prev, linked: true }));
  };

  return (
    <View style={styles.container}>
      {/**** intro */}
      {showIntro ? (
        <Intro exit={() => setShowIntro(false)}>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Jakarta-Bold",
              color: "#ffffffcc",
              textAlign: "center",
            }}
          >
            Link{" "}
            <Text style={{ fontFamily: "Jakarta-Regular" }}>
              your product to your account
            </Text>
          </Text>
        </Intro>
      ) : (
        <CheckList
          stage={currentStage}
          status={status}
          ctas={[
            checkSupport,
            enableNFC,
            validateProduct,
            () => registerHardware(secureToken),
          ]}
          loading={loading}
        />
      )}

      {/***** NOTIFICATION ZONE */}

      {/****** validate nfc */}
      {/* {isValidating && <ValidateProduct validate={validateProduct} />} */}

      {toast && (
        <ToastNotification
          type={toast?.type || "info"}
          message={toast?.message || ""}
          hide={() => setToast(undefined)}
          visible={toast !== undefined}
        />
      )}
    </View>
  );
};

export default linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
