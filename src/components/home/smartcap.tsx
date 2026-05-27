import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const SmartCap = () => {
  return (
    <View style={styles.limitSection}>
      <Text style={styles.sectionTitle}>Tap Security Limit</Text>
      <View style={styles.limitCard}>
        <View style={styles.limitInfo}>
          <Text style={styles.limitSub}>PIN-less Contactless Cap</Text>
          <Text style={styles.limitValue}>GHS 20.00 / tap</Text>
        </View>
        <Pressable style={styles.editBtn}>
          <Text style={styles.editBtnText}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SmartCap;

const styles = StyleSheet.create({
  limitSection: { marginBottom: 40 },
  sectionTitle: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  limitCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: "#0F172A",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#616e83b0",
  },
  limitInfo: { gap: 4 },
  limitSub: { color: "#94A3B8", fontSize: 13, fontWeight: "500" },
  limitValue: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  editBtn: {
    backgroundColor: "#1E293B",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  editBtnText: { color: "#00A896", fontSize: 13, fontWeight: "700" },
});
