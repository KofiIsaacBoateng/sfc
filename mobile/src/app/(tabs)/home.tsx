import DigiCard from "@/components/home/digicard";
import Header from "@/components/home/header";
import SmartCap from "@/components/home/smartcap";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("screen");
const Home = () => {
  return (
    <View style={[styles.container]}>
      {/**** header */}
      <Header />
      {/**** digicard */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 15, paddingTop: 10 }}>
        <DigiCard />

        {/**** other actions */}
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionItem}
            onPress={() => router.navigate("/send-m")}
          >
            <View style={styles.iconCircle}>
              <FontAwesome6
                name="money-bill-transfer"
                color="#a5bbdf"
                size={18}
              />
            </View>
            <Text style={styles.actionLabel}>Send Cash</Text>
          </Pressable>

          <Pressable
            style={styles.actionItem}
            onPress={() => router.navigate("/myqr")}
          >
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="qrcode-scan"
                color="#a5bbdf"
                size={18}
              />
            </View>
            <Text style={styles.actionLabel}>My QR</Text>
          </Pressable>

          <Pressable style={styles.actionItem} onPress={() => {}}>
            <View style={[styles.iconCircle, { padding: 8 }]}>
              <MaterialCommunityIcons
                name="cash-plus"
                color="#a5bbdf"
                size={30}
              />
            </View>
            <Text style={styles.actionLabel}>Top Up</Text>
          </Pressable>
        </View>

        {/***** smart cap */}
        <SmartCap />
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  /*** action rows */
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginVertical: 25,
  },
  actionItem: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
    aspectRatio: 1 / 1.2,
    borderWidth: 1,
    borderColor: "#616e837a",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  iconCircle: {
    padding: 15,
    alignSelf: "flex-start",
    backgroundColor: "#292e36",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  actionIcon: {
    color: "#a5bbdf",
    fontSize: 20,
    fontFamily: "Jakarta-SemiBold",
  },
  actionLabel: {
    color: "#94A3B8",
    fontSize: 16,
    fontFamily: "Jakarta-SemiBold",
  },
});
