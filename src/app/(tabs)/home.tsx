import React from "react";
import { StyleSheet, Text, View } from "react-native";

const home = () => {
  return (
    <View style={styles.container}>
      <Text>home</Text>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
