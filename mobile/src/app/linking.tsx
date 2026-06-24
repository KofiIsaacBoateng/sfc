import Intro from "@/components/global/Intro";
import { ToastNotification } from "@/components/global/Notification";
import CheckList from "@/components/linking/CheckList";
import ValidateProduct from "@/components/linking/ValidateProduct";
import { useNfcPermissionLifecycle } from "@/hooks/useNFCPermissions";
import {
  checkNFCHardwareSupport,
  verifyAndEnableNfcAntenna,
} from "@/utils/nfc";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const [status, setStatus] = useState<Status>({
    supported: undefined,
    enabled: undefined,
    validated: undefined,
    linked: undefined,
  });

  // check if device has hardware nfc support
  const checkSupport = async () => {
    // support logic with react-native-nfc goes here
    setLoading(true);

    const supported = await checkNFCHardwareSupport();

    setStatus((prev) => ({ ...prev, supported }));
    if (supported) {
      setCurrentStage(1);
      enableNFC();
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
    validateProduct(true);
    setLoading(false);
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

  const initiateValidation = () => {
    // slide up validation screen
    setIsValidating(true);
  };

  const validateProduct = (value: boolean) => {
    // update checklist status
    setIsValidating(false);
    setStatus((prev) => ({ ...prev, validated: value }));
    if (!value) {
      setToast({
        type: "error",
        message: "NFC is invalid and is probably not secure!",
      });
      return;
    }

    setCurrentStage(3);
    registerDevice();
  };

  const registerDevice = () => {
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
          ctas={[checkSupport, enableNFC, initiateValidation, registerDevice]}
          loading={loading}
        />
      )}

      {/***** NOTIFICATION ZONE */}

      {/****** validate nfc */}
      {isValidating && <ValidateProduct validate={validateProduct} />}

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
