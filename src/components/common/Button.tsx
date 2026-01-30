import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
    ActivityIndicator,
    Platform,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          container: { backgroundColor: colors.primary },
          text: { color: "#FFFFFF" },
        };
      case "secondary":
        return {
          container: { backgroundColor: colors.blue },
          text: { color: "#FFFFFF" },
        };
      case "accent":
        return {
          container: { backgroundColor: colors.accent },
          text: { color: "#FFFFFF" },
        };
      case "danger":
        return {
          container: { backgroundColor: colors.error },
          text: { color: "#FFFFFF" },
        };
      case "outline":
        return {
          container: {
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: colors.border,
          },
          text: { color: colors.text },
        };
      case "ghost":
        return {
          container: { backgroundColor: "transparent" },
          text: { color: colors.primary },
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: "#FFFFFF" },
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          container: { height: 36, paddingHorizontal: 16 },
          text: { fontSize: 13 },
        };
      case "md":
        return {
          container: { height: 48, paddingHorizontal: 24 },
          text: { fontSize: 15 },
        };
      case "lg":
        return {
          container: { height: 56, paddingHorizontal: 32 },
          text: { fontSize: 17 },
        };
      case "xl":
        return {
          container: { height: 64, paddingHorizontal: 40 },
          text: { fontSize: 18 },
        };
      default:
        return {
          container: { height: 48, paddingHorizontal: 24 },
          text: { fontSize: 15 },
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles.container,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text.color} size="small" />
      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              sizeStyles.text,
              variantStyles.text,
              icon ? { marginLeft: 8 } : null,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
});
