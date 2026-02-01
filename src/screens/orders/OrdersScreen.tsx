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

const FILTER_OPTIONS = ["All", "Delivered", "Cancelled"];

const ORDERS = [
  {
    id: "1",
    seller: "Burger King • Central Park",
    status: "Delivered",
    statusColor: "#10b981",
    date: "Oct 24, 2023",
    total: "$24.50",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
  },
  {
    id: "2",
    seller: "Pizza Hut • Downtown",
    status: "Cancelled",
    statusColor: "#ef4444",
    date: "Oct 20, 2023",
    total: "$38.00",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200",
  },
  {
    id: "3",
    seller: "Sushi Palace • Midtown",
    status: "Delivered",
    statusColor: "#10b981",
    date: "Oct 18, 2023",
    total: "$45.99",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=200",
  },
];

const ACTIVE_ORDERS = [
  {
    id: "2492",
    seller: "Burger King • Central Park",
    status: "Arriving",
    statusColor: "#3b82f6",
    eta: "4 mins",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
  },
];

export const OrdersScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("All");

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
        {ACTIVE_ORDERS.length > 0 && selectedFilter === "All" && (
          <>
            <Text style={[styles.sectionTitleText, { color: colors.text }]}>
              Active Orders
            </Text>
            {ACTIVE_ORDERS.map((order) => (
              <TouchableOpacity
                key={order.id}
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
                          { color: order.statusColor },
                        ]}
                      >
                        {order.status.toUpperCase()}
                      </Text>
                      <View style={styles.dot} />
                      <Text
                        style={[styles.dateText, { color: colors.primary }]}
                      >
                        ETA: {order.eta}
                      </Text>
                    </View>
                    <Text style={[styles.sellerName, { color: colors.text }]}>
                      {order.seller}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.trackBtnInline,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={() => router.push(`/orders/tracking` as any)}
                    >
                      <MaterialIcons
                        name="location-on"
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.trackBtnTextInline}>Track Order</Text>
                    </TouchableOpacity>
                  </View>
                  <Image
                    source={{ uri: order.image }}
                    style={styles.orderImage}
                  />
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 16 }} />
          </>
        )}

        <Text style={[styles.sectionTitleText, { color: colors.text }]}>
          Past Orders
        </Text>

        {ORDERS.filter(
          (o) => selectedFilter === "All" || o.status === selectedFilter,
        ).map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/orders/${order.id}` as any)}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <View style={styles.statusRow}>
                  <Text
                    style={[styles.statusText, { color: order.statusColor }]}
                  >
                    {order.status.toUpperCase()}
                  </Text>
                  <View style={styles.dot} />
                  <Text
                    style={[styles.dateText, { color: colors.textSecondary }]}
                  >
                    {order.date}
                  </Text>
                </View>
                <Text style={[styles.sellerName, { color: colors.text }]}>
                  {order.seller}
                </Text>
                <Text style={[styles.totalText, { color: colors.primary }]}>
                  {order.total}
                </Text>
              </View>

              <Image source={{ uri: order.image }} style={styles.orderImage} />
            </View>

            <View
              style={[styles.orderFooter, { borderTopColor: colors.border }]}
            >
              <TouchableOpacity
                onPress={() => router.push(`/orders/${order.id}` as any)}
              >
                <Text
                  style={[styles.viewDetailsText, { color: colors.primary }]}
                >
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
        {ORDERS.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="receipt-long"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No orders yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Start ordering from your favorite restaurants
            </Text>
          </View>
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
