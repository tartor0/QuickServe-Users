import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAppSelector } from "@/src/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export const OrderConfirmationScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const activeOrder = useAppSelector((s) => s.orders.activeOrder);

  // Use the live activeOrder if IDs match, otherwise fall back to the param
  const displayId = (activeOrder?.id ?? orderId ?? "").slice(-6).toUpperCase();
  const eta = activeOrder?.estimatedDeliveryTime ?? "25-35 min";
  const address = activeOrder?.deliveryAddress ?? "Your saved address";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Success Animation Placeholder */}
        <View style={styles.successIconContainer}>
          <LinearGradient
            colors={["#10b981", "#059669"]}
            style={styles.successIconBg}
          >
            <MaterialIcons name="check" size={60} color="#fff" />
          </LinearGradient>
          {/* Decorative Rings */}
          <View
            style={[
              styles.ring,
              {
                borderColor: "rgba(16, 185, 129, 0.2)",
                width: 140,
                height: 140,
              },
            ]}
          />
          <View
            style={[
              styles.ring,
              {
                borderColor: "rgba(16, 185, 129, 0.1)",
                width: 180,
                height: 180,
              },
            ]}
          />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Order Placed!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your order #{displayId} has been placed and is being prepared.
        </Text>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoRow}>
            <MaterialIcons name="schedule" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>
              Estimated delivery: {eta}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]} numberOfLines={1}>
              {address}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.trackBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/orders/tracking" as any)}
        >
          <Text style={styles.trackBtnText}>Track My Order</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace("/(tabs)/" as any)}
        >
          <Text style={[styles.homeBtnText, { color: colors.textSecondary }]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  successIconContainer: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  successIconBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ring: {
    position: "absolute",
    borderRadius: 100,
    borderWidth: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  infoCard: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 16,
  },
  trackBtn: {
    width: "100%",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  trackBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  homeBtn: {
    paddingVertical: 12,
  },
  homeBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
