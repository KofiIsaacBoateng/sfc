import { NETWORK_CODES } from "@/constants/constants";
import React from "react";
import {
  Image,
  ImageStyle,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const NetworkDetector = ({
  containerStyle,
  imageStyle,
  borderColor,
  phoneNumber,
}: {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  borderColor?: string;
  phoneNumber: string;
}) => {
  let detected = NETWORK_CODES.mtn.includes(phoneNumber.slice(0, 3))
    ? "mtn"
    : NETWORK_CODES.telecel.includes(phoneNumber.slice(0, 3))
      ? "telecel"
      : null;
  return (
    <View
      style={[
        styles.container,
        { opacity: detected ? 1 : 0.5, borderColor },
        containerStyle,
      ]}
    >
      {detected === "mtn" ? (
        <Image
          style={[styles.image, imageStyle]}
          source={require(`@/assets/images/networks/mtn.png`)}
        />
      ) : detected === "telecel" ? (
        <Image
          style={[styles.image, imageStyle]}
          source={require(`@/assets/images/networks/telecel.png`)}
        />
      ) : (
        <Text style={{ color: borderColor, fontSize: 25 }}>---</Text>
      )}
    </View>
  );
};

export default NetworkDetector;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ffffffcc",
    borderRadius: 5,
    minWidth: 40,
    aspectRatio: 1,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 30,
    height: 30,
    objectFit: "contain",
    zIndex: 50,
  },
});
