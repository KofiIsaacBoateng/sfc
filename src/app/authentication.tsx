import React from "react";
import { StyleSheet, Text, View } from "react-native";

const authentication = () => {
  return (
    <View style={styles.container}>
      <Text>authentication</Text>
    </View>
  );
};

export default authentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
