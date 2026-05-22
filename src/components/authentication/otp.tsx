import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputKeyPressEvent,
  View,
} from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { RoundBtn } from "../onboarding/buttons";

const OTP_LENGTH = 6;
const OTP = ({
  handleVerifyOtp,
}: {
  handleVerifyOtp: (input: string) => boolean;
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [currentInput, setCurrentInput] = useState(0);
  const [isValidOtp, setIsValidOtp] = useState<boolean | undefined>(undefined);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      let valid = handleVerifyOtp(otp.join(""));
      setIsValidOtp(valid);
      setLoading(false);
      if (valid) {
        setTimeout(() => router.navigate("/linking"), 500);
      }
    }, 1000);
  };

  const handleChange = (text: string, index: number) => {
    setIsValidOtp(undefined);

    // Clean string (only keep the character typed)
    const cleanedText = text.slice(-1);

    if (cleanedText.length === 1) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = cleanedText;
        // Evaluate if entire string block is complete to trigger action button
        const isComplete = next.every((val) => val !== "");
        setDisabled(!isComplete);
        return next;
      });

      // Shift focus cleanly
      if (index < OTP_LENGTH - 1) {
        setCurrentInput(index + 1);
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: TextInputKeyPressEvent, index: number) => {
    if (e.nativeEvent.key !== "Backspace") return;
    setIsValidOtp(undefined);

    // If current input is empty, clear previous box and slide focus backward
    if (otp[index] === "" && index > 0) {
      setOtp((prev) => {
        let temp = [...prev];
        temp[index - 1] = "";
        return temp;
      });
      const input = inputRefs.current[index - 1];
      if (input) {
        input.focus();
      }
      setCurrentInput(index - 1);
      return;
    }

    //  Clear current element slot
    setOtp((prev) => {
      let temp = [...prev];
      temp[index] = "";
      return temp;
    });
  };

  useEffect(() => {
    const input = inputRefs.current[0];
    if (input) {
      input.focus();
    }
  }, []);

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      animatedProps={{ animationDelay: 0.2, style: styles.container }}
    >
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Verify Identity</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent via SMS to verify.
        </Text>
      </View>

      {/**** inputs */}
      <View style={styles.inputsWrapper}>
        {Array.from({ length: 6 }).map((_, i) => (
          <TextInput
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            style={[
              styles.input,
              {
                borderBottomColor:
                  isValidOtp === undefined
                    ? currentInput === i
                      ? "#ffffff"
                      : "#ffffff44"
                    : isValidOtp
                      ? "#10be10"
                      : "#be1010",
                color:
                  isValidOtp === undefined
                    ? "#ffffffcc"
                    : isValidOtp
                      ? "#10be10"
                      : "#be1010",
              },
            ]}
            onKeyPress={(e) => handleKeyPress(e, i)}
            keyboardType="phone-pad"
            maxLength={1}
            value={otp[i]}
            onChangeText={(text) => handleChange(text, i)}
          />
        ))}
      </View>

      <RoundBtn
        style={{ marginLeft: "auto", marginTop: 20 }}
        loading={loading}
        disabled={disabled}
        onPress={handleSubmit}
      />
    </Animated.View>
  );
};

export default OTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  titleWrapper: {
    gap: 10,
    marginBottom: 70,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#ffffffcc",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffffac",
    textAlign: "center",
  },

  inputsWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ffffff87",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
  },
});
