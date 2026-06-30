import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Header = () => {
  const { top } = useSafeAreaInsets();
  const [isMerchantMode, setIsMerchantMode] = useState(false);

  const toggleMerchantMode = () => {
    if (!isMerchantMode) {
      setIsMerchantMode(true);
      invokeMerchantMode();
      return;
    }
    setIsMerchantMode(false);
  };
  const invokeMerchantMode = () => {
    router.navigate("/merchant");
  };

  useFocusEffect(() => {
    setIsMerchantMode(false);
  });

  return (
    <View style={[styles.headerwrapper, { paddingTop: top + 20 }]}>
      {/* left */}
      <View style={styles.left}>
        <Text style={styles.greeting}>Hello, Kofi</Text>
        <Ionicons name="shield-checkmark-outline" color="#82a2d1" size={15} />
      </View>

      {/* right */}
      <View style={styles.right}>
        <View style={styles.merchantMode}>
          <Text style={styles.merchantModeText}>2M</Text>
          <Switch
            value={isMerchantMode}
            onValueChange={toggleMerchantMode}
            trackColor={{ false: "#151c29", true: "#00A896" }}
            thumbColor={isMerchantMode ? "#FFFFFF" : "#64748B"}
          />
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerwrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#000000",
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginBottom: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },

  greeting: {
    color: "#ffffffcc",
    fontSize: 18,
    fontFamily: "Jakarta-SemiBold",
    letterSpacing: 1,
  },

  merchantMode: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  merchantModeText: {
    fontSize: 18,
    fontFamily: "Jakarta-Regular",
    color: "#ffffffcc",
  },
});
