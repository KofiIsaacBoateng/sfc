import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const CustomSwitch = ({ onToggle }: { onToggle: (value: boolean) => void }) => {
  const [on, setOn] = useState(true);

  const toggleSwitch = () => {
    setOn((prev) => !prev);
  };

  const toggleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(on ? 25 : 0, { duration: 500 }) }],
  }));

  const animatedBackgroundColor = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      interpolateColor(on ? 1 : 0, [0, 1], ["#192030", "#491c77"]),
      { duration: 500 },
    ),
  }));

  return (
    <AnimatedPressable
      onPress={toggleSwitch}
      style={[styles.container, animatedBackgroundColor]}
    >
      <Animated.View style={[styles.switch, toggleAnimatedStyle]} />
    </AnimatedPressable>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 25,
    borderRadius: 50,
    backgroundColor: "green",
    padding: 2,
    justifyContent: "center",
  },

  switch: {
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "#ffffffcc",
    borderRadius: 50,
    position: "absolute",
  },
});
