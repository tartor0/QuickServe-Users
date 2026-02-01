import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const ONBOARDING_DATA = [
  {
    id: 1,
    title: "Fastest Delivery\nin Town",
    description:
      "Order from your favorite restaurants and get real-time tracking to your door.",
    image: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png",
  },
  {
    id: 2,
    title: "Track Your\nOrder Live",
    description:
      "Real-time GPS tracking so you know exactly when your food will arrive.",
    image: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  },
  {
    id: 3,
    title: "Exclusive\nRewards",
    description:
      "Earn points with every order and unlock amazing discounts and perks.",
    image: "https://cdn-icons-png.flaticon.com/512/3135/3135706.png",
  },
];

export const OnboardingScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/auth/signup");
    }
  };

  const handleSkip = () => {
    router.replace("/auth/login");
  };

  const currentSlide = ONBOARDING_DATA[currentIndex];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Logo Header */}
      <View style={styles.header}>
        <MaterialIcons name="rocket-launch" size={32} color={colors.primary} />
        <Text style={[styles.logo, { color: colors.primary }]}>QuickServe</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Decorative Blob */}
        <View style={styles.blobContainer}>
          <LinearGradient
            colors={[colors.primary + "1A", "transparent"]}
            style={styles.blob}
          />
        </View>

        {/* Illustration */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentSlide.image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {currentSlide.title.split("\n")[0]}
            {"\n"}
            <Text style={{ color: colors.primary }}>
              {currentSlide.title.split("\n")[1]}
            </Text>
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {currentSlide.description}
          </Text>
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex
                  ? [styles.activeDot, { backgroundColor: colors.accent }]
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary, shadowColor: colors.primary },
          ]}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === ONBOARDING_DATA.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Secondary Link */}
        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 16,
    gap: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: "800",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  blobContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -128,
    marginTop: -128,
  },
  blob: {
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 24,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    maxWidth: 320,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 24,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  activeDot: {
    width: 32,
  },
  inactiveDot: {
    width: 10,
    backgroundColor: "#d1d5db",
  },
  button: {
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
  },
});
