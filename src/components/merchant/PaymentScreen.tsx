import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import Lottie from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("screen");
const PaymentScreen = ({
  amount,
  goBack,
}: {
  amount: number;
  goBack: () => void;
}) => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const [state, setState] = useState<
    "waiting" | "reading" | "processing" | "completed"
  >("waiting");
  const [success, setSucess] = useState<boolean | undefined>(undefined);

  const validateNFC = () => {
    // validate nfc here
    const validated = Math.random() >= 0.3;
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setState("reading");
      setTimeout(() => {
        setState("processing");
        setTimeout(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          setState("completed");
          setSucess(validated);
          setTimeout(() => {
            if (validated) {
              goBack();
            }
          }, 2000);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  function tryAgain() {
    setSucess(undefined);
    setState("waiting");
    validateNFC();
  }

  useEffect(() => {
    validateNFC();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      goBack();
    });

    return unsubscribe;
  }, []);

  return (
    <Animated.View
      entering={SlideInDown.delay(500)}
      exiting={SlideOutUp.duration(500)}
      style={[styles.container]}
    >
      <Pressable
        onPress={goBack}
        style={{ marginLeft: "auto", marginBottom: 20 }}
      >
        <Text style={{ color: "#ffffff87", fontSize: 16, fontWeight: "500" }}>
          cancel
        </Text>
      </Pressable>
      {/**** animation */}
      <View style={styles.contentWrapper}>
        {state === "waiting" ? (
          Platform.OS === "android" ? (
            <Lottie
              source={require("@/assets/animations/card-android.json")}
              autoPlay
              loop
              style={styles.lottie}
            />
          ) : Platform.OS === "ios" ? (
            <Lottie
              source={require("@/assets/animations/card-ios.json")}
              autoPlay
              loop
              duration={1000}
              style={[styles.lottie]}
            />
          ) : (
            <></>
          )
        ) : state === "reading" || state === "processing" ? (
          <Lottie
            source={require("@/assets/animations/nfc-loading.json")}
            autoPlay
            loop
            speed={2}
            style={[styles.lottie, { opacity: 0.7 }]}
          />
        ) : success === true ? (
          <Lottie
            source={require("@/assets/animations/success.json")}
            autoPlay
            loop
            duration={1800}
            style={[styles.lottie, { opacity: 0.8 }]}
          />
        ) : success === false ? (
          <Lottie
            source={require("@/assets/animations/error.json")}
            autoPlay
            loop={false}
            duration={1800}
            style={[styles.lottie, { opacity: 0.8 }]}
          />
        ) : (
          <></>
        )}
        <Text style={styles.status}>
          {state === "waiting" ? (
            <Text>
              Paying an amount of:{" "}
              <Text style={{ fontWeight: "900", fontSize: 25 }}>{amount}</Text>
            </Text>
          ) : state === "reading" ? (
            "Product detected. Hold steady..."
          ) : state === "processing" ? (
            "Processing payment..."
          ) : success === true ? (
            "Payment process completed!"
          ) : success === false ? (
            "Payment failed!"
          ) : (
            "Process completed!"
          )}
        </Text>
      </View>

      {success === false && state === "completed" && (
        <Pressable onPress={tryAgain} style={[styles.cta]}>
          <Text style={styles.ctaText}>Try again</Text>
        </Pressable>
      )}
    </Animated.View>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  lottie: {
    width: width,
    aspectRatio: 1,
    marginHorizontal: "auto",
  },

  contentWrapper: {
    flexShrink: 1,
    flexGrow: 0,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: "auto",
  },

  status: {
    color: "#ffffffcc",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "300",
    marginTop: 15,
    marginHorizontal: 30,
  },

  cta: {
    marginTop: "auto",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
    backgroundColor: "#ee696989",
  },

  ctaText: {
    color: "#ffffffcc",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
