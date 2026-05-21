import { StyleSheet, Text, View } from "react-native";
import React from "react";

const linking = () => {
  return (
    <View style={styles.container}>
      <Text>linking</Text>
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
