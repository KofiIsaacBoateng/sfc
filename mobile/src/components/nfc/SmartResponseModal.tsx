import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScanResults } from "@/context/NFCContext";
import { SFCChipType } from "@/utils/nfcIdentifier";
import { ModalNotification } from "../global/Notification";
import {
  FontAwesome,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { apiClient } from "@/services/api";
import { AxiosError } from "axios";

export type OwnershipType = "mine" | "notmine" | "inactive" | "unknown";

const SmartResponseModal = ({
  visible,
  scanResults,
  onClose,
}: {
  scanResults: ScanResults | null;
  onClose: () => void;
  visible: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const [ownershipType, setOwnershipType] = useState<OwnershipType | undefined>(
    undefined,
  );

  const checkOwnership = async () => {
    setLoading(true);
    console.log("checking ownership: ", scanResults?.token);
    try {
      const response = await apiClient.get(`/sfc/ismine/${scanResults?.token}`);
      const data = response.data;

      if (data.status === "success") {
        console.log("[OWNERSHIP CHECK]: check successful: ", data.data);
        setOwnershipType(data.data.ownership);
      }
    } catch (error) {
      console.log(
        "[OWNERSHIP CHECK]: ownership check failed with error: ",
        error,
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkOwnership();
  }, []);

  return (
    <ModalNotification close={onClose} visible={visible}>
      <Text style={styles.title}>What's up charley?</Text>

      {/***** options */}
      {loading ? (
        <View style={styles.contentContainer}>
          <ActivityIndicator size={"small"} color="#ffffffcc" />
          <Text style={{ color: "#ffffffcc", fontFamily: "Jakarta-Regular" }}>
            Just a moment
          </Text>
        </View>
      ) : ownershipType === "notmine" ? (
        <View style={styles.contentContainer}>
          <Pressable onPress={() => {}} style={styles.item}>
            <FontAwesome name="send-o" color="#ffffffcc" size={22} />
            <Text style={styles.itemText}>Make a transaction</Text>
          </Pressable>

          <Pressable onPress={() => {}} style={styles.item}>
            <MaterialCommunityIcons
              name="badge-account-horizontal-outline"
              color="#ffffffcc"
              size={25}
            />
            <Text style={styles.itemText}>Save contact details</Text>
          </Pressable>

          <Pressable onPress={() => {}} style={styles.item}>
            <FontAwesome6 name="nfc-symbol" color="#ffffffcc" size={22} />
            <Text style={styles.itemText}>Explore more options</Text>
          </Pressable>
        </View>
      ) : ownershipType === "inactive" || ownershipType === "unknown" ? (
        <View style={styles.contentContainer}>
          <Pressable onPress={() => {}} style={styles.item}>
            <FontAwesome6 name="nfc-symbol" color="#ffffffcc" size={22} />
            <Text style={styles.itemText}>Link to your account</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          <Text style={styles.itemText}>
            This product is linked to your account!
          </Text>
        </View>
      )}
    </ModalNotification>
  );
};

export default SmartResponseModal;

const styles = StyleSheet.create({
  title: {
    color: "#ffffffcc",
    fontSize: 18,
    fontFamily: "Jakarta-SemiBold",
    letterSpacing: 0.5,
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    color: "#ffffffcc",
    fontSize: 16,
    fontFamily: "Jakarta-Regular",
  },
});
