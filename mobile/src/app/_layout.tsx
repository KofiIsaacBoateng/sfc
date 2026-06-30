import SmartResponseModal from "@/components/nfc/SmartResponseModal";
import NFCProvider, { useGlobalNFC } from "@/context/NFCContext";
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
  signOut,
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
  const { resetGlobalScanner, registerScreenInterceptor, scanResults } =
    useGlobalNFC();
  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Regular": PlusJakartaSans_400Regular,
    "Jakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "Jakarta-Bold": PlusJakartaSans_700Bold,
  });

  useEffect(() => {
    const authInstance = getAuth();

    const unsubscribe = onAuthStateChanged(
      authInstance,
      async (firebaseUser: FirebaseAuthTypes.User | null) => {
        if (!firebaseUser) {
          currentSyncedFirebaseUid = null;
          isNetworkSyncInProgress = false;
          setInitializing(false);
          router.navigate("/onboarding");
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
            "📡 [GLOBAL GATEKEEPER]: Singular sync initialized for user ID:",
            firebaseUser.uid,
          );
          isNetworkSyncInProgress = true;

          const response = await apiClient.post("/auth/sync");
          const serverUser = response.data.data;

          console.log(
            "📊 [GLOBAL GATEKEEPER]: Server Checklist Result:",
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
          console.error(
            "❌ [GLOBAL GATEKEEPER]: Sync pipeline cracked:",
            error,
          );

          isNetworkSyncInProgress = false;
          currentSyncedFirebaseUid = null;
          setInitializing(false);

          signOut(authInstance);
          router.replace("/onboarding");
        }
      },
    );

    return unsubscribe;
  }, []);

  // const isAppLoading = !fontsLoaded && !fontError;
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

        {scanResults && (
          <SmartResponseModal
            visible={scanResults !== null}
            scanResults={scanResults}
            onClose={resetGlobalScanner}
          />
        )}
      </GestureHandlerRootView>
      <StatusBar style="light" backgroundColor="transparent" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <NFCProvider>
      <RootLayoutNav />
    </NFCProvider>
  );
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
