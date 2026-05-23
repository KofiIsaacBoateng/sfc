import { Ionicons } from "@expo/vector-icons";
import React, { PropsWithChildren, useEffect } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("screen");
const ToastNotification = ({
  type,
  message,
  visible,
  hide,
}: {
  type: "error" | "info" | "success";
  message: string;
  visible: boolean;
  hide: () => void;
}) => {
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    let timeout = setTimeout(() => {
      hide();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={[styles.toastContainer, { bottom: bottom + 10 }]}
    >
      {type === "success" ? (
        <Ionicons name="checkmark-circle" size={24} color="#10be10" />
      ) : type === "info" ? (
        <Ionicons name="information-circle" size={26} color="skyblue" />
      ) : (
        <Ionicons name="close-circle" size={24} color="#be1010" />
      )}

      <Text style={{ color: "#ffffffcc", fontSize: 16 }}>{message}</Text>
    </Animated.View>
  );
};

const ModalNotification = ({
  close,
  visible,
  children,
}: PropsWithChildren<{
  close: () => void;
  visible: boolean;
}>) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal
      navigationBarTranslucent
      statusBarTranslucent
      onRequestClose={close}
      visible={visible}
      backdropColor="transparent"
      animationType="slide"
      allowSwipeDismissal
    >
      <View style={[styles.modalNotification, { paddingBottom: bottom + 5 }]}>
        <Pressable
          onPress={close}
          style={{ position: "absolute", top: 10, right: 20 }}
        >
          <Ionicons name="close" size={24} color="#ffffff87" />
        </Pressable>
        {children}
      </View>
    </Modal>
  );
};

export { ModalNotification, ToastNotification };

const styles = StyleSheet.create({
  toastContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    position: "absolute",
    left: 0,
    right: 0,
    gap: 10,
    backgroundColor: "#0d0d0d",
  },

  modalNotification: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: "#0d0d0a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
