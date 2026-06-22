import { ImageSourcePropType } from "react-native";

export const SLIDES: {
  id: string;
  title: string;
  subtext: string;
  image: ImageSourcePropType;
}[] = [
  {
    id: "1",
    title: "Goodbye USSD, Hello Tap.",
    subtext:
      "No more long codes or waiting for prompts. Pay and get paid in under a second with your bracelet or card.",
    image: require("../../assets/images/onboarding/tap-and-go.png"),
  },
  {
    id: "2",
    title: "Bank-Grade Hardware Lock.",
    subtext:
      "Your digital wallet is protected by advanced cryptographic chips. Unclonable. Untamperable. Untouchable.",
    image: require("../../assets/images/onboarding/secured-account.png"),
  },
  {
    id: "3",
    title: "High-Velocity Transfers",
    subtext:
      "Move funds across networks at physical speed. Instant peer-to-peer execution with zero structural delay.",
    image: require("../../assets/images/onboarding/fast.png"),
  },
];

export const NETWORK_CODES: { mtn: string[]; telecel: string[] } = {
  mtn: ["024", "054", "025", "055", "059", "053"],
  telecel: ["020", "050"],
};
