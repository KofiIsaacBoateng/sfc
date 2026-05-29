import NetworkDetector from "@/components/global/networkDetector";
import AccountData from "@/components/home/Accountdata";
import ScanQR from "@/components/home/ScanQR";
import ScanSFC from "@/components/home/ScanSFC";
import { RoundBtn } from "@/components/onboarding/buttons";
import { FontAwesome6, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AmountKeys = {
  label: string;
  amount: number;
};

const AMOUNT_KEYS: AmountKeys[] = [
  { label: "+2", amount: 2 },
  { label: "+5", amount: 5 },
  { label: "+10", amount: 10 },
  { label: "+50", amount: 50 },
  { label: "+100", amount: 100 },
];

const SendMoney = () => {
  const { top, bottom } = useSafeAreaInsets();
  const amountInputRef = useRef<TextInput | null>(null);
  const [amount, setAmount] = useState("");
  const [amountFocus, setAmountFocus] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberFocus, setNumberFocus] = useState(false);
  const phoneNumberInputRef = useRef<TextInput | null>(null);
  const [ctaDisabled, setCtaDisabled] = useState(true);
  const [showManualMode, setShowManualMode] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<
    "main" | "qrcode" | "sfc" | "confirm"
  >("main");

  const updateAmount = (value: string) => {
    if ((amount + value).length === 0) {
      setCtaDisabled(true);
    } else {
      setCtaDisabled(false);
    }

    setAmount(value);
  };

  const ctaAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(showManualMode ? 0 : -250, {
            duration: 500,
            easing: Easing.inOut(Easing.quad),
          }),
        },
      ],

      opacity: withTiming(showManualMode ? 0 : 1, {
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
    };
  });

  const manualAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showManualMode ? 1 : 0, {
        duration: 500,
        easing: Easing.inOut(Easing.quad),
      }),
    };
  });

  const AmountKeyUpdate = (value: number) => {
    let amnt = Number(amount) || 0;
    setAmount(String(amnt + value));
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: top + 30, paddingBottom: bottom + 10 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <FontAwesome6 name="angle-left" color="#ffffffac" size={20} />
        </Pressable>
        <Text style={styles.headerTitle}>Send Money</Text>
      </View>

      {/* amount input */}
      <Pressable
        style={[
          styles.amountWrapper,
          { borderColor: amountFocus ? "#ffffffcc" : "#ffffff87" },
        ]}
        onPress={() => amountInputRef.current?.focus()}
      >
        <Text style={styles.amountLabel}>Amount (GHS)</Text>
        <TextInput
          ref={amountInputRef}
          value={amount}
          placeholder="25.30"
          placeholderTextColor={"#ffffff55"}
          style={[styles.amountInput]}
          onChangeText={updateAmount}
          autoFocus={true}
          onFocus={() => setAmountFocus(true)}
          onBlur={() => setAmountFocus(false)}
          keyboardType="decimal-pad"
          returnKeyType="done"
          returnKeyLabel="Done"
          cursorColor="#ffffff"
        />
      </Pressable>
      {/* amount keys */}
      <View style={styles.amountKeys}>
        {AMOUNT_KEYS.map((ak, i) => (
          <Pressable
            key={i}
            onPress={() => AmountKeyUpdate(ak.amount)}
            style={styles.amountKey}
          >
            <Text style={styles.amountKeyText}>{ak.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* dynamic phone number input */}
      <Animated.View style={[styles.manual, manualAnimatedStyle]}>
        <Pressable
          style={[
            styles.amountWrapper,
            { borderColor: numberFocus ? "#ffffffcc" : "#ffffff87" },
          ]}
          onPress={() => {}}
        >
          <SimpleLineIcons
            name="screen-smartphone"
            size={20}
            color="#ffffff66"
          />
          <TextInput
            ref={phoneNumberInputRef}
            value={phoneNumber}
            placeholder="eg. 0201234567"
            placeholderTextColor={"#ffffff55"}
            style={[styles.phoneInput]}
            onChangeText={setPhoneNumber}
            maxLength={10}
            onFocus={() => setNumberFocus(true)}
            onBlur={() => setNumberFocus(false)}
            keyboardType="phone-pad"
            returnKeyType="done"
            returnKeyLabel="Done"
            cursorColor="#ffffff"
          />
          {phoneNumber !== "" && (
            <Pressable onPress={() => setPhoneNumber("")}>
              <Ionicons name="close" size={18} color={"#ffffff66"} />
            </Pressable>
          )}
        </Pressable>

        {/**** network indentifier */}
        <NetworkDetector
          phoneNumber={phoneNumber}
          title
          containerStyle={{
            flexDirection: "row",
            justifyContent: "flex-start",
            paddingHorizontal: 15,
            paddingVertical: 10,
            width: "100%",
          }}
          borderColor={"#ffffff77"}
        />

        {/* phone number ctas */}
        <View style={styles.manualCtas}>
          <Pressable
            style={styles.manualCta}
            onPress={() => setShowManualMode(false)}
          >
            <Ionicons name="close" size={20} color="#ffffffaa" />
          </Pressable>

          <RoundBtn
            disabled={!amount || !phoneNumber}
            onPress={() => setCurrentScreen("confirm")}
          />
        </View>
      </Animated.View>

      {/* cta */}
      <Animated.View style={[styles.ctas, ctaAnimatedStyle]}>
        <Pressable
          style={[
            styles.cta,
            {
              backgroundColor: !amount ? "#090b11bc" : "#491c77",
              borderWidth: 0,
            },
          ]}
          disabled={!amount}
          onPress={() => setCurrentScreen("sfc")}
        >
          <Text style={[styles.ctaText]}>Scan sfc</Text>
        </Pressable>
        <Pressable
          style={[styles.cta]}
          disabled={!amount}
          onPress={() => setCurrentScreen("qrcode")}
        >
          <Text style={[styles.ctaText]}>scan QR Code</Text>
        </Pressable>
        <Pressable
          style={[styles.cta]}
          disabled={!amount}
          onPress={() => setShowManualMode(true)}
        >
          <Text style={[styles.ctaText]}>Enter number manually</Text>
        </Pressable>
      </Animated.View>

      {/**** support screens */}
      {currentScreen === "confirm" && (
        <AccountData
          phoneNumber={phoneNumber}
          amount={amount}
          goBack={() => setCurrentScreen("main")}
        />
      )}

      {currentScreen === "sfc" && (
        <ScanSFC goBack={() => setCurrentScreen("main")} />
      )}

      {currentScreen === "qrcode" && (
        <ScanQR goBack={() => setCurrentScreen("main")} />
      )}
    </View>
  );
};

export default SendMoney;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090d13",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#ffffffcc",
    marginHorizontal: "auto",
    fontSize: 18,
    fontWeight: "300",
    letterSpacing: 1.5,
  },

  amountWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },

  amountLabel: {
    color: "#ffffffcc",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  amountInput: {
    flex: 1,
    textAlign: "right",
    color: "#ffffffcc",
  },

  amountKeys: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 10,
    marginTop: 15,
  },

  amountKey: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ffffff87",
    borderRadius: 2,
    padding: 10,
    maxWidth: 50,
    aspectRatio: 1,
    flexGrow: 1,
    flexShrink: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  amountKeyText: {
    color: "#ffffffac",
    // fontSize: 16,
  },

  manual: {
    gap: 10,
    marginTop: 0,
  },

  phoneInput: {
    flex: 1,
    paddingHorizontal: 15,
    color: "#ffffffcc",
    fontSize: 16,
  },

  manualCtas: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 30,
  },

  manualCta: {
    backgroundColor: "#0d0d0d",
    padding: 15,
    borderRadius: 50,
  },

  ctas: {
    gap: 15,
    marginTop: 50,
    backgroundColor: "#090d13",
  },
  cta: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ffffff44",
    borderRadius: 10,
    paddingVertical: 15,
  },
  ctaText: {
    color: "#ffffffac",
  },
});
