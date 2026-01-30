import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ORDERS = [
  {
    id: "1",
    vendor: "Burger King • Central Park",
    date: "Oct 24, 2023",
    amount: "$24.50",
    status: "Delivered",
    statusColor: "#10b981",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200",
  },
  {
    id: "2",
    vendor: "Pizza Hut • Downtown",
    date: "Oct 20, 2023",
    amount: "$38.00",
    status: "Cancelled",
    statusColor: "#ef4444",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200",
  },
];

export const OrdersScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Past Orders
        </Text>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="tune" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Chips */}
        <View style={styles.chipRow}>
          <TouchableOpacity
            style={[styles.chip, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.chipTextActive}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chipInactive, { borderColor: colors.border }]}
          >
            <Text style={[styles.chipText, { color: colors.text }]}>
              Delivered
            </Text>
            <MaterialIcons name="expand-more" size={16} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chipInactive, { borderColor: colors.border }]}
          >
            <Text style={[styles.chipText, { color: colors.text }]}>
              Cancelled
            </Text>
            <MaterialIcons name="expand-more" size={16} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Order List */}
        <View style={styles.orderList}>
          {ORDERS.map((order) => (
            <View
              key={order.id}
              style={[
                styles.orderCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardTop}>
                <View style={styles.infoCol}>
                  <View style={styles.statusRow}>
                    <Text
                      style={[styles.statusText, { color: order.statusColor }]}
                    >
                      {order.status}
                    </Text>
                    <View style={styles.dot} />
                    <Text
                      style={[styles.dateText, { color: colors.textSecondary }]}
                    >
                      {order.date}
                    </Text>
                  </View>
                  <Text style={[styles.vendorName, { color: colors.text }]}>
                    {order.vendor}
                  </Text>
                  <Text style={[styles.price, { color: colors.primary }]}>
                    {order.amount}
                  </Text>
                </View>
                <Image
                  source={{ uri: order.image }}
                  style={styles.vendorLogo}
                />
              </View>

              <View
                style={[styles.cardFooter, { borderTopColor: colors.border }]}
              >
                <TouchableOpacity>
                  <Text style={[styles.detailsLink, { color: colors.blue }]}>
                    View Details
                  </Text>
                </TouchableOpacity>
                <Button
                  title="Reorder"
                  onPress={() => {}}
                  size="sm"
                  style={styles.reorderBtn}
                  icon={
                    <MaterialIcons name="replay" size={16} color="#FFFFFF" />
                  }
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  chipRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  chip: {
    height: 36,
    paddingHorizontal: 20,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  chipTextActive: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  chipInactive: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
  orderList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  orderCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  infoCol: {
    flex: 1,
    gap: 8,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  vendorName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  vendorLogo: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
  },
  detailsLink: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  reorderBtn: {
    minWidth: 100,
  },
});
