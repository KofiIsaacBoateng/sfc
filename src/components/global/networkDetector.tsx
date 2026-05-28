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
  title,
}: {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
  borderColor?: string;
  phoneNumber: string;
  title?: boolean;
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
        { opacity: detected ? 0.7 : 0.3, borderColor },
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
      {title && <Text style={styles.title}>{detected}</Text>}
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
    minHeight: 40,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  image: {
    width: 30,
    height: 30,
    objectFit: "contain",
    zIndex: 50,
  },

  title: {
    fontSize: 16,
    color: "#ffffffcc",
    textTransform: "uppercase",
    fontWeight: "400",
  },
});
