import { useTheme } from "next-themes";
import Image from "next/image";

interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 100 }: LogoProps) => {
  const { theme, resolvedTheme } = useTheme();

  const currentTheme = theme || resolvedTheme;

  // Dynamic logo styling based on theme
  const getLogoStyle = () => {
    switch (currentTheme) {
      case "light":
        return {
          filter:
            "brightness(0) saturate(100%) invert(8%) sepia(7%) saturate(1077%) hue-rotate(314deg) brightness(95%) contrast(86%)",
        }; // Dark gray
      case "ocean":
        return {
          filter:
            "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(199deg) brightness(118%) contrast(119%)",
        }; // Ocean blue
      case "sunset":
        return {
          filter:
            "brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%) hue-rotate(360deg) brightness(118%) contrast(119%)",
        }; // Orange/red
      case "rose":
        return {
          filter:
            "brightness(0) saturate(100%) invert(49%) sepia(85%) saturate(3661%) hue-rotate(300deg) brightness(101%) contrast(91%)",
        }; // Pink
      case "dark":
        return { filter: "none" };
      default:
        // Default to dark gray for better contrast when theme is undefined
        return {
          filter:
            "brightness(0) saturate(100%) invert(8%) sepia(7%) saturate(1077%) hue-rotate(314deg) brightness(95%) contrast(86%)",
        };
    }
  };

  return (
    <Image
      src="/logo-white.svg"
      alt="1nbox"
      width={size}
      height={size}
      className="transition-all duration-200"
      style={getLogoStyle()}
    />
  );
};
