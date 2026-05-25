import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

const RoundBtn = ({
  onPress,
  style,
  loading,
  disabled,
}: {
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}) => {
  return (
    <Pressable
      disabled={disabled || loading}
      style={[
        styles.roundBtn,
        style,
        { backgroundColor: disabled ? "#0d0d0d" : "#be10ac" },
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator
          size="large"
          color={disabled ? "#ffffff44" : "#ffffffcc"}
        />
      ) : (
        <Ionicons
          name="arrow-forward"
          size={20}
          color={disabled ? "#ffffff44" : "#ffffffcc"}
        />
      )}
    </Pressable>
  );
};

const TextBtn = ({
  title,
  style,
  onPress,
}: {
  title: string;
  style?: ViewStyle;
  onPress: () => void;
}) => {
  return (
    <Pressable style={style} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

export { RoundBtn, TextBtn };

const styles = StyleSheet.create({
  roundBtn: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#be10ac",
  },
  text: {
    color: "#ffffffcc",
    fontWeight: "300",
    textTransform: "capitalize",
    fontSize: 16,
  },
});
