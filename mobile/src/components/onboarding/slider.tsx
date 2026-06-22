import React, { PropsWithChildren } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
        style={{ marginTop: "auto", marginBottom: 20, marginLeft: 15 }}
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
  image: ImageSourcePropType;
  onNext: () => void;
  onSkip: () => void;
}) => {
  return (
    <SliderWrapper>
      <Image source={image} style={styles.image} />
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.title,
            {
              textAlign: "center",
              textTransform: "uppercase",
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
  },

  image: {
    width: "90%",
    height: "60%",
    marginHorizontal: "auto",
    objectFit: "contain",
    marginTop: "auto",
  },

  textWrapper: {
    paddingHorizontal: 15,
    gap: 2,
  },
  title: {
    color: "#ffffffcc",
    fontSize: 40,
    letterSpacing: 0.1,
    wordWrap: "nowrap",
    fontFamily: "Jakarta-Regular",
  },
  bold: {
    textTransform: "uppercase",
    fontFamily: "Jakarta-Bold",
    fontSize: 45,
  },
  subtext: {
    color: "#ffffffdd",
    lineHeight: 20,
    marginTop: 10,
    fontSize: 16,
    fontFamily: "Jakarta-Regular",
  },
  footer: {
    marginTop: "auto",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
});
