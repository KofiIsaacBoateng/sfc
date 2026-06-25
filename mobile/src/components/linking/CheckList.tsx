import { router } from "expo-router";
import Lottie from "lottie-react-native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RoundBtn } from "../onboarding/buttons";

type List = {
  id: number;
  message: string;
  status: "supported" | "enabled" | "validated" | "linked";
  cta: string;
};

interface Status {
  supported: boolean | undefined;
  enabled: boolean | undefined;
  validated: boolean | undefined;
  linked: boolean | undefined;
}

const list: List[] = [
  {
    id: 0,
    message: "NFC supported device.",
    status: "supported",
    cta: "Get Started",
  },
  {
    id: 1,
    message: "Turn on phone's NFC.",
    status: "enabled",
    cta: "Turn on NFC",
  },
  {
    id: 2,
    message: "Card or bracelet validation.",
    status: "validated",
    cta: "Validate product",
  },
  {
    id: 3,
    message: "Link account to product.",
    status: "linked",
    cta: "Link to account",
  },
];

const CheckList = ({
  stage,
  style,
  loading,
  status,
  ctas,
}: {
  stage: number;
  status: Status;
  style?: ViewStyle;
  loading: boolean;
  ctas: (() => void)[];
}) => {
  const { bottom, top } = useSafeAreaInsets();

  useEffect(() => {
    const timeout = setTimeout(() => {
      ctas[0]();
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.delay(500)}
      style={[
        styles.container,
        style,
        { paddingTop: top + 30, paddingBottom: bottom + 10 },
      ]}
    >
      {/**** title */}
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Linking Status</Text>
        <Text style={styles.subtext}>
          Let's make sure your device is hooked up to your account properly.
        </Text>
      </View>
      {/**** list */}
      <View style={styles.list}>
        <Text style={styles.status}>Status: </Text>
        {list.map((item, index) => (
          <ListItem
            key={index}
            item={item}
            stage={stage}
            status={status}
            loading={loading}
          />
        ))}
      </View>

      {/**** cta */}
      {stage <= list.length - 1 && status.linked !== true ? (
        <Pressable
          onPress={ctas[stage]}
          style={[
            styles.cta,
            {
              backgroundColor:
                typeof status[list[stage].status] === "boolean"
                  ? "#bf5555cc"
                  : "#0d0d0d",
            },
          ]}
        >
          <Text style={styles.ctaText}>
            {typeof status[list[stage].status] === "boolean"
              ? "Try again"
              : list[stage].cta}
          </Text>
        </Pressable>
      ) : (
        <RoundBtn
          onPress={() => router.replace("/home")}
          style={{ marginLeft: "auto", marginTop: "auto" }}
        />
      )}
    </Animated.View>
  );
};

const ListItem = ({
  item,
  stage,
  loading,
  status,
}: {
  item: List;
  stage: number;
  loading: boolean;
  status: Status;
}) => {
  return (
    <View style={[styles.item]}>
      {/**** status indicator */}
      {stage === item.id && loading ? (
        <ActivityIndicator size={20} color="#ffffff" />
      ) : status[item.status] === undefined ? (
        <View
          style={[styles.marker, { opacity: stage === item.id ? 1 : 0.6 }]}
        />
      ) : (
        <Animated.View entering={FadeIn.delay(500)}>
          {status[item.status] === false ? (
            <Lottie
              source={require("@/assets/animations/error.json")}
              autoPlay
              loop={false}
              duration={1000}
              style={[styles.lottie, { width: 30 }]}
            />
          ) : (
            <Lottie
              source={require("@/assets/animations/tick.json")}
              autoPlay
              loop={false}
              duration={1000}
              style={[styles.lottie]}
            />
          )}
        </Animated.View>
      )}

      {/***** message */}
      <Text
        style={[
          styles.message,
          {
            opacity: stage === item.id ? 1 : 0.6,
            color: status[item.status] === false ? "#bf5555" : "#ffffffcc",
            fontWeight: stage === item.id ? "700" : "300",
          },
        ]}
      >
        {item.message}
      </Text>
    </View>
  );
};

export default CheckList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },

  titleWrapper: {
    gap: 5,
    marginBottom: 40,
  },

  title: {
    color: "#ffffffcc",
    fontSize: 25,
    fontFamily: "Jakarta-Regular",
  },

  subtext: {
    color: "#ffffffaa",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Jakarta-Regular",
  },

  list: {
    gap: 20,
  },

  status: {
    color: "#ffffffcc",
    fontSize: 20,
    marginTop: 10,
    fontFamily: "Jakarta-SemiBold",
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  lottie: {
    width: 40,
    aspectRatio: 1,
  },

  marker: {
    width: 20,
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ffffff",
  },

  message: {
    fontSize: 18,
    fontFamily: "Jakarta-Regular",
  },

  cta: {
    marginTop: "auto",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 15,
  },

  ctaText: {
    color: "#ffffffcc",
    fontSize: 16,
    textTransform: "uppercase",
    fontFamily: "Jakarta-SemiBold",
  },
});
