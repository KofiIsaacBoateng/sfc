import { useGlobalNFC } from "@/context/NFCContext";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { registerScreenInterceptor } = useGlobalNFC();

  // disables global nfc for the screens of this layout
  useEffect(() => {
    registerScreenInterceptor(true);

    return () => {
      registerScreenInterceptor(false);
    };
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000000" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="verify" />
    </Stack>
  );
}
