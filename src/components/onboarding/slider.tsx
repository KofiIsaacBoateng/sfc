import React, { PropsWithChildren } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { RoundBtn, TextBtn } from "./buttons";

const { width, height } = Dimensions.get("screen");

const SliderWrapper = ({ children }: PropsWithChildren) => {
  return <View style={styles.container}>{children}</View>;
};

const Intro = ({
  onNext,
  onSkip,
}: {
  onNext: () => void;
  onSkip: () => void;
}) => {
  return (
    <SliderWrapper>
      {/*** backgroundImage [coming soon] */}
      <View style={[styles.textWrapper, { marginVertical: "auto" }]}>
        <Text style={styles.title}>
          <Text style={styles.bold}>Speed</Text> of Cash
        </Text>
        <Text style={styles.title}>
          <Text style={styles.bold}>Power</Text> of Momo
        </Text>
        <Text style={styles.title}>
          Just <Text style={styles.bold}>Tap</Text> and Go
        </Text>
        <RoundBtn style={{ marginTop: 10 }} onPress={onNext} />
      </View>
      <TextBtn
        style={{ marginTop: "auto", marginBottom: 20 }}
        title="skip"
        onPress={onSkip}
      />
    </SliderWrapper>
  );
};

const Slider = ({
  title,
  subtext,
  image,
  onNext,
  onSkip,
}: {
  title: string;
  subtext: string;
  image: string;
  onNext: () => void;
  onSkip: () => void;
}) => {
  return (
    <SliderWrapper>
      {/*** image [coming soon] */}
      <View style={styles.image} />
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.title,
            {
              textAlign: "center",
              textTransform: "uppercase",
              fontWeight: "500",
              fontSize: 35,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.subtext,
            {
              textAlign: "center",
              fontWeight: "300",
            },
          ]}
        >
          {subtext}
        </Text>
      </View>
      <View style={styles.footer}>
        <RoundBtn onPress={onNext} />
        <TextBtn title="skip" onPress={onSkip} />
      </View>
    </SliderWrapper>
  );
};

export { Intro, Slider };

const styles = StyleSheet.create({
  container: {
    width,
    height: "100%",
    paddingHorizontal: 15,
  },

  image: {
    width: "100%",
    height: "60%",
  },

  textWrapper: {
    gap: 2,
  },
  title: {
    color: "#ffffffcc",
    fontSize: 40,
    letterSpacing: 0.1,
    wordWrap: "nowrap",
  },
  bold: {
    textTransform: "uppercase",
    fontWeight: "900",
    fontSize: 45,
  },
  subtext: {
    color: "#ffffffdd",
    lineHeight: 20,
    marginTop: 10,
    fontSize: 16,
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
