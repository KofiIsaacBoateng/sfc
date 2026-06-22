import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const myqr = () => {
  const { bottom, top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + 30, paddingBottom: bottom + 10 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <FontAwesome6 name="angle-left" color="#ffffffac" size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>My QR</Text>
      </View>

      <View style={styles.contentWrapper}>
        <View style={styles.content}>
          <View style={styles.crossv} />
          <View style={styles.crossh} />
        </View>
        <MaterialCommunityIcons
          style={{ position: "absolute" }}
          name="qrcode"
          size={300}
          color={"#ffffff"}
        />
      </View>
    </View>
  );
};

export default myqr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d13",
    paddingHorizontal: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#ffffffcc",
    marginHorizontal: "auto",
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 1.5,
  },

  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    width: "80%",
    aspectRatio: 1,
    borderWidth: 5,
    borderRadius: 20,
    borderColor: "#ffffff",
    alignItems: "center",
  },

  crossv: {
    position: "absolute",
    top: -20,
    bottom: -20,
    alignSelf: "center",
    width: "75%",
    backgroundColor: "#090d13",
  },

  crossh: {
    position: "absolute",
    top: -20,
    bottom: -20,
    alignSelf: "center",
    width: "75%",
    backgroundColor: "#090d13",
    transform: [{ rotate: "90deg" }],
  },
});
