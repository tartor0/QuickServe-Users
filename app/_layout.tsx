import { ThemeProvider } from "@/src/context/ThemeContext";
import { supabase } from "@/src/services/supabase";
import { clearAuth, setSession } from "@/src/store/slices/authSlice";
import { store } from "@/src/store/store";
import type { RootState, AppDispatch } from "@/src/store/store";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useColorScheme } from "@/hooks/use-color-scheme";

SplashScreen.preventAutoHideAsync();

// ─── Root entry point — sets up Redux and Theme providers ─────────────────────
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
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </Provider>
  );
}

// ─── Inner component — has access to Redux store (inside Provider) ─────────────
function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [authChecked, setAuthChecked] = useState(false);

  // Step 1: Check existing session on first load, then subscribe to changes
  useEffect(() => {
    // Check if a session already exists (e.g. from a previous app open)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        dispatch(setSession({ user: session.user, session }));
      }
      setAuthChecked(true); // allow routing decisions to run
    });

    // Subscribe to all future auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setSession({ user: session.user, session }));
      } else {
        dispatch(clearAuth());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  // Step 2: Route guard — redirect based on auth state
  useEffect(() => {
    if (!authChecked) return;

    const inAuthGroup =
      segments[0] === "auth" ||
      segments[0] === undefined ||
      segments.length === 0;

    if (isAuthenticated && inAuthGroup) {
      // Logged in but on an auth screen → go to the app
      router.replace("/(tabs)");
    } else if (!isAuthenticated && !inAuthGroup) {
      // Not logged in but inside the app → force back to onboarding
      router.replace("/auth/onboarding");
    }
  }, [isAuthenticated, authChecked, segments, router]);

  // Hold rendering until we know auth state — prevents flash of wrong screen
  if (!authChecked) return null;

  return (
    <NavigationThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
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

        {/* Cart */}
        <Stack.Screen
          name="cart"
          options={{ presentation: "modal", animation: "slide_from_bottom" }}
        />

        {/* Generic Modal */}
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </NavigationThemeProvider>
  );
}
