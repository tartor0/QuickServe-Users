import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: "#ee2b8c",
    accent: "#f04299",
    background: "#f8f6f7",
    surface: "#ffffff",
    text: "#181114",
    textSecondary: "#64748B",
    border: "#e6dbe0",
    error: "#ef4444",
    success: "#10b981",
    blue: "#2563eb",
    neonBlue: "#3b82f6",
    card: "#ffffff",
    tint: "#ee2b8c",
    icon: "#11181C",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#ee2b8c",
  },
  dark: {
    primary: "#ee2b8c",
    accent: "#f04299",
    background: "#0F172A",
    surface: "#1e293b",
    text: "#ffffff",
    textSecondary: "#94A3B8",
    border: "#334155",
    error: "#ef4444",
    success: "#10b981",
    blue: "#3b82f6",
    neonBlue: "#3b82f6",
    card: "#1e293b",
    tint: "#fff",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#fff",
  },
};

export const Typography = {
  fontFamily: Platform.select({
    ios: "PlusJakartaSans-Regular",
    android: "PlusJakartaSans_400Regular",
    default: "System",
  }),
  fontFamilyBold: Platform.select({
    ios: "PlusJakartaSans-Bold",
    android: "PlusJakartaSans_700Bold",
    default: "System",
  }),
  fontFamilyExtraBold: Platform.select({
    ios: "PlusJakartaSans-ExtraBold",
    android: "PlusJakartaSans_800ExtraBold",
    default: "System",
  }),
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  default: 16,
  lg: 32,
  xl: 48,
  full: 9999,
};
export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
