import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmptyState } from "@/src/components/common/EmptyState";
import { ordersService } from "@/src/services/api/orders";
import {
  applyPromo,
  clearCart,
  removeItem,
  selectCartItems,
  selectCartSubtotal,
  selectPromoDiscount,
  updateQuantity,
} from "@/src/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export const CartScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Real cart state from Redux
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const promoDiscount = useAppSelector(selectPromoDiscount);
  const storedPromoCode = useAppSelector((s) => s.cart.promoCode);
  const promoApplied = !!promoDiscount;

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [tipPercentage, setTipPercentage] = useState(15);

  // Calculated totals — discount is server-validated, rest computed locally
  const discount = promoDiscount;
  const deliveryFee = items.length > 0 ? 2.99 : 0;
  const serviceFee = subtotal * 0.05;
  const tip = subtotal * (tipPercentage / 100);
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + deliveryFee + serviceFee + tip + tax;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError("");
    try {
      const result = await ordersService.validatePromo({
        code: promoInput.trim(),
        subtotal,
      });
      if (result.valid && result.discountType) {
        dispatch(
          applyPromo({
            code: promoInput.trim().toUpperCase(),
            discountAmount: result.discountAmount,
            discountType: result.discountType,
          })
        );
      } else {
        setPromoError(result.message);
      }
    } catch (e: any) {
      setPromoError("Failed to validate promo code. Try again.");
    } finally {
      setPromoLoading(false);
    }
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
          Your Cart
        </Text>
        <TouchableOpacity onPress={() => dispatch(clearCart())}>
          <Text style={[styles.clearText, { color: "#ef4444" }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {items.length === 0 ? (
          <EmptyState
            icon="shopping-bag"
            title="Your cart is empty"
            subtitle="Looks like you haven't added anything to your cart yet. Find something delicious!"
            buttonText="Browse Restaurants"
            onButtonPress={() => router.push("/(tabs)" as any)}
          />
        ) : (
          <>
            {/* Cart Items */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Items from {items[0]?.sellerName}
              </Text>
              <View style={styles.itemsList}>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.cartItem,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemName, { color: colors.text }]}>
                        {item.name}
                      </Text>
                      {item.customizations.length > 0 && (
                        <Text
                          style={[
                            styles.itemCustomizations,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {item.customizations.join(", ")}
                        </Text>
                      )}
                      <Text style={[styles.itemPrice, { color: colors.text }]}>
                        ${item.price.toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={[
                            styles.quantityBtn,
                            { backgroundColor: colors.background },
                          ]}
                          onPress={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))
                          }
                        >
                          <MaterialIcons
                            name="remove"
                            size={16}
                            color={colors.text}
                          />
                        </TouchableOpacity>
                        <Text style={[styles.quantity, { color: colors.text }]}>
                          {item.quantity}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.quantityBtn,
                            { backgroundColor: colors.primary },
                          ]}
                           onPress={() =>
                            dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))
                          }
                        >
                          <MaterialIcons name="add" size={16} color="#fff" />
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => dispatch(removeItem(item.id))}
                      >
                        <MaterialIcons
                          name="delete-outline"
                          size={20}
                          color="#ef4444"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Promo Code */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Promo Code
              </Text>
              <View
                style={[
                  styles.promoContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <TextInput
                  style={[styles.promoInput, { color: colors.text }]}
                  placeholder="Enter promo code"
                  placeholderTextColor={colors.textSecondary}
                  value={promoApplied ? storedPromoCode : promoInput}
                  onChangeText={setPromoInput}
                  editable={!promoApplied}
                />
                <TouchableOpacity
                  style={[
                    styles.applyBtn,
                    promoApplied
                      ? { backgroundColor: "#10b981" }
                      : { backgroundColor: colors.primary },
                  ]}
                  onPress={handleApplyPromo}
                  disabled={promoApplied || promoLoading}
                >
                  {promoLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.applyBtnText}>
                      {promoApplied ? "Applied" : "Apply"}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              {promoError ? (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>
                  {promoError}
                </Text>
              ) : null}
              {promoApplied && (
                <View style={styles.promoSuccess}>
                  <MaterialIcons name="check-circle" size={16} color="#10b981" />
                  <Text style={[styles.promoSuccessText, { color: "#10b981" }]}>
                    ${discount.toFixed(2)} discount applied!
                  </Text>
                </View>
              )}
            </View>

            {/* Tip Selection */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Add a Tip
              </Text>
              <View style={styles.tipContainer}>
                {[10, 15, 20, 25].map((percent) => (
                  <TouchableOpacity
                    key={percent}
                    style={[
                      styles.tipBtn,
                      tipPercentage === percent
                        ? {
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                          }
                        : {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                          },
                    ]}
                    onPress={() => setTipPercentage(percent)}
                  >
                    <Text
                      style={[
                        styles.tipBtnText,
                        {
                          color:
                            tipPercentage === percent ? "#fff" : colors.text,
                        },
                      ]}
                    >
                      {percent}%
                    </Text>
                    <Text
                      style={[
                        styles.tipAmount,
                        {
                          color:
                            tipPercentage === percent
                              ? "rgba(255,255,255,0.8)"
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      ${(subtotal * (percent / 100)).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Order Summary */}
            <View
              style={[
                styles.summaryContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.summaryTitle, { color: colors.text }]}>
                Order Summary
              </Text>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Subtotal
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${subtotal.toFixed(2)}
                </Text>
              </View>
              {promoApplied && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: "#10b981" }]}>
                    Discount
                  </Text>
                  <Text style={[styles.summaryValue, { color: "#10b981" }]}>
                    -${discount.toFixed(2)}
                  </Text>
                </View>
              )}
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Delivery Fee
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Service Fee
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${serviceFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Tip ({tipPercentage}%)
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${tip.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text
                  style={[styles.summaryLabel, { color: colors.textSecondary }]}
                >
                  Tax
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  ${tax.toFixed(2)}
                </Text>
              </View>
              <View
                style={[
                  styles.summaryDivider,
                  { backgroundColor: colors.border },
                ]}
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
          </>
        )}
      </ScrollView>

      {/* Checkout Button */}
      {items.length > 0 && (
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.checkoutBtn,
              { backgroundColor: colors.primary, shadowColor: colors.primary },
            ]}
            onPress={() => router.push("/checkout" as any)}
          >
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
          </TouchableOpacity>
        </View>
      )}
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
  clearText: {
    fontSize: 14,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  browseBtn: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 28,
  },
  browseBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  cartItem: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  itemInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemCustomizations: {
    fontSize: 12,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "700",
  },
  itemActions: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "700",
    minWidth: 20,
    textAlign: "center",
  },
  removeBtn: {
    padding: 4,
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  promoInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 14,
  },
  applyBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  promoSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  promoSuccessText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tipContainer: {
    flexDirection: "row",
    gap: 12,
  },
  tipBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  tipBtnText: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  tipAmount: {
    fontSize: 12,
  },
  summaryContainer: {
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
  checkoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 28,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  checkoutTotal: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
