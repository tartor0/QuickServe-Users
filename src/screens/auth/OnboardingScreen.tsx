import { Button } from "@/components/common/Button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const { width, height } = Dimensions.get("window");

export const OnboardingScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header / Logo */}
      <View style={styles.header}>
        <MaterialIcons name="rocket-launch" size={32} color={colors.primary} />
        <Text style={[styles.logoText, { color: colors.primary }]}>
          QuickServe
        </Text>
      </View>

      {/* Hero Section */}
      <View style={styles.heroContainer}>
        {/* Abstract Blob Decoration */}
        <View style={styles.blob} />

        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1617347454431-7594357ef74e?q=80&w=400",
          }}
          style={styles.heroImage}
          resizeMode="contain"
        />

        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            Fastest Delivery {"\n"}
            <Text style={{ color: colors.primary }}>in Town</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Order from your favorite restaurants and get real-time tracking to
            your door.
          </Text>
        </View>
      </View>

      {/* Footer / Controls */}
      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        {/* Pagination Indicators */}
        <View style={styles.pagination}>
          <View
            style={[
              styles.dot,
              styles.activeDot,
              { backgroundColor: "#ec4899" },
            ]}
          />
          <View
            style={[
              styles.dot,
              {
                backgroundColor: colorScheme === "dark" ? "#334155" : "#E2E8F0",
              },
            ]}
          />
          <View
            style={[
              styles.dot,
              {
                backgroundColor: colorScheme === "dark" ? "#334155" : "#E2E8F0",
              },
            ]}
          />
        </View>

        <Button
          title="Get Started"
          onPress={() => {}}
          size="lg"
          variant="secondary"
          style={styles.getStartedBtn}
          icon={
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          }
        />

        <TouchableOpacity style={styles.loginLink}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Already have an account?{" "}
            <Text style={styles.loginHighlight}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  logoText: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  heroContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  blob: {
    position: "absolute",
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: "rgba(236, 72, 153, 0.05)",
    zIndex: -1,
  },
  heroImage: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 24,
  },
  textContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeDot: {
    width: 32,
  },
  getStartedBtn: {
    width: "100%",
  },
  loginLink: {
    marginTop: 24,
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginHighlight: {
    color: "#ec4899",
    fontWeight: "bold",
  },
});
