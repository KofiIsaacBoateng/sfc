import { NETWORK_CODES } from "@/constants/constants";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import { RoundBtn } from "../onboarding/buttons";

const Number = ({
  handleSendOtp,
}: {
  handleSendOtp: (input: string) => void;
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [focused, setFocused] = useState(false);
  const [firstTimeFocus, setFirstTimeFocus] = useState(false);
  const [errors, setErrors] = useState<null | {
    length?: { message: string };
    invalid?: { message: string };
  }>(null);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);
    if (text.length === 10) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const handleFocus = (value: boolean) => {
    if (!firstTimeFocus) setFirstTimeFocus(true);
    setFocused(value);
  };

  const handleSubmit = () => {
    const networkCode = phoneNumber.slice(0, 3);
    if (
      !NETWORK_CODES.mtn.includes(networkCode) &&
      !NETWORK_CODES.telecel.includes(networkCode)
    ) {
      setErrors((prev) => ({
        ...prev,
        invalid: {
          message: "only mtn and telecel numbers are supported at the moment.",
        },
      }));
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleSendOtp(phoneNumber);
    }, 1000);
  };

  useEffect(() => {
    // validate input on blur
    if (focused || !firstTimeFocus) return;

    if (phoneNumber.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        length: { message: "phone number must be 10 characters" },
      }));
    } else {
      setErrors(null);
    }
  }, [focused]);

  return (
    <Animated.View
      entering={SlideInRight}
      exiting={SlideOutLeft}
      animatedProps={{ animationDelay: 0.2, style: styles.container }}
    >
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Enter your MoMo Number</Text>
        <Text style={styles.subtitle}>
          We will use this network identity to anchor your digital transactions.
        </Text>
      </View>

      {/**** text input */}

      <TextInput
        style={[
          styles.input,
          {
            borderColor: errors
              ? "#be1010"
              : !focused && firstTimeFocus
                ? "#10be10"
                : focused
                  ? "#ffffff"
                  : "#ffffff87",
            color: errors
              ? "#be1010"
              : !focused && firstTimeFocus
                ? "#10be10"
                : "#ffffff",
          },
        ]}
        placeholder="020XXXXXXX"
        placeholderTextColor="#ffffff87"
        keyboardType="phone-pad"
        onFocus={() => handleFocus(true)}
        onBlur={() => handleFocus(false)}
        autoFocus={true}
        maxLength={10}
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
      />

      {/**** validation error lists */}
      {errors && (
        <>
          {errors.length && (
            <Text style={{ color: "#be1010cc", marginTop: 5 }}>
              * {errors.length.message}
            </Text>
          )}
          {errors.invalid && (
            <Text style={{ color: "#be1010cc", marginTop: 5 }}>
              * {errors.invalid.message}
            </Text>
          )}
        </>
      )}

      <RoundBtn
        style={{ marginLeft: "auto", marginTop: 20 }}
        loading={loading}
        disabled={disabled}
        onPress={handleSubmit}
      />
    </Animated.View>
  );
};

export default Number;

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

  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    fontSize: 18,
    paddingHorizontal: 15,
    letterSpacing: 1,
    color: "#ffffffcc",
  },
});
