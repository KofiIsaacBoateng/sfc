import { RoundBtn } from "@/components/onboarding/buttons";
import { useGlobalNFC } from "@/context/NFCContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");

type Role = "user" | "merchant";
interface RoleData {
  title: string;
  subtitle: string;
  role: Role;
}

const roleData: RoleData[] = [
  {
    role: "user",
    title: "Daily Cruise",
    subtitle:
      " I want a quick, secure way to pay for my daily transit, shopping, and retail spends.",
  },

  {
    role: "merchant",
    title: "Business Boost",
    subtitle:
      "I want a frictionless, pocket-sized POS to collect instant cashless payments from clients.",
  },
];

const UserRole = () => {
  const { bottom, top } = useSafeAreaInsets();
  const [selected, setSelected] = useState<undefined | Role>(undefined);
  const { registerScreenInterceptor } = useGlobalNFC();

  const handleSelected = (option: undefined | Role) => {
    setSelected(option);
  };

  const handleNext = () => {
    router.push("/linking");
  };

  // disables global nfc for this screen
  useEffect(() => {
    registerScreenInterceptor(true);

    return () => {
      registerScreenInterceptor(false);
    };
  }, []);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom + 10, paddingTop: top + 50 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>What’s your focus today?</Text>
        <Text style={styles.headerSubtext}>
          Choose an option to customize your setup.
        </Text>
      </View>

      <View style={styles.cards}>
        {roleData.map((role, index) => (
          <RoleCard
            key={index}
            {...role}
            isSelected={role.role === selected}
            select={() => setSelected(role.role)}
          />
        ))}
      </View>

      {/**** ctx */}
      <RoundBtn
        style={{ marginLeft: "auto", marginTop: 30 }}
        onPress={handleNext}
        disabled={!selected}
      />
    </View>
  );
};

const RoleCard = ({
  isSelected,
  title,
  subtitle,
  role,
  select,
}: {
  isSelected: boolean;
  title: string;
  subtitle: string;
  role: string;
  select: (role: string) => void;
}) => {
  return (
    <Pressable
      onPress={() => select("merchant")}
      style={[
        styles.card,
        {
          borderColor: isSelected ? "#ffffffcc" : "#ffffff44",
        },
      ]}
    >
      <View style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.contentTitle}>{title}</Text>
        <Text style={styles.contentSubtext}>{subtitle}</Text>
      </View>

      <View
        style={[
          styles.activeIndicator,
          {
            backgroundColor: isSelected ? "#ffffff" : "transparent",
          },
        ]}
      >
        <View style={styles.innerCircle} />
      </View>
    </Pressable>
  );
};

export default UserRole;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    paddingHorizontal: 15,
    backgroundColor: "#000000",
  },
  header: {
    marginBottom: 70,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 28,
    letterSpacing: 0.1,
    color: "#ffffffcc",
    fontFamily: "Jakarta-Bold",
  },
  headerSubtext: {
    textAlign: "center",
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Jakarta-Regular",
    marginTop: 5,
  },
  cards: {
    width: "100%",
    gap: 60,
  },
  card: {
    width: "100%",
    paddingRight: 15,
    paddingLeft: 60,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: "row",
    gap: 15,
  },
  image: {
    position: "absolute",
    top: -15,
    bottom: -10,
    width: 30,
    marginLeft: 10,
    transform: [{ rotate: "15deg" }],
    backgroundColor: "gray",
  },
  content: {
    gap: 10,
    flex: 1,
  },
  contentTitle: {
    fontSize: 16,
    letterSpacing: 1,
    color: "#ffffffcc",
    fontFamily: "Jakarta-Bold",

    textTransform: "uppercase",
  },
  contentSubtext: {
    fontSize: 15,
    color: "#ffffffcc",
    lineHeight: 25,
    fontFamily: "Jakarta-Regular",
  },

  activeIndicator: {
    width: 20,
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#ffffff",
    marginVertical: "auto",
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 10,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "#000000",
  },
});
