import { PropsWithChildren, useEffect } from "react";
import Animated, { SlideInDown, SlideOutUp } from "react-native-reanimated";

const Intro = ({ children, exit }: PropsWithChildren<{ exit: () => void }>) => {
  useEffect(() => {
    let timeout = setTimeout(() => {
      exit();
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <Animated.View
      entering={SlideInDown.duration(500)}
      exiting={SlideOutUp.duration(500)}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
    >
      {children}
    </Animated.View>
  );
};

export default Intro;
