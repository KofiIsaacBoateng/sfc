import { ImageSourcePropType } from "react-native";
import {
  Feather,
  FontAwesome,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { JSX } from "react";

/**** Onboarding screen slides */
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

/**** Accepted mobile network codes */
export const NETWORK_CODES: { mtn: string[]; telecel: string[] } = {
  mtn: ["024", "054", "025", "055", "059", "053"],
  telecel: ["020", "050"],
};

{
  /*** Dynamic Icons for Profile Screens */
}

export const IconLibraries = {
  ionic: Ionicons,
  fa: FontAwesome,
  materialC: MaterialCommunityIcons,
  material: MaterialIcons,
  fet: Feather,
  fa6: FontAwesome6,
};

export type IconLibraryType = keyof typeof IconLibraries;

// Create a helper type to extract names from a specific component map
type IconNamesFor<T extends React.JSXElementConstructor<any>> =
  React.ComponentProps<T>["name"];

// Define the discriminated union for the icon data shape
export type DynamicIconProp =
  | { lib: "ionic"; name: IconNamesFor<typeof Ionicons> }
  | { lib: "material"; name: IconNamesFor<typeof MaterialIcons> }
  | { lib: "materialC"; name: IconNamesFor<typeof MaterialCommunityIcons> }
  | { lib: "fet"; name: IconNamesFor<typeof Feather> }
  | { lib: "fa"; name: IconNamesFor<typeof FontAwesome> }
  | { lib: "fa6"; name: IconNamesFor<typeof FontAwesome6> };

type SettingType = {
  label: string;
  icon: DynamicIconProp;
};

interface SETTINGS_TYPE {
  category: string;
  settings: SettingType[];
}

export const SETTINGS: SETTINGS_TYPE[] = [
  {
    category: "Appearance",
    settings: [
      { label: "Dark Mode", icon: { lib: "ionic", name: "moon-outline" } },
    ],
  },
  {
    category: "General",
    settings: [
      { label: "My Account", icon: { lib: "ionic", name: "person-outline" } },
      {
        label: "Notifications",
        icon: { lib: "ionic", name: "notifications-outline" },
      },
      { label: "Toggle Features", icon: { lib: "fa6", name: "nfc-symbol" } },
      {
        label: "Privacy and Security",
        icon: { lib: "material", name: "security" },
      },
    ],
  },
  {
    category: "Contact & Support",
    settings: [
      {
        label: "Report an Issue",
        icon: { lib: "fa", name: "question-circle-o" },
      },
      {
        label: "FAQ",
        icon: { lib: "fet", name: "alert-triangle" },
      },
      {
        label: "Rate Us",
        icon: { lib: "materialC", name: "star-circle-outline" },
      },
    ],
  },
];
