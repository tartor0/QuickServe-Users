import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ORDER_DATA = {
  id: "2492",
  date: "Oct 24, 2023, 12:45 PM",
  status: "Delivered",
  statusColor: "#10b981",
  seller: {
    name: "Burger King",
    address: "Central Park, New York",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200",
  },
  delivery: {
    address: "123 Main Street, Apt 4B",
    city: "Queens, NY 11101",
  },
  payment: {
    method: "Visa •••• 4242",
    date: "Oct 24, 2023",
  },
  items: [
    { qty: 2, name: "Signature Whopper", price: 25.98 },
    { qty: 1, name: "Loaded Cheesy Fries", price: 6.99 },
    { qty: 1, name: "Strawberry Shake", price: 4.5 },
  ],
  summary: {
    subtotal: 37.47,
    deliveryFee: 2.99,
    serviceFee: 1.87,
    tax: 3.14,
    total: 45.47,
  },
};

export const OrderDetailsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();

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
            #{id || ORDER_DATA.id}
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
            style={[
              styles.statusBadge,
              { backgroundColor: ORDER_DATA.statusColor + "1A" },
            ]}
          >
            <Text
              style={[styles.statusText, { color: ORDER_DATA.statusColor }]}
            >
              {ORDER_DATA.status.toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {ORDER_DATA.date}
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
              source={{ uri: ORDER_DATA.seller.image }}
              style={styles.sellerImage}
            />
            <View style={styles.infoContent}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                {ORDER_DATA.seller.name}
              </Text>
              <Text
                style={[styles.infoSubtitle, { color: colors.textSecondary }]}
              >
                {ORDER_DATA.seller.address}
              </Text>
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
              <Text
                style={[styles.infoSubtitle, { color: colors.textSecondary }]}
              >
                {ORDER_DATA.delivery.address}, {ORDER_DATA.delivery.city}
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
            {ORDER_DATA.items.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemQty, { color: colors.textSecondary }]}>
                  {item.qty}x
                </Text>
                <Text style={[styles.itemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemPrice, { color: colors.text }]}>
                  ${item.price.toFixed(2)}
                </Text>
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
              <Text style={[styles.priceValue, { color: colors.text }]}>
                ${ORDER_DATA.summary.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                Delivery Fee
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                ${ORDER_DATA.summary.deliveryFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text
                style={[styles.priceLabel, { color: colors.textSecondary }]}
              >
                Tax
              </Text>
              <Text style={[styles.priceValue, { color: colors.text }]}>
                ${ORDER_DATA.summary.tax.toFixed(2)}
              </Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                Total
              </Text>
              <Text style={[styles.totalValue, { color: colors.primary }]}>
                ${ORDER_DATA.summary.total.toFixed(2)}
              </Text>
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
                {ORDER_DATA.payment.method}
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
