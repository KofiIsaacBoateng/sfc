import Number from "@/components/authentication/number";
import OTP from "@/components/authentication/otp";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const authentication = () => {
  const { bottom, top } = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [number, setNumber] = useState<string>("");
  const [otp, setOtp] = useState<string | undefined>(undefined);

  const handleSendOtp = (inputNumber: string) => {
    setNumber(inputNumber);
    setOtp("123456");
    setStep(1);
  };

  const handleVerifyOtp = (inputOtp: string): boolean => {
    return otp === inputOtp;
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom + 10, paddingTop: top + 20 },
      ]}
    >
      {step === 0 ? (
        <Number handleSendOtp={handleSendOtp} number={number} />
      ) : (
        <OTP
          handleVerifyOtp={handleVerifyOtp}
          goBack={() => setStep(0)}
          phoneNumber={number}
        />
      )}
    </View>
  );
};

export default authentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },
});
