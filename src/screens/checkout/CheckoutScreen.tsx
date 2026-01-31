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

const DELIVERY_TIMES = [
  { id: "asap", label: "ASAP", time: "25-35 min", icon: "bolt" },
  { id: "schedule", label: "Schedule", time: "Choose time", icon: "schedule" },
];

export const CheckoutScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [deliveryTime, setDeliveryTime] = useState("asap");
  const [instructions, setInstructions] = useState("");

  const total = 32.47;

  const handlePlaceOrder = () => {
    router.push("/order/confirmation" as any);
  };

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
          Checkout
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Delivery Address
            </Text>
            <TouchableOpacity>
              <Text style={[styles.changeText, { color: colors.primary }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.addressCard, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.addressIcon,
                { backgroundColor: "rgba(59, 130, 246, 0.1)" },
              ]}
            >
              <MaterialIcons
                name="location-on"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.addressInfo}>
              <Text style={[styles.addressLabel, { color: colors.text }]}>
                Home
              </Text>
              <Text
                style={[styles.addressText, { color: colors.textSecondary }]}
              >
                123 Main Street, Apt 4B{"\n"}New York, NY 10001
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </View>
        </View>

        {/* Delivery Time */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Delivery Time
          </Text>
          <View style={styles.deliveryTimeContainer}>
            {DELIVERY_TIMES.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.deliveryTimeBtn,
                  deliveryTime === option.id
                    ? {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                ]}
                onPress={() => setDeliveryTime(option.id)}
              >
                <MaterialIcons
                  name={option.icon as any}
                  size={24}
                  color={deliveryTime === option.id ? "#fff" : colors.text}
                />
                <Text
                  style={[
                    styles.deliveryTimeLabel,
                    {
                      color: deliveryTime === option.id ? "#fff" : colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.deliveryTimeText,
                    {
                      color:
                        deliveryTime === option.id
                          ? "rgba(255,255,255,0.8)"
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {option.time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Payment Method
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/profile/payment-methods")}
            >
              <Text style={[styles.changeText, { color: colors.primary }]}>
                Change
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[styles.paymentCard, { backgroundColor: colors.surface }]}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/000000/visa.png",
              }}
              style={styles.cardIcon}
            />
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentLabel, { color: colors.text }]}>
                Visa •••• 4242
              </Text>
              <Text
                style={[styles.paymentExpiry, { color: colors.textSecondary }]}
              >
                Expires 12/25
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </View>
        </View>

        {/* Special Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Special Instructions (Optional)
          </Text>
          <View
            style={[
              styles.instructionsCard,
              { backgroundColor: colors.surface },
            ]}
          >
            <MaterialIcons
              name="edit-note"
              size={24}
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.instructionsPlaceholder,
                { color: colors.textSecondary },
              ]}
            >
              Add delivery instructions...
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Order Summary
          </Text>

          {/* Items Preview */}
          <View style={styles.itemsPreview}>
            <View style={styles.itemPreviewRow}>
              <Text
                style={[
                  styles.itemPreviewText,
                  { color: colors.textSecondary },
                ]}
              >
                2x Signature Whopper
              </Text>
            </View>
            <View style={styles.itemPreviewRow}>
              <Text
                style={[
                  styles.itemPreviewText,
                  { color: colors.textSecondary },
                ]}
              >
                1x Loaded Cheesy Fries
              </Text>
            </View>
            <View style={styles.itemPreviewRow}>
              <Text
                style={[
                  styles.itemPreviewText,
                  { color: colors.textSecondary },
                ]}
              >
                1x Strawberry Shake
              </Text>
            </View>
          </View>

          <View
            style={[styles.summaryDivider, { backgroundColor: colors.border }]}
          />

          {/* Price Breakdown */}
          <View style={styles.summaryRow}>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Subtotal
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              $24.48
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Delivery Fee
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              $2.99
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Tax
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              $2.16
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text
              style={[styles.summaryLabel, { color: colors.textSecondary }]}
            >
              Tip
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              $3.67
            </Text>
          </View>

          <View
            style={[styles.summaryDivider, { backgroundColor: colors.border }]}
          />

          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ${total.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.placeOrderBtn, { backgroundColor: colors.primary }]}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.placeOrderBtnText}>Place Order</Text>
          <Text style={styles.placeOrderTotal}>${total.toFixed(2)}</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  changeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  addressIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
  },
  deliveryTimeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  deliveryTimeBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    gap: 8,
  },
  deliveryTimeLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  deliveryTimeText: {
    fontSize: 12,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  paymentExpiry: {
    fontSize: 14,
  },
  instructionsCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionsPlaceholder: {
    fontSize: 14,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  itemsPreview: {
    marginBottom: 12,
  },
  itemPreviewRow: {
    marginBottom: 8,
  },
  itemPreviewText: {
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryDivider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  placeOrderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 28,
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  placeOrderBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  placeOrderTotal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
