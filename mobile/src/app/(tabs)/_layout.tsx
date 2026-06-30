import { Tabs } from "expo-router";
import React from "react";

import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#a5bbdf",
        tabBarInactiveTintColor: "#ffffff88",
        tabBarStyle: {
          backgroundColor: "#020202",
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
              color={focused ? "#a5bbdf" : "#ffffff88"}
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
              color={focused ? "#a5bbdf" : "#ffffff88"}
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
              color={focused ? "#a5bbdf" : "#ffffff88"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
