import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ordersService } from "@/src/services/api/orders";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

export const OrderDetailsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    ordersService
      .getById(id)
      .then(setOrder)
      .catch((e) => setError(e.message ?? "Failed to load order."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 32 }]}>
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text style={[styles.headerTitle, { color: colors.text, marginTop: 16 }]}>{error || "Order not found"}</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusColor = STATUS_COLORS[order.status] ?? "#6b7280";
  const seller = order.sellers ?? {};
  const address = order.addresses ?? {};
  const payment = order.payment_methods ?? {};
  const orderItems = order.order_items ?? [];

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
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Order Details
          </Text>
          <Text style={[styles.orderId, { color: colors.textSecondary }]}>
            #{order.id.slice(0, 8).toUpperCase()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.helpBtn}
          onPress={() => router.push("/support" as any)}
        >
          <Text style={[styles.helpText, { color: colors.primary }]}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <View
          style={[
            styles.section,
            styles.statusCard,
            { backgroundColor: colors.surface },
          ]}
        >
          <View
            style={[styles.statusBadge, { backgroundColor: statusColor + "1A" }]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {order.status.replace("_", " ").toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {new Date(order.created_at).toLocaleString("en-US", {
              month: "short", day: "numeric", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            RESTAURANT
          </Text>
          <TouchableOpacity
            style={[styles.infoCard, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: seller.image_url }}
              style={styles.sellerImage}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>{seller.name}</Text>
              <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>{seller.address}</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          
        </View>

        {/* Delivery Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            DELIVERY TO
          </Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primary + "1A" },
              ]}
            >
              <MaterialIcons
                name="location-on"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Home
              </Text>
              <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
                {address.street ? `${address.street}, ${address.city}` : "—"}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ORDER ITEMS
          </Text>
          <View style={[styles.itemsCard, { backgroundColor: colors.surface }]}>
            {orderItems.map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemQty, { color: colors.textSecondary }]}>{item.quantity}x</Text>
                <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                <Text style={[styles.itemPrice, { color: colors.text }]}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <View style={styles.priceRow}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                Subtotal
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>${Number(order.subtotal).toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Delivery Fee</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>${Number(order.delivery_fee).toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Tax</Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>${Number(order.tax).toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>${Number(order.total).toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            PAYMENT METHOD
          </Text>
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View
              style={[styles.iconContainer, { backgroundColor: "#F3F4F6" }]}
            >
              <MaterialIcons name="credit-card" size={24} color="#374151" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                {payment.brand ? `${payment.brand.charAt(0).toUpperCase() + payment.brand.slice(1)} •••• ${payment.last_four}` : "—"}
              </Text>
              <Text
                style={[styles.infoSubtitle, { color: colors.textSecondary }]}
              >
                {ORDER_DATA.payment.date}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.reorderBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <MaterialIcons name="replay" size={20} color="#fff" />
            <Text style={styles.reorderText}>Reorder Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.rateBtn, { borderColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={() =>
              router.push(`/orders/${id || ORDER_DATA.id}/rate` as any)
            }
          >
            <Text style={[styles.rateText, { color: colors.primary }]}>
              Rate Order
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  orderId: {
    fontSize: 12,
    fontWeight: "600",
  },
  helpBtn: {
    width: 40,
    alignItems: "flex-end",
  },
  helpText: {
    fontSize: 14,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderRadius: 20,
    marginTop: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sellerImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  itemsCard: {
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  itemQty: {
    fontSize: 14,
    fontWeight: "700",
    width: 24,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  actionButtons: {
    padding: 16,
    marginTop: 32,
    gap: 12,
  },
  reorderBtn: {
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  reorderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  rateBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  rateText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
