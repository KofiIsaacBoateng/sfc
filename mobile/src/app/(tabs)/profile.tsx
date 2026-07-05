import SettingOptions from "@/components/profile/SettingOptions";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import React, { useSyncExternalStore } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: top + 10 }]}>
      {/*** header */}
      <View style={styles.header}>
        {/**** title */}
        <Text style={styles.title}>Profile</Text>
        {/**** edit */}
        <Pressable style={styles.edit} onPress={() => {}}>
          <FontAwesome6 name="edit" size={18} color="#ffffffaa" />
        </Pressable>
      </View>
      {/**** profile image */}
      <ScrollView
        style={styles.settings}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.pp} onPress={() => {}}>
          <Image
            source={{
              uri: "https://api.dicebear.com/10.x/toon-head/png?seed=kofi-boateng",
            }}
            style={styles.ppImg}
            resizeMode="contain"
          />
          <View style={styles.ppCamera}>
            <Ionicons name="camera-outline" size={18} color="#ffffff" />
          </View>
        </Pressable>

        {/**** settings */}
        <SettingOptions />
        {/**** logout */}
        <Pressable style={styles.logout} onPress={() => {}}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000000",
    paddingHorizontal: 15,
  },

  header: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 30,
  },

  title: {
    color: "#ffffffcc",
    fontFamily: "Jakarta-Regular",
    fontSize: 18,
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },

  edit: {
    padding: 5,
    marginLeft: "auto",
  },

  pp: {
    width: 80,
    aspectRatio: 1,
    borderRadius: 50,
    backgroundColor: "#a5bbdf",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginHorizontal: "auto",
    overflowX: "hidden",
  },

  ppImg: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 50,
    marginTop: -25,
  },

  ppCamera: {
    position: "absolute",
    bottom: -10,
    right: -5,
    backgroundColor: "#000000",
    padding: 10,
    borderRadius: 50,
  },

  settings: {
    marginTop: 20,
  },

  logout: {},
  logoutText: {},
});
