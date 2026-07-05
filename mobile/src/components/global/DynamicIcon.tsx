import {
  DynamicIconProp,
  IconLibraries,
  IconLibraryType,
} from "@/constants/constants";

interface DynamicIconProps {
  iconData: DynamicIconProp;
  size?: number;
  color?: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconData,
  size = 24,
  color = "black",
}) => {
  // Dynamically looks up the correct library component from the mapping object
  const SelectedIconLibrary = IconLibraries[iconData.lib];

  // Cast name as any to bypass internal typing limits of dynamic component rendering
  return (
    <SelectedIconLibrary
      name={iconData.name as any}
      size={size}
      color={color}
    />
  );
};
