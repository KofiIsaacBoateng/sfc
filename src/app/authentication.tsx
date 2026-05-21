import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const authentication = () => {
  const { bottom, top } = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom + 10, paddingTop: top + 50 },
      ]}
    >
      <Text style={{ color: "#ffffff", textTransform: "uppercase" }}>
        authentication
      </Text>
    </View>
  );
};

export default authentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },
});
