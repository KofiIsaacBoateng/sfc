import Lottie from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, Text } from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("screen");
const ValidateProduct = ({
  validate,
}: {
  validate: (status: boolean) => void;
}) => {
  const { bottom, top } = useSafeAreaInsets();
  const [state, setState] = useState<
    "waiting" | "reading" | "validating" | "completed"
  >("waiting");
  const [success, setSucess] = useState<boolean | undefined>(undefined);

  const validateNFC = () => {
    // validate nfc here
    const validated = Math.random() >= 0.9;
    setTimeout(() => {
      setState("reading");
      setTimeout(() => {
        setState("validating");
        setTimeout(() => {
          setState("completed");
          setSucess(validated);
          setTimeout(() => {
            validate(validated);
          }, 2000);
        }, 4000);
      }, 4000);
    }, 4000);
  };

  useEffect(() => {
    validateNFC();
  }, []);

  return (
    <Animated.View
      entering={SlideInDown}
      exiting={SlideOutDown.duration(500)}
      style={[
        styles.container,
        { paddingTop: top + 30, paddingBottom: bottom + 10 },
      ]}
    >
      {/**** animation */}
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
            style={[styles.lottie, { height: height * 0.9 }]}
          />
        ) : (
          <></>
        )
      ) : state === "reading" || state === "validating" ? (
        <Lottie
          source={require("@/assets/animations/nfc-loading.json")}
          autoPlay
          loop
          speed={2}
          style={[styles.lottie, { opacity: 0.7, height: height * 0.5 }]}
        />
      ) : success === true ? (
        <Lottie
          source={require("@/assets/animations/success.json")}
          autoPlay
          loop={false}
          duration={1800}
          style={[styles.lottie, { height: height * 0.4, opacity: 0.8 }]}
        />
      ) : success === false ? (
        <Lottie
          source={require("@/assets/animations/error.json")}
          autoPlay
          loop={false}
          duration={1800}
          style={[styles.lottie, { height: height * 0.5, opacity: 0.8 }]}
        />
      ) : (
        <></>
      )}

      <Text style={styles.status}>
        {state === "waiting"
          ? "Place product at the back of phone as shown above..."
          : state === "reading"
            ? "Product detected. Hold steady..."
            : state === "validating"
              ? "Validating... (you can release device now)"
              : success === true
                ? "Product validated!"
                : success === false
                  ? "Validation failed!"
                  : "Process completed!"}
      </Text>
    </Animated.View>
  );
};

export default ValidateProduct;

const styles = StyleSheet.create({
  container: {
    zIndex: 50,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    position: "absolute",
    inset: 0,
  },

  lottie: {
    height: height * 0.7,
    aspectRatio: 1,
  },

  status: {
    color: "#ffffffcc",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "300",
    marginTop: 15,
    marginHorizontal: 30,
  },
});
