import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top + 20 }]}>
      <Text style={{ color: "#ffffffcc", fontSize: 25, fontWeight: "300" }}>
        Profile
      </Text>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },
});
