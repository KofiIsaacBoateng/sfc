import DigiCard from "@/components/home/digicard";
import Header from "@/components/home/header";
import SmartCap from "@/components/home/smartcap";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top + 5 }]}>
      {/**** header */}
      <Header />
      {/**** digicard */}
      <DigiCard />

      {/**** other actions */}
      <View style={styles.actionsRow}>
        <Pressable style={styles.actionItem} onPress={() => {}}>
          <View style={styles.iconCircle}>
            <Text style={styles.actionIcon}>↑</Text>
          </View>
          <Text style={styles.actionLabel}>Send Cash</Text>
        </Pressable>

        <Pressable style={styles.actionItem}>
          <View style={styles.iconCircle}>
            <Text style={styles.actionIcon}>𐚏</Text>
          </View>
          <Text style={styles.actionLabel}>My QR</Text>
        </Pressable>

        <Pressable style={styles.actionItem}>
          <View style={styles.iconCircle}>
            <Text style={styles.actionIcon}>+</Text>
          </View>
          <Text style={styles.actionLabel}>Top Up</Text>
        </Pressable>
      </View>

      {/***** smart cap */}
      <SmartCap />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },

  /*** action rows */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 32,
    paddingHorizontal: 10,
  },
  actionItem: { alignItems: "center", gap: 8 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: { color: "#FF9F1C", fontSize: 22, fontWeight: "600" },
  actionLabel: { color: "#94A3B8", fontSize: 13, fontWeight: "600" },
});
