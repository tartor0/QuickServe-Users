import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmptyState } from "@/src/components/common/EmptyState";
import { fetchOrders, fetchActiveOrder } from "@/src/store/slices/ordersSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FILTER_OPTIONS = ["All", "Delivered", "Cancelled"];

const STATUS_COLORS: Record<string, string> = {
  delivered: "#10b981",
  cancelled: "#ef4444",
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  picked_up: "#3b82f6",
  nearby: "#3b82f6",
  arriving: "#3b82f6",
};

const ACTIVE_STATUSES = ["pending", "confirmed", "preparing", "picked_up", "nearby", "arriving"];

export const OrdersScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders, activeOrder, loading } = useAppSelector((s) => s.orders);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const load = useCallback(() => {
    dispatch(fetchOrders());
    dispatch(fetchActiveOrder());
  }, [dispatch]);

  useEffect(() => { load(); }, [load]);

  const pastOrders = orders.filter((o) => !ACTIVE_STATUSES.includes(o.status));

  const filteredPastOrders = pastOrders.filter((o) => {
    if (selectedFilter === "All") return true;
    return o.status === selectedFilter.toLowerCase();
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Orders
        </Text>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="tune" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTER_OPTIONS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && {
                backgroundColor: colors.primary,
              },
              selectedFilter !== filter && {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
              },
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedFilter === filter ? "#fff" : colors.text },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Orders List */}
      <ScrollView
        style={styles.ordersList}
        contentContainerStyle={styles.ordersContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Orders Section */}
        {activeOrder && selectedFilter === "All" && (
          <>
            <Text style={[styles.sectionTitleText, { color: colors.text }]}>
              Active Orders
            </Text>
            <TouchableOpacity
              style={[
                styles.orderCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                  borderWidth: 1,
                },
              ]}
              onPress={() => router.push(`/orders/tracking` as any)}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderInfo}>
                  <View style={styles.statusRow}>
                    <Text
                      style={[
                        styles.statusText,
                        { color: STATUS_COLORS[activeOrder.status] ?? "#6b7280" },
                      ]}
                    >
                      {activeOrder.status.replace("_", " ").toUpperCase()}
                    </Text>
                    <View style={styles.dot} />
                    <Text style={[styles.dateText, { color: colors.primary }]}>
                      {activeOrder.estimatedDeliveryTime
                        ? `ETA: ${new Date(activeOrder.estimatedDeliveryTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : "Calculating ETA..."}
                    </Text>
                  </View>
                  <Text style={[styles.sellerName, { color: colors.text }]}>
                    {activeOrder.sellerName}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.trackBtnInline,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => router.push(`/orders/tracking` as any)}
                  >
                    <MaterialIcons name="location-on" size={16} color="#fff" />
                    <Text style={styles.trackBtnTextInline}>Track Order</Text>
                  </TouchableOpacity>
                </View>
                <Image
                  source={{ uri: activeOrder.sellerImage }}
                  style={styles.orderImage}
                />
              </View>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
          </>
        )}

        <Text style={[styles.sectionTitleText, { color: colors.text }]}>
          Past Orders
        </Text>

        {filteredPastOrders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/orders/${order.id}` as any)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <View style={styles.statusRow}>
                  <Text
                    style={[
                      styles.statusText,
                      { color: STATUS_COLORS[order.status] ?? "#6b7280" },
                    ]}
                  >
                    {order.status.toUpperCase()}
                  </Text>
                  <View style={styles.dot} />
                  <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </Text>
                </View>
                <Text style={[styles.sellerName, { color: colors.text }]}>
                  {order.sellerName}
                </Text>
                <Text style={[styles.totalText, { color: colors.primary }]}>
                  ${order.total.toFixed(2)}
                </Text>
              </View>
              <Image source={{ uri: order.sellerImage }} style={styles.orderImage} />
            </View>
            <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
              <TouchableOpacity onPress={() => router.push(`/orders/${order.id}` as any)}>
                <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                  View Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.reorderBtn, { backgroundColor: colors.primary }]}
              >
                <MaterialIcons name="replay" size={18} color="#fff" />
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Empty State */}
        {filteredPastOrders.length === 0 && !loading && (
          <EmptyState
            icon="receipt-long"
            title="No orders yet"
            subtitle="Start ordering from your favorite restaurants to see your history here."
            buttonText="Find Food"
            onButtonPress={() => router.push("/(tabs)" as any)}
          />
        )}
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  backBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersContainer: {
    maxHeight: 60,
  },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 18,
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  ordersList: {
    flex: 1,
  },
  ordersContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 100,
  },
  orderCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  orderInfo: {
    flex: 1,
    gap: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d1d5db",
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  totalText: {
    fontSize: 14,
    fontWeight: "700",
  },
  orderImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  reorderBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 18,
    gap: 6,
  },
  reorderText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitleText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  trackBtnInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  trackBtnTextInline: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
