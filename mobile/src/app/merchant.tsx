import Intro from "@/components/global/Intro";
import MerchantPosScreen from "@/components/merchant/MerchantPOS";
import PaymentScreen from "@/components/merchant/PaymentScreen";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Merchant = () => {
  const { top, bottom } = useSafeAreaInsets();
  const [showIntro, setShowIntro] = useState(true);
  const [currentState, setCurrentState] = useState<"POS" | "PAY">("POS");
  const [amountToPay, setAmountToPay] = useState<number | undefined>(undefined);

  const proceedToPayment = (amount: number) => {
    setCurrentState("PAY");
    setAmountToPay(amount);
  };
  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + 20, paddingBottom: bottom + 10 },
      ]}
    >
      {showIntro && (
        <Intro exit={() => setShowIntro(false)}>
          <Text
            style={{
              fontFamily: "Jakarta-Regular",
              fontSize: 25,
              color: "#ffffffcc",
              textAlign: "center",
            }}
          >
            Welcome to
          </Text>
          <Text
            style={{
              fontSize: 30,
              fontFamily: "Jakarta-Bold",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            MERCHANT MODE
          </Text>
        </Intro>
      )}

      {/**** POS */}
      {currentState === "POS" && !showIntro && (
        <MerchantPosScreen {...{ proceedToPayment }} />
      )}

      {/**** Payment */}
      {currentState === "PAY" && !showIntro && amountToPay && (
        <PaymentScreen
          amount={amountToPay}
          goBack={() => setCurrentState("POS")}
        />
      )}
    </View>
  );
};

export default Merchant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },
});
