import React from "react";
import { StyleSheet, Text, View } from "react-native";

const linking = () => {
  return (
    <View style={styles.container}>
      <Text style={{ color: "#ffffff" }}>linking</Text>
    </View>
  );
};

export default linking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
