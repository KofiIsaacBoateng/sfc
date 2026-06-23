import { apiClient } from "@/services/api";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  FirebaseAuthTypes,
  onAuthStateChanged,
  getAuth,
} from "@react-native-firebase/auth";
import "react-native-reanimated";

function RootLayoutNav() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Regular": PlusJakartaSans_400Regular,
    "Jakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "Jakarta-Bold": PlusJakartaSans_700Bold,
  });

  // Monitors the hardware application interface state loop
  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (firebaseUser) => {
        setUser(firebaseUser);

        if (firebaseUser) {
          try {
            // Fire backend connection sync instantly upon successful local validation match
            const response = await apiClient.post("/auth/sync");
            console.log("✅ Backend Sync Matrix Complete:", response.data);

            // Route the authenticated user directly into their application interface dashboard
            router.replace("/home");
          } catch (error) {
            console.error(
              "❌ Synchronous Backend Gateway Registration Failure:",
              error,
            );
            authInstance.signOut(); // Gracefully purge local storage states if gateway communication breaches
          }
        }

        if (initializing) setInitializing(false);
      },
    );

    return unsubscribe;
  }, [initializing]);

  const isAppLoading = initializing || (!fontsLoaded && !fontError);

  if (isAppLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#000000",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <GestureHandlerRootView style={styles.container}>
        <Stack
          initialRouteName="onboarding"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="userrole" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="linking" />
          <Stack.Screen name="merchant" />
          <Stack.Screen name="send-m" />
          <Stack.Screen name="myqr" />
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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
});
