import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomSwitch from "../global/Switch";

const Header = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
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
        <Image
          source={{
            uri: "https://api.dicebear.com/10.x/toon-head/png?seed=kofi-boateng",
          }}
          style={{
            width: 40,
            aspectRatio: 1,
            borderRadius: 50,
            marginRight: 5,
          }}
        />
        <Text style={styles.greeting}>Hello, Kofi</Text>
        <Ionicons name="shield-checkmark-outline" color="#82a2d1" size={15} />
      </View>

      {/* right */}
      <View style={styles.right}>
        <View style={styles.merchantMode}>
          <Text style={styles.merchantModeText}>2M</Text>
          <CustomSwitch onToggle={toggleMerchantMode} value={isMerchantMode} />
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
  },

  merchantMode: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },

  merchantModeText: {
    fontSize: 18,
    fontFamily: "Jakarta-SemiBold",
    color: "#ffffffcc",
  },
});
