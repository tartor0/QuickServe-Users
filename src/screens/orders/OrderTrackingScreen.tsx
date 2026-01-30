import { Button } from "@/components/common/Button";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export const OrderTrackingScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {/* Map Layer (Simulated) */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800",
          }}
          style={[
            styles.mapImage,
            { opacity: colorScheme === "dark" ? 0.6 : 1 },
          ]}
        />

        {/* Destination Marker */}
        <View style={[styles.markerContainer, { top: "22%", right: "37%" }]}>
          <View
            style={[styles.markerLabel, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.markerLabelText, { color: colors.text }]}>
              Home
            </Text>
          </View>
          <MaterialIcons name="location-on" size={40} color="#ef4444" />
        </View>

        {/* Driver Marker */}
        <View style={[styles.markerContainer, { bottom: "25%", left: "30%" }]}>
          <View style={styles.driverPulse}>
            <View style={styles.driverIconBg}>
              <MaterialIcons name="two-wheeler" size={24} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Overlay App Bar */}
        <View style={styles.overlayHeader}>
          <TouchableOpacity
            style={[styles.circleBtn, { backgroundColor: colors.surface }]}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View
            style={[styles.orderIdBadge, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.orderIdText, { color: colors.text }]}>
              Order #2492
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.helpBtn, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.helpBtnText, { color: colors.textSecondary }]}>
              Help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recenter FAB */}
        <TouchableOpacity
          style={[styles.recenterBtn, { backgroundColor: colors.surface }]}
        >
          <MaterialIcons name="my-location" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Bottom Drawer */}
      <View style={[styles.drawer, { backgroundColor: colors.surface }]}>
        <View style={styles.dragHandle} />

        <View style={styles.drawerContent}>
          <View style={styles.statusRow}>
            <View>
              <Text style={[styles.etaText, { color: colors.text }]}>
                Arriving in 4 mins
              </Text>
              <Text style={styles.statusSubtext}>Driver is nearby</Text>
            </View>
            <View
              style={[
                styles.statusIcon,
                { backgroundColor: "rgba(19, 91, 236, 0.1)" },
              ]}
            >
              <MaterialIcons name="sync" size={24} color={colors.blue} />
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[styles.progressStep, { backgroundColor: colors.blue }]}
            />
            <View
              style={[styles.progressStep, { backgroundColor: colors.blue }]}
            />
            <View
              style={[styles.progressStep, { backgroundColor: colors.blue }]}
            />
            <View style={[styles.progressStep, { backgroundColor: "#F1F5F9" }]}>
              <View
                style={[
                  styles.progressPulse,
                  { backgroundColor: colors.blue, opacity: 0.4 },
                ]}
              />
            </View>
          </View>

          {/* Driver Profile */}
          <View
            style={[
              styles.driverCard,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.driverAvatarContainer}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
                }}
                style={styles.driverAvatar}
              />
              <View
                style={[
                  styles.ratingBadge,
                  { backgroundColor: colors.surface },
                ]}
              >
                <MaterialIcons name="star" size={10} color="#EAB308" />
                <Text style={styles.ratingText}>4.9</Text>
              </View>
            </View>
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.driverName, { color: colors.text }]}>
                  David M.
                </Text>
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO</Text>
                </View>
              </View>
              <Text style={styles.vehicleText}>
                Black Yamaha NMAX • B 1234 XYZ
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.callBtn, { borderColor: colors.border }]}
            >
              <MaterialIcons name="call" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <Button
            title="Chat with David"
            onPress={() => {}}
            variant="secondary"
            size="lg"
            icon={
              <MaterialIcons name="chat-bubble" size={20} color="#FFFFFF" />
            }
          />

          <TouchableOpacity style={styles.detailsBtn}>
            <Text style={styles.detailsBtnText}>
              View Order Details (3 items)
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={18}
              color="#94A3B8"
            />
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
  mapContainer: {
    flex: 1,
    backgroundColor: "#E2E8F0",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  overlayHeader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderIdBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  helpBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpBtnText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  markerContainer: {
    position: "absolute",
    alignItems: "center",
  },
  markerLabel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  markerLabelText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  driverPulse: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(19, 91, 236, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  driverIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#135bec",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  recenterBtn: {
    position: "absolute",
    bottom: 40,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  drawer: {
    position: "relative",
    top: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginTop: 12,
  },
  drawerContent: {
    padding: 24,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  etaText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  statusSubtext: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
    marginTop: 4,
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  progressStep: {
    height: 6,
    flex: 1,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressPulse: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  driverAvatarContainer: {
    position: "relative",
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  ratingBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  ratingText: {
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 2,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  driverName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  proBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#15803D",
  },
  vehicleText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "600",
  },
});
