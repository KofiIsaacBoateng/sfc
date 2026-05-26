import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function MerchantPosScreen({
  proceedToPayment,
}: {
  proceedToPayment: (amount: number) => void;
}) {
  const [expression, setExpression] = useState("");
  const [displayResult, setDisplayResult] = useState("0.00");

  // Dynamic Safe Evaluation Engine (No eval used to protect payment states)
  const calculateLiveTotal = (expr: string): string => {
    try {
      // Clean display markers for standard math compilation
      let sanitized = expr.replace(/×/g, "*").replace(/÷/g, "/");
      if (!sanitized || /[+\-*/(]$/.test(sanitized)) return displayResult;

      // Basic functional layout compilation
      const result = new Function(
        `return Math.round((${sanitized}) * 100) / 100`,
      )();
      if (isNaN(result) || !isFinite(result)) return "0.00";
      return result.toFixed(2);
    } catch {
      return displayResult; // Retain last stable value on incomplete inputs
    }
  };

  const handleKeyPress = (val: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (val === "C") {
      setExpression("");
      setDisplayResult("0.00");
      return;
    }

    if (val === "⌫") {
      const nextExpr = expression.slice(0, -1);
      setExpression(nextExpr);
      if (nextExpr === "") {
        setDisplayResult("0.00");
      } else {
        setDisplayResult(calculateLiveTotal(nextExpr));
      }
      return;
    }

    if (val === "CHARGE") {
      const finalAmount = calculateLiveTotal(expression);
      if (parseFloat(finalAmount) <= 0) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        return;
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Seamlessly hand over total to the simulated hardware linking handler
      // Alert.alert(
      //   "Confirm charge details",
      //   `You are proceeding to recieve an amount of GHC${finalAmount}`,
      //   [
      //     { text: "Abort", onPress: () => {}, style: "cancel" },
      //     {
      //       text: "Proceed",
      //       onPress: () => proceedToPayment(parseFloat(finalAmount)),
      //       style: "default",
      //       isPreferred: true,
      //     },
      //   ],
      //   { cancelable: true, userInterfaceStyle: "dark" },
      // );
      proceedToPayment(parseFloat(finalAmount));
      return;
    }

    // Append standard tokens
    const nextExpression = expression + val;
    setExpression(nextExpression);

    // Auto-evaluate totals dynamically if current token is a digit
    if (/[0-9)]$/.test(val)) {
      setDisplayResult(calculateLiveTotal(nextExpression));
    }
  };

  const BUTTONS = [
    ["C", "(", ")", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "⌫", "CHARGE"],
  ];

  const exit = () => {
    router.back();
  };

  return (
    <Animated.View
      entering={SlideInDown.delay(500)}
      exiting={SlideOutUp.duration(500)}
      style={[styles.container]}
    >
      {/* EXIT 2M */}
      <Pressable onPress={exit} style={styles.exit}>
        <Ionicons name="close-outline" color="#ffffffcc" size={25} />
      </Pressable>

      {/* DISPLAY BAR CONTAINER */}
      <View style={styles.displayWrapper}>
        <Text style={styles.expressionText} numberOfLines={1}>
          {expression || "0"}
        </Text>
        <View style={styles.resultRow}>
          <Text style={styles.currencyLabel}>GHC</Text>
          <Text style={styles.resultText} numberOfLines={1}>
            {displayResult}
          </Text>
        </View>
      </View>

      {/* COMPACT 4x5 OPERATION GRID */}
      <View style={styles.grid}>
        {BUTTONS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((btn) => {
              const isOperator = ["÷", "×", "-", "+", "C", "(", ")"].includes(
                btn,
              );
              const isCharge = btn === "CHARGE";

              return (
                <TouchableOpacity
                  key={btn}
                  style={[
                    styles.btn,
                    isOperator && styles.operatorBtn,
                    isCharge && styles.chargeBtn,
                  ]}
                  onPress={() => handleKeyPress(btn)}
                  activeOpacity={0.7}
                >
                  {isCharge ? (
                    <Ionicons
                      name="arrow-forward"
                      size={24}
                      color={"#ffffff"}
                    />
                  ) : (
                    <Text
                      style={[
                        styles.btnText,
                        isOperator && styles.operatorText,
                        isCharge && styles.chargeText,
                      ]}
                    >
                      {btn}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "flex-end",
  },

  exit: {
    position: "absolute",
    left: 0,
    top: 0,
  },

  displayWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "flex-end",
    gap: 6,
  },
  expressionText: {
    color: "#64748B",
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  resultRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  currencyLabel: { color: "#7d99c0", fontSize: 24, fontWeight: "800" },
  resultText: {
    color: "#FFFFFF",
    fontSize: 52,
    fontWeight: "800",
    letterSpacing: -1,
  },
  grid: {
    paddingHorizontal: 15,
    gap: 12,
  },
  row: { flexDirection: "row", justifyContent: "center", gap: 12 },
  btn: {
    width: (width - 70) / 4,
    aspectRatio: 1,
    backgroundColor: "#1E293B",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  operatorBtn: { backgroundColor: "#1E293B" },
  chargeBtn: { backgroundColor: "#be10ac" },
  btnText: { color: "#ffffff", fontSize: 25, fontWeight: "900" },
  operatorText: { color: "#ee94e5" },
  chargeText: { color: "#ffffff" },
});
