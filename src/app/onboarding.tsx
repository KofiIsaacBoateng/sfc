import { Intro, Slider } from "@/components/onboarding/slider";
import { SLIDES } from "@/constants/constants";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("screen");
const totalScreens = SLIDES.length + 1;
const onboarding = () => {
  const { bottom } = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < totalScreens) {
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      skip();
    }
  };

  const scrollWatch = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    // Round to the nearest page layout width
    const pageIndex = Math.round(offsetX / width);
    setCurrentIndex(pageIndex);
  };

  const skip = () => {
    router.navigate("/authentication");
  };

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: bottom, flexDirection: "row" },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{}}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onMomentumScrollEnd={scrollWatch}
      >
        <Intro onNext={scrollToNext} onSkip={skip} />
        {SLIDES.map(({ title, subtext, id }) => (
          <Slider
            key={id}
            title={title}
            subtext={subtext}
            image=""
            onNext={scrollToNext}
            onSkip={skip}
          />
        ))}
      </ScrollView>

      {/**** scroll indicators */}
      <View style={styles.indicators}>
        {Array.from({ length: totalScreens }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              currentIndex === i ? styles.activeIndicator : {},
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  indicators: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 35,
    left: 0,
    right: 0,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: "#ffffff85",
  },

  activeIndicator: {
    backgroundColor: "#ffffff",
    width: 20,
  },
});
