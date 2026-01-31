import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TRACKING_STEPS = [
  { id: 1, label: "Preparing", completed: true },
  { id: 2, label: "Picked Up", completed: true },
  { id: 3, label: "Nearby", completed: true },
  { id: 4, label: "Arriving", completed: false, active: true },
];

export const OrderTrackingScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Bar */}
      <View
        style={[styles.topBar, { backgroundColor: "rgba(255,255,255,0.8)" }]}
      >
        <TouchableOpacity
          style={[styles.topBarBtn, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={[styles.orderBadge, { backgroundColor: colors.surface }]}>
          <Text style={[styles.orderBadgeText, { color: colors.text }]}>
            Order #2492
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.topBarBtn, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.helpText, { color: colors.text }]}>Help</Text>
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={[styles.mapPlaceholder, { backgroundColor: "#e5e7eb" }]}>
          <Text style={styles.mapText}>Live Map</Text>

          {/* Destination Marker */}
          <View style={styles.destinationMarker}>
            <View style={styles.destinationLabel}>
              <Text style={styles.destinationText}>Home</Text>
            </View>
            <MaterialIcons name="location-on" size={36} color="#ef4444" />
          </View>

          {/* Driver Marker */}
          <View style={styles.driverMarker}>
            <View
              style={[styles.driverIcon, { backgroundColor: colors.primary }]}
            >
              <MaterialIcons name="two-wheeler" size={24} color="#fff" />
            </View>
          </View>
        </View>

        {/* Recenter Button */}
        <TouchableOpacity
          style={[styles.recenterBtn, { backgroundColor: colors.surface }]}
        >
          <MaterialIcons name="my-location" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Drawer */}
      <View style={[styles.bottomDrawer, { backgroundColor: colors.surface }]}>
        {/* Drag Handle */}
        <View style={styles.dragHandle}>
          <View style={styles.dragHandleBar} />
        </View>

        <ScrollView
          style={styles.drawerScroll}
          contentContainerStyle={styles.drawerContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Status & ETA */}
          <View style={styles.statusContainer}>
            <View>
              <Text style={[styles.etaText, { color: colors.text }]}>
                Arriving in 4 mins
              </Text>
              <Text
                style={[styles.statusText, { color: colors.textSecondary }]}
              >
                Driver is nearby
              </Text>
            </View>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <MaterialIcons name="sync" size={24} color={colors.primary} />
            </View>
          </View>

          {/* Progress Stepper */}
          <View style={styles.progressContainer}>
            {TRACKING_STEPS.map((step, index) => (
              <View
                key={step.id}
                style={[
                  styles.progressStep,
                  step.completed && { backgroundColor: colors.primary },
                  step.active && { backgroundColor: "rgba(59, 130, 246, 0.3)" },
                  !step.completed &&
                    !step.active && { backgroundColor: colors.border },
                ]}
              />
            ))}
          </View>

          {/* Driver Profile Card */}
          <View
            style={[styles.driverCard, { backgroundColor: colors.background }]}
          >
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=David+M&size=48&background=3B82F6&color=fff",
              }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverInfo}>
              <View style={styles.driverNameRow}>
                <Text style={[styles.driverName, { color: colors.text }]}>
                  David M.
                </Text>
                <View style={styles.proBadge}>
                  <Text style={styles.proText}>PRO</Text>
                </View>
              </View>
              <Text
                style={[styles.driverVehicle, { color: colors.textSecondary }]}
              >
                Black Yamaha NMAX • B 1234 XYZ
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.callBtn,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <MaterialIcons name="call" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.chatBtn, { backgroundColor: colors.primary }]}
            >
              <MaterialIcons name="chat-bubble" size={20} color="#fff" />
              <Text style={styles.chatBtnText}>Chat with David</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.orderDetailsBtn}
              onPress={() => setShowOrderDetails(!showOrderDetails)}
            >
              <Text
                style={[
                  styles.orderDetailsText,
                  { color: colors.textSecondary },
                ]}
              >
                View Order Details (3 items)
              </Text>
              <MaterialIcons
                name={
                  showOrderDetails ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={18}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Order Details Accordion */}
          {showOrderDetails && (
            <View
              style={[
                styles.orderDetails,
                { backgroundColor: colors.background },
              ]}
            >
              <View style={styles.orderItem}>
                <Text
                  style={[styles.orderItemQty, { color: colors.textSecondary }]}
                >
                  1x
                </Text>
                <Text style={[styles.orderItemName, { color: colors.text }]}>
                  Signature Whopper
                </Text>
                <Text style={[styles.orderItemPrice, { color: colors.text }]}>
                  $12.99
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text
                  style={[styles.orderItemQty, { color: colors.textSecondary }]}
                >
                  1x
                </Text>
                <Text style={[styles.orderItemName, { color: colors.text }]}>
                  Loaded Cheesy Fries
                </Text>
                <Text style={[styles.orderItemPrice, { color: colors.text }]}>
                  $6.99
                </Text>
              </View>
              <View style={styles.orderItem}>
                <Text
                  style={[styles.orderItemQty, { color: colors.textSecondary }]}
                >
                  1x
                </Text>
                <Text style={[styles.orderItemName, { color: colors.text }]}>
                  Strawberry Shake
                </Text>
                <Text style={[styles.orderItemPrice, { color: colors.text }]}>
                  $4.50
                </Text>
              </View>
              <View
                style={[styles.orderTotal, { borderTopColor: colors.border }]}
              >
                <Text style={[styles.orderTotalLabel, { color: colors.text }]}>
                  Total
                </Text>
                <Text style={[styles.orderTotalPrice, { color: colors.text }]}>
                  $24.48
                </Text>
              </View>
            </View>
          )}

          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  topBarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  orderBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  orderBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  helpText: {
    fontSize: 14,
    fontWeight: "700",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9ca3af",
  },
  destinationMarker: {
    position: "absolute",
    top: "22%",
    right: "37%",
    alignItems: "center",
  },
  destinationLabel: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },
  driverMarker: {
    position: "absolute",
    bottom: "25%",
    left: "30%",
  },
  driverIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  recenterBtn: {
    position: "absolute",
    bottom: 32,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomDrawer: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    maxHeight: "65%",
  },
  dragHandle: {
    width: "100%",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  dragHandleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
  },
  drawerScroll: {
    flex: 1,
  },
  drawerContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  etaText: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  progressStep: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    gap: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
  },
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "700",
  },
  proBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  driverVehicle: {
    fontSize: 12,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionsContainer: {
    gap: 16,
  },
  chatBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    gap: 10,
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  chatBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  orderDetailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  orderDetailsText: {
    fontSize: 14,
    fontWeight: "600",
  },
  orderDetails: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderItemQty: {
    fontSize: 14,
    fontWeight: "600",
    width: 24,
  },
  orderItemName: {
    flex: 1,
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  orderTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  orderTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  orderTotalPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
});
