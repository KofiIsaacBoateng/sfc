import { Redirect } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function EntryPoint() {
  return (
    <View style={styles.container}>
      <Redirect href="/onboarding" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
