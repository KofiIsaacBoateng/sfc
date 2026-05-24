import { RoundBtn } from "@/components/onboarding/buttons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");
const UserRole = () => {
  const { bottom, top } = useSafeAreaInsets();
  const [selected, setSelected] = useState<undefined | "user" | "merchant">(
    undefined,
  );

  const handleSelected = (option: undefined | "user" | "merchant") => {
    setSelected(option);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom + 10, paddingTop: top + 50 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>What’s your focus today?</Text>
        <Text style={styles.headerSubtext}>
          Choose an option to customize your setup.
        </Text>
      </View>

      <View style={styles.cards}>
        <Pressable
          onPress={() => setSelected("user")}
          style={[
            styles.card,
            { borderColor: selected === "user" ? "#ffffffcc" : "#ffffff44" },
          ]}
        >
          <View style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Daily Cruise</Text>
            <Text style={styles.contentSubtext}>
              I want a quick, secure way to pay for my daily transit, shopping,
              and retail spends.
            </Text>
          </View>
          <View
            style={[
              styles.activeIndicator,
              {
                backgroundColor:
                  selected === "user" ? "#ffffffcc" : "transparent",
              },
            ]}
          >
            <View style={styles.innerCircle} />
          </View>
        </Pressable>

        <Pressable
          onPress={() => setSelected("merchant")}
          style={[
            styles.card,
            {
              borderColor: selected === "merchant" ? "#ffffffcc" : "#ffffff44",
            },
          ]}
        >
          <View style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Business Boost</Text>
            <Text style={styles.contentSubtext}>
              I want a frictionless, pocket-sized POS to collect instant
              cashless payments from clients.
            </Text>
          </View>

          <View
            style={[
              styles.activeIndicator,
              {
                backgroundColor:
                  selected === "merchant" ? "#ffffff" : "transparent",
              },
            ]}
          >
            <View style={styles.innerCircle} />
          </View>
        </Pressable>
      </View>

      {/**** ctx */}
      <RoundBtn
        style={{ marginLeft: "auto", marginTop: 30 }}
        onPress={() => router.navigate("/authentication")}
      />
    </View>
  );
};

export default UserRole;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    paddingHorizontal: 10,
    backgroundColor: "#000000",
  },
  header: {
    marginBottom: 70,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: 0.1,
    color: "#ffffffcc",
  },
  headerSubtext: {
    textAlign: "center",
    fontSize: 16,
    color: "#ffffffcc",
    marginTop: 5,
  },
  cards: {
    width: "100%",
    gap: 60,
  },
  card: {
    width: "100%",
    paddingRight: 15,
    paddingLeft: 60,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 15,
  },
  image: {
    position: "absolute",
    top: -15,
    bottom: -10,
    width: 30,
    marginLeft: 10,
    transform: [{ rotate: "15deg" }],
    backgroundColor: "gray",
  },
  content: {
    gap: 10,
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    letterSpacing: 1,
    color: "#ffffffcc",
    fontWeight: "900",
    textTransform: "uppercase",
  },
  contentSubtext: {
    fontSize: 15,
    color: "#ffffffcc",
    fontWeight: "600",
    lineHeight: 25,
  },

  activeIndicator: {
    width: 20,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ffffff",
    marginVertical: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "#000000",
  },
});
