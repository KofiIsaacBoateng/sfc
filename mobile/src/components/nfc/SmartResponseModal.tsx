import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { ScanResults } from "@/context/NFCContext";
import { SFCChipType } from "@/utils/nfcIdentifier";
import { ModalNotification } from "../global/Notification";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const SmartResponseModal = ({
  visible,
  scanResults,
  onClose,
}: {
  scanResults: ScanResults | null;
  onClose: () => void;
  visible: boolean;
}) => {
  useEffect(() => {
    console.log("Scan Results received from global scanner!");
  }, []);

  return (
    <ModalNotification close={onClose} visible={visible}>
      <Text style={styles.title}>What's up charley?</Text>

      {/***** options */}
      <View style={styles.options}>
        <Pressable onPress={() => {}} style={styles.item}>
          <FontAwesome name="send-o" color="#ffffff99" size={22} />
          <Text style={styles.itemText}>Make a transaction</Text>
        </Pressable>

        <Pressable onPress={() => {}} style={styles.item}>
          <MaterialCommunityIcons
            name="badge-account-horizontal-outline"
            color="#ffffff99"
            size={22}
          />
          <Text style={styles.itemText}>Save contact details</Text>
        </Pressable>

        <Pressable onPress={() => {}} style={styles.item}>
          <FontAwesome6 name="nfc-symbol" color="#ffffff99" size={22} />
          <Text style={styles.itemText}>Explore more options</Text>
        </Pressable>
      </View>
    </ModalNotification>
  );
};

export default SmartResponseModal;

const styles = StyleSheet.create({
  title: {
    color: "#ffffff99",
    fontSize: 18,
    fontFamily: "Jakarta-SemiBold",
    letterSpacing: 0.5,
  },

  options: {
    flex: 1,
    paddingTop: 30,
    gap: 15,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    // borderWidth: StyleSheet.hairlineWidth,
    // borderColor: "#ffffff55",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
  },

  itemText: {
    color: "#ffffff99",
    fontSize: 16,
    fontFamily: "Jakarta-Regular",
  },
});
