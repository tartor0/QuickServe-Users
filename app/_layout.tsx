import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { ThemeProvider } from '@/src/context/ThemeContext';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { useColorScheme } from "@/hooks/use-color-scheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <NavigationThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />

        {/* Main App (Tabs) */}
        <Stack.Screen name="(tabs)" />

        {/* Profile Stack */}
        <Stack.Screen
          name="profile/payment-methods"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="profile/subscription"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="profile/referral" />
        <Stack.Screen
          name="profile/delete-account"
          options={{ presentation: "card" }}
        />

        {/* Seller Stack */}
        <Stack.Screen
          name="seller/[id]"
          options={{ presentation: "card", animation: "slide_from_right" }}
        />

        {/* Orders Stack */}
        <Stack.Screen
          name="orders/tracking"
          options={{ presentation: "card" }}
        />

        {/* Rewards */}
        <Stack.Screen name="rewards/index" />

        {/* Search */}
        <Stack.Screen
          name="search/filters"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />

        {/* Generic Modal */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
