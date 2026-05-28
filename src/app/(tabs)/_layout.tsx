import { Tabs } from "expo-router";
import React from "react";

import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#ffffff87",
        tabBarStyle: {
          backgroundColor: "#10161f",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#ffffff44",
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
              size={20}
              color={focused ? "#ffffff" : "#ffffff87"}
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
              size={18}
              color={focused ? "#ffffff" : "#ffffff87"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={16}
              color={focused ? "#ffffff" : "#ffffff87"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
