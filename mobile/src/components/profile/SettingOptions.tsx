import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { DynamicIconProp, SETTINGS } from "@/constants/constants";
import { DynamicIcon } from "../global/DynamicIcon";
import CustomSwitch from "../global/Switch";

const SettingOptions = () => {
  return SETTINGS.map((setting, i) => (
    <View key={i} style={styles.options}>
      <Text style={styles.optionsTitle}>{setting.category}</Text>

      {/***** options */}
      <View style={styles.optionsList}>
        {setting.settings.map((set, i) => (
          <View key={i}>
            {i > 0 && <View style={styles.separator} />}
            <Option {...set} />
          </View>
        ))}
      </View>
    </View>
  ));
};

const Option = ({
  label,
  icon,
  cta,
}: {
  label: string;
  icon: DynamicIconProp;
  cta: { type: "switch" | "button"; action: (value?: any) => void };
}) => {
  return (
    <Pressable onPress={() => {}} style={styles.option}>
      <DynamicIcon iconData={icon} size={18} color="#ffffffcc" />
      <Text style={styles.optionTitle}>{label}</Text>
      {cta.type === "button" ? (
        <Pressable onPress={cta.action} style={styles.optionCta}>
          <FontAwesome5 name="angle-right" size={18} color="#ffffffcc" />
        </Pressable>
      ) : (
        <View style={{ marginLeft: "auto" }}>
          <CustomSwitch onToggle={cta.action} />
        </View>
      )}
    </Pressable>
  );
};

export default SettingOptions;

const styles = StyleSheet.create({
  options: {
    gap: 10,
  },

  optionsTitle: {
    color: "#ffffffcc",
    fontFamily: "Jakarta-SemiBold",
    fontSize: 18,
    marginVertical: 15,
  },

  optionsList: {
    backgroundColor: "#0c1018",
    borderRadius: 15,
  },
  separator: {
    height: 1,
    marginHorizontal: 10,
    backgroundColor: "#ffffff22",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },

  optionTitle: {
    color: "#ffffffcc",
    fontFamily: "Jakarta-SemiBold",
    fontSize: 15,
  },

  optionCta: {
    marginLeft: "auto",
    marginRight: 10,
  },
});
