import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const DigiCard = () => {
  const [isCardFrozen, setIsCardFrozen] = useState(false);
  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.walletCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardBrand}>sfc</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isCardFrozen ? "FROZEN" : "ACTIVE"}
          </Text>
        </View>
      </View>

      <View style={styles.balanceWrapper}>
        <Text style={styles.balanceLabel}>Prepaid Balance</Text>
        <Text style={styles.balanceAmount}>GHS 154.00</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.hardwareId}>Tag UID: •••• 424D</Text>
        <View style={styles.freezeControl}>
          <Text style={styles.freezeText}>Lock Tag</Text>
          <Switch
            value={isCardFrozen}
            onValueChange={setIsCardFrozen}
            trackColor={{ false: "#334155", true: "#1E293B" }}
          />
        </View>
      </View>
    </Animated.View>
  );
};

export default DigiCard;

const styles = StyleSheet.create({
  walletCard: {
    // backgroundColor: "#0F172A",
    borderRadius: 24,
    padding: 24,
    height: 200,
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBrand: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: "#1E293B",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: { color: "#00A896", fontSize: 10, fontWeight: "800" },
  balanceWrapper: { marginVertical: 10 },
  balanceLabel: { color: "#94A3B8", fontSize: 13, fontWeight: "500" },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    paddingTop: 14,
  },
  hardwareId: { color: "#64748B", fontSize: 12, fontWeight: "600" },
  freezeControl: { flexDirection: "row", alignItems: "center", gap: 8 },
  freezeText: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
});
