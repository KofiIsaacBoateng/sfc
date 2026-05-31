import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ScanSFC = ({ goBack }: { goBack: () => void }) => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const [status, setStatus] = useState<"waiting" | "scanning" | "processing">(
    "waiting",
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      e.preventDefault();
      goBack();
    });

    return unsubscribe;
  }, []);

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      style={[styles.container, { paddingTop: top + 30 }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={goBack}>
          <FontAwesome6 name="angle-left" color="#ffffffac" size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {status === "waiting"
            ? "Waiting for sfc"
            : status === "scanning"
              ? "Scanning"
              : "Processing Data"}
        </Text>
      </View>
    </Animated.View>
  );
};

export default ScanSFC;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    inset: 0,
    backgroundColor: "#090d13",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },

  headerTitle: {
    color: "#ffffffcc",
    marginHorizontal: "auto",
    fontSize: 18,
    fontWeight: "400",
  },
});
