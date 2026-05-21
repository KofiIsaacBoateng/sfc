import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

const RoundBtn = ({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: ViewStyle;
}) => {
  return (
    <Pressable style={[styles.roundBtn, style]} onPress={onPress}>
      <Ionicons name="arrow-forward" size={20} color="#ffffffcc" />
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
    fontWeight: "600",
    textTransform: "capitalize",
    fontSize: 16,
  },
});
