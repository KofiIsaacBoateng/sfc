import { NETWORK_CODES } from "@/constants/constants";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Animated, { SlideOutLeft } from "react-native-reanimated";
import NetworkDetector from "../global/networkDetector";
import { RoundBtn } from "../onboarding/buttons";

const Number = ({
  handleSendOtp,
  number,
}: {
  handleSendOtp: (input: string) => void;
  number: string;
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(number);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [focused, setFocused] = useState(false);
  const [firstTimeFocus, setFirstTimeFocus] = useState(true);
  const [errors, setErrors] = useState<null | {
    length?: { message: string };
    invalid?: { message: string };
  }>(null);

  const handlePhoneNumberChange = (text: string) => {
    setPhoneNumber(text);

    if (!firstTimeFocus) {
      // validate while typing on when input is blurred the first time
      validateInput(text); // input validation
    }

    // enable or disable next
    if (text.length === 10) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  };

  const validateInput = (text?: string): boolean => {
    const number = text ? text : phoneNumber;
    const networkCode = number.slice(0, 3);
    let errorCount = 0;

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
      errorCount++;
    } else {
      setErrors((prev) => ({ length: prev?.length }));
    }

    if (number.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        length: { message: "phone number must be 10 characters" },
      }));
      errorCount++;
    } else {
      setErrors((prev) => ({ invalid: prev?.invalid }));
    }

    if (errorCount === 0) {
      setErrors(null);
      return true;
    }

    return false;
  };

  const handleFocus = (value: boolean) => {
    if (firstTimeFocus && !value) setFirstTimeFocus(false); // indicate first time focus as false
    setFocused(value);
  };

  const handleSubmit = () => {
    if (!validateInput()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleSendOtp(phoneNumber);
    }, 1000);
  };

  useEffect(() => {
    if (number) {
      validateInput();
      setDisabled(false);
    }
  }, []);

  return (
    <Animated.View exiting={SlideOutLeft} style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Enter your MoMo Number</Text>
        <Text style={styles.subtitle}>
          We will use this network identity to anchor your digital transactions.
        </Text>
      </View>

      {/**** text input */}
      <View style={styles.inputWrapper}>
        <NetworkDetector
          borderColor={
            errors
              ? "#be1010"
              : !firstTimeFocus || number
                ? "#10be10"
                : focused
                  ? "#ffffff"
                  : "#ffffff87"
          }
          phoneNumber={phoneNumber}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: errors
                ? "#be1010"
                : !firstTimeFocus || number
                  ? "#10be10"
                  : focused
                    ? "#ffffff"
                    : "#ffffff87",
              color: errors
                ? "#be1010"
                : !firstTimeFocus || number
                  ? "#10be10"
                  : "#ffffff",
            },
          ]}
          placeholder="020XXXXXXX"
          placeholderTextColor="#ffffff87"
          keyboardType="phone-pad"
          returnKeyLabel="send"
          returnKeyType="send"
          onFocus={() => handleFocus(true)}
          onBlur={() => handleFocus(false)}
          autoFocus={true}
          maxLength={10}
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          onSubmitEditing={handleSubmit}
        />
      </View>

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
        disabled={disabled || Boolean(errors)}
        onPress={handleSubmit}
      />
    </Animated.View>
  );
};

export default Number;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
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
    fontWeight: "300",
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 25,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  input: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    fontSize: 18,
    paddingHorizontal: 15,
    minHeight: 40,
    letterSpacing: 1,
    color: "#ffffffcc",
  },
});
