import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

function RootLayoutNav() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={styles.container}>
        <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="userrole" />
          <Stack.Screen name="authentication" />
          <Stack.Screen name="linking" />
          <Stack.Screen name="merchant" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="transparent" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
