// hooks/useTheme.ts
import { useColorScheme } from "react-native";
import { Colors } from "../constants/colors"; // Your global file from earlier

export function useTheme() {
  const scheme = useColorScheme() ?? "light";
  return Colors[scheme];
}
