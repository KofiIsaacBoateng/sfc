import { Tabs } from "expo-router";
import React from "react";

import {
  Feather,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#a5bbdfcc",
        tabBarInactiveTintColor: "#a5bbdf55",
        tabBarLabelStyle: {
          fontSize: 11,
          letterSpacing: 0.5,
          fontFamily: "Jakarta-Regular",
        },
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#ffffff22",
          minHeight: 80,
          paddingTop: 10,
        },
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={22}
              color={focused ? "#a5bbdfcc" : "#a5bbdf55"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => (
            <FontAwesome6
              name="nfc-symbol"
              size={19}
              color={focused ? "#a5bbdfcc" : "#a5bbdf55"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="account-cog-outline"
              size={25}
              color={focused ? "#a5bbdfcc" : "#a5bbdf55"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
