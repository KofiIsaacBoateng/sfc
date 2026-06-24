import { apiClient } from "@/services/api";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  FirebaseAuthTypes,
  getAuth,
  onAuthStateChanged,
} from "@react-native-firebase/auth";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

let isNetworkSyncInProgress = false;
let currentSyncedFirebaseUid: string | null = null;

function RootLayoutNav() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Regular": PlusJakartaSans_400Regular,
    "Jakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "Jakarta-Bold": PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    const authInstance = getAuth();

    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (firebaseUser) => {
        if (!firebaseUser) {
          currentSyncedFirebaseUid = null;
          isNetworkSyncInProgress = false;
          setInitializing(false);
          router.replace("/onboarding");
          return;
        }

        if (currentSyncedFirebaseUid === firebaseUser.uid) {
          setInitializing(false);
          return;
        }

        if (isNetworkSyncInProgress) {
          return;
        }

        try {
          console.log(
            "📡 [AUTH ENGINE]: Firing unique profile sync request to Node server...",
          );
          isNetworkSyncInProgress = true;

          const response = await apiClient.post("/auth/sync");
          const serverUser = response.data.data;

          console.log(
            "📊 [AUTH ENGINE]: Server Checklist Received:",
            serverUser,
          );

          currentSyncedFirebaseUid = firebaseUser.uid;
          isNetworkSyncInProgress = false;
          setInitializing(false);

          if (serverUser.status === "PENDING_ONBOARDING") {
            router.replace("/userrole");
          } else if (serverUser.status === "ACTIVE") {
            router.replace("/home");
          }
        } catch (error) {
          console.error("❌ [AUTH ENGINE]: Sync processing failure:", error);

          isNetworkSyncInProgress = false;
          currentSyncedFirebaseUid = null;
          setInitializing(false);

          authInstance.signOut();
          router.replace("/onboarding");
        }
      },
    );

    return unsubscribe;
  }, []);

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
