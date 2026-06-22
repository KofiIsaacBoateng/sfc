import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const DigiCard = () => {
  const [isCardFrozen, setIsCardFrozen] = useState(false);

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.walletCard}>
      <View style={styles.balanceWrapper}>
        <Text style={styles.balanceLabel}>Prepaid Balance</Text>
        <Text style={styles.balanceAmount}>GHS 154.00</Text>
      </View>

      <View style={styles.cardId}>
        <Text style={[styles.cardIdText, { fontSize: 40, fontWeight: "100" }]}>
          ****
        </Text>
        <Text style={[styles.cardIdText, { fontSize: 40, fontWeight: "100" }]}>
          ****
        </Text>
        <Text style={[styles.cardIdText, { fontSize: 40, fontWeight: "100" }]}>
          ****
        </Text>
        <Text style={styles.cardIdText}>424D</Text>
        {/* <View style={styles.freezeControl}>
          <Text style={styles.freezeText}>Lock Tag</Text>
          <Switch
            value={isCardFrozen}
            onValueChange={setIsCardFrozen}
            trackColor={{ false: "#334155", true: "#1E293B" }}
          />
        </View> */}
      </View>
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {isCardFrozen ? "FROZEN" : "ACTIVE"}
          </Text>
        </View>
        <Text style={styles.cardBrand}>sfc</Text>
      </View>
    </Animated.View>
  );
};

export default DigiCard;

const styles = StyleSheet.create({
  walletCard: {
    backgroundColor: "#080c11",
    borderRadius: 15,
    padding: 24,
    height: 200,
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#ffffff23",
    borderTopColor: "#ffffff23",
    borderBottomColor: "#616e83cc",
    borderLeftColor: "#616e83cc",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardBrand: {
    color: "#64748B",
    fontSize: 25,
    fontWeight: "300",
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: "#1E293B",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: { color: "#00A896", fontSize: 10, fontWeight: "800" },

  balanceWrapper: {},
  balanceLabel: { color: "#94A3B8", fontSize: 13, fontWeight: "500" },
  balanceAmount: {
    color: "#ffffffcc",
    fontSize: 22,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  cardId: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: "auto",
  },
  cardIdText: { color: "#64748B", fontSize: 22, fontWeight: "300" },
  freezeControl: { flexDirection: "row", alignItems: "center", gap: 8 },
  freezeText: { color: "#94A3B8", fontSize: 12, fontWeight: "600" },
});
