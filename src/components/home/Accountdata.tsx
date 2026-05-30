import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AccountData = ({
  goBack,
  amount,
  phoneNumber,
}: {
  goBack: () => void;
  amount: string;
  phoneNumber: string;
}) => {
  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();
  const [status, setStatus] = useState<"confirm" | "sending">("confirm");
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
          {status === "confirm" ? "Confirm Payment" : "Processing Payment"}
        </Text>
      </View>

      {/* content */}
      <View style={styles.content}>
        {/*** centered image */}
        <Animated.View style={styles.image}></Animated.View>
        {/*** first layer details */}
        <Animated.View style={[styles.outlier, styles.details]}>
          <Animated.Text style={[styles.detail, styles.name]}>
            Kofi Boateng
          </Animated.Text>
          <Animated.Text style={[styles.detail, styles.amount]}>
            GHS 400.00
          </Animated.Text>
        </Animated.View>

        {/***** final layer details */}
        <Animated.View style={[styles.outlier, styles.progress]}>
          <Animated.View style={[styles.progressIndicator, styles.loader]}>
            <ActivityIndicator size={"small"} color={"#ffffffcc"} />
          </Animated.View>

          <Animated.View
            style={[styles.progressIndicator, styles.statusIndicator]}
          >
            <FontAwesome6 name="check" size={24} color={"#10be10"} />
          </Animated.View>
        </Animated.View>

        {/**** footer */}
        <View style={[styles.footer, { paddingBottom: bottom + 10 }]}>
          <Pressable onPress={goBack} style={[styles.btn, styles.cancel]}>
            <Text style={[styles.btnText, styles.cancelText]}>Cancel</Text>
          </Pressable>
          <Pressable onPress={goBack} style={[styles.btn, styles.confirm]}>
            <Text style={[styles.btnText]}>Confirm</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default AccountData;

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

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    inset: 0,
  },

  image: {
    width: 120,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: "#ffffffaa",
    position: "absolute",
  },

  outlier: {
    position: "absolute",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#ffffff44",
    borderRadius: 500,
    width: 150,
    aspectRatio: 1,
  },

  details: {
    width: 200,
  },

  detail: {
    color: "#ffffffcc",
    fontSize: 20,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    backgroundColor: "#090d13",
  },

  name: {
    top: -9,
  },

  amount: {
    bottom: -9,
  },

  progress: {
    width: 350,
    alignItems: "center",
  },

  progressIndicator: {
    position: "absolute",
    marginHorizontal: "auto",
    textAlign: "center",
    backgroundColor: "#1E293B",
    borderRadius: 50,
    width: 50,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loader: {
    top: -25,
  },

  statusIndicator: {
    bottom: -25,
  },

  footer: {
    marginTop: "auto",
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 15,
  },

  btn: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },

  btnText: {
    color: "#ffffffcc",
    fontSize: 16,
    fontWeight: "700",
  },

  confirm: {
    backgroundColor: "#491c77",
  },

  cancel: {},

  cancelText: {
    color: "#c76767",
  },
});
