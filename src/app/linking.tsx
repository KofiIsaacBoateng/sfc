import {
  ModalNotification,
  ToastNotification,
} from "@/components/global/Notification";
import CheckList from "@/components/linking/CheckList";
import ValidateProduct from "@/components/linking/ValidateProduct";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";

interface Status {
  supported: boolean | undefined;
  enabled: boolean | undefined;
  validated: boolean | undefined;
  linked: boolean | undefined;
}
const linking = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [toast, setToast] = useState<{ type: "error" | "info" | "success"; message: string } | undefined>(undefined);
  const [isCheckingSupport, setIsCheckingSupport] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({
    supported: undefined,
    enabled: undefined,
    validated: undefined,
    linked: undefined,
  });

  const checkSupport = () => {
    // support logic with react-native-nfc goes here

    // simulating check
    setLoading(true);
    setIsCheckingSupport(true);
    const isSupported = Math.random() <= 0.5;
    setTimeout(() => {
      setIsCheckingSupport(false);
      setLoading(false);
      if (isSupported) {
        setCurrentStage((prev) => prev + 1);
        setStatus((prev) => ({ ...prev, supported: true }));
      } else {
        setToast({
          type: "error",
          message: "You device does not support NFC.",
        });
        setStatus((prev) => ({ ...prev, supported: false }));
      }
    }, 3000);
  };

  const enableNFC = () => {
    // check if nfc is on
    // if not redirect user to device settings to turn on nfc

    // simulating wait
    setLoading(true);
    setIsEnabling(true);
    const isEnabled = Math.random() <= 0.5;
    setTimeout(() => {
      setIsEnabling(false);
      setLoading(false);
      if (isEnabled) {
        setCurrentStage((prev) => prev + 1);
        setStatus((prev) => ({ ...prev, enabled: true }));
      } else {
        setToast({
          type: "error",
          message: "NFC is still offline.",
        });
        setStatus((prev) => ({ ...prev, enabled: false }));
      }
    }, 3000);
  };

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

    setCurrentStage((prev) => prev + 1);
  };

  const registerDevice = () => {
    setStatus((prev) => ({ ...prev, linked: true }));
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      setShowIntro(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/**** intro */}
      {showIntro ? (
        <Intro />
      ) : (
        <CheckList
          stage={currentStage}
          status={status}
          ctas={[checkSupport, enableNFC, initiateValidation, registerDevice]}
          loading={loading}
        />
      )}

      {/***** NOTIFICATION ZONE */}
      {/**** checking support modal */}
      <ModalNotification
        visible={isCheckingSupport}
        close={() => {
          setIsCheckingSupport(false);
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <ActivityIndicator size={70} color="#ffffff" />
          <Text style={{ color: "#ffffffcc", fontSize: 18 }}>
            Checking device support...
          </Text>
        </View>
      </ModalNotification>

      {/*** NFC online or offline modal */}
      <ModalNotification
        visible={isEnabling}
        close={() => {
          setIsEnabling(false);
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
          }}
        >
          <ActivityIndicator size={70} color="#ffffff" />
          <Text style={{ color: "#ffffffcc", fontSize: 18 }}>
            Waiting for NFC to come online
          </Text>
        </View>
      </ModalNotification>

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

const Intro = () => {
  return (
    <Animated.View
      entering={SlideInDown.duration(500)}
      exiting={SlideOutUp.duration(500)}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "900",
          color: "#ffffffcc",
          textAlign: "center",
        }}
      >
        Link{" "}
        <Text style={{ fontWeight: "300" }}>your product to your account</Text>
      </Text>
    </Animated.View>
  );
};

export default linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
