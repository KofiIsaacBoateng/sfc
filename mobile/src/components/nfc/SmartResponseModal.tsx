import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { ScanResults } from "@/context/NFCContext";
import { SFCChipType } from "@/utils/nfcIdentifier";
import { ModalNotification } from "../global/Notification";

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
      <Text>
        SmartResponseModal === {scanResults?.token || ""} :{" "}
        {scanResults?.chipType}
      </Text>
    </ModalNotification>
  );
};

export default SmartResponseModal;

const styles = StyleSheet.create({});
