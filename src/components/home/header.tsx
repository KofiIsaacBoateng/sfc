import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Header = () => {
  const invokeMerchantMode = () => {
    router.navigate("/merchant");
  };

  return (
    <View style={styles.wrapper}>
      {/**** left */}
      <View style={styles.left}>
        <Text style={{ color: "#ffffffcc", fontSize: 25, fontWeight: "300" }}>
          Home
        </Text>
      </View>
      {/***** right */}
      <View style={styles.right}>
        <Pressable onPress={invokeMerchantMode} style={styles.merchantMode}>
          <Text style={styles.merchantModeText}>Merchant mode</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {},
  right: {},
  merchantMode: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    // backgroundColor: "#be10ac",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  merchantModeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#be10ac",
  },
});
