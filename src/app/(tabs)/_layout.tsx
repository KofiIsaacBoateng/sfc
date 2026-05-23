import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#fff",
        tabBarBackground: () => (
          <View
            style={{
              backgroundColor: "#000000",
              position: "absolute",
              padding: 0,
              inset: 0,
              margin: 0,
            }}
          />
        ),
        headerShown: false,
      }}
      initialRouteName="home"
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: () => (
            <Ionicons name="home" size={20} color={"#ffffff"} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => (
            <Ionicons name="person" size={20} color={"#ffffff"} />
          ),
        }}
      />
    </Tabs>
  );
}
