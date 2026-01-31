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

const PAYMENT_METHODS = [
  {
    id: "1",
    type: "card",
    brand: "Visa",
    last4: "4242",
    expiry: "12/25",
    isDefault: true,
    icon: "https://img.icons8.com/color/48/000000/visa.png",
  },
  {
    id: "2",
    type: "card",
    brand: "Mastercard",
    last4: "8888",
    expiry: "08/26",
    isDefault: false,
    icon: "https://img.icons8.com/color/48/000000/mastercard.png",
  },
];

const OTHER_METHODS = [
  {
    id: "paypal",
    name: "PayPal",
    icon: "https://img.icons8.com/color/48/000000/paypal.png",
  },
  {
    id: "apple",
    name: "Apple Pay",
    icon: "https://img.icons8.com/ios-filled/50/000000/mac-os.png",
  },
  {
    id: "google",
    name: "Google Pay",
    icon: "https://img.icons8.com/color/48/000000/google-logo.png",
  },
];

export const PaymentMethodsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [methods, setMethods] = useState(PAYMENT_METHODS);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    );
  };

  const handleRemove = (id: string) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>
          Payment Methods
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Saved Cards
          </Text>
          <View style={styles.cardsContainer}>
            {methods.map((method) => (
              <View
                key={method.id}
                style={[
                  styles.cardItem,
                  { backgroundColor: colors.surface },
                  method.isDefault && {
                    borderWidth: 2,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <View style={styles.cardLeft}>
                  <Image
                    source={{ uri: method.icon }}
                    style={styles.cardIcon}
                  />
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardBrand, { color: colors.text }]}>
                      {method.brand} •••• {method.last4}
                    </Text>
                    <Text
                      style={[
                        styles.cardExpiry,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Expires {method.expiry}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  {method.isDefault ? (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.setDefaultBtn,
                        { borderColor: colors.border },
                      ]}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text
                        style={[styles.setDefaultText, { color: colors.text }]}
                      >
                        Set Default
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(method.id)}
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

          {/* Add Card Button */}
          <TouchableOpacity
            style={[
              styles.addCardBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <MaterialIcons
              name="add-circle-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.addCardText, { color: colors.primary }]}>
              Add New Card
            </Text>
          </TouchableOpacity>
        </View>

        {/* Other Payment Methods */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Other Payment Methods
          </Text>
          <View style={styles.otherMethodsContainer}>
            {OTHER_METHODS.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.otherMethodItem,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Image
                  source={{ uri: method.icon }}
                  style={[
                    styles.otherMethodIcon,
                    method.id === "apple" && { tintColor: colors.text },
                  ]}
                />
                <Text style={[styles.otherMethodName, { color: colors.text }]}>
                  {method.name}
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Security Note */}
        <View
          style={[
            styles.securityNote,
            { backgroundColor: "rgba(59, 130, 246, 0.1)" },
          ]}
        >
          <MaterialIcons name="lock" size={20} color="#3b82f6" />
          <Text style={[styles.securityText, { color: "#3b82f6" }]}>
            Your payment information is encrypted and secure
          </Text>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
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
  topBarTitle: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  cardsContainer: {
    gap: 12,
  },
  cardItem: {
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 14,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  defaultBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  defaultText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  setDefaultBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: "700",
  },
  removeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 16,
    marginTop: 12,
    gap: 12,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  addCardText: {
    fontSize: 16,
    fontWeight: "700",
  },
  otherMethodsContainer: {
    gap: 12,
  },
  otherMethodItem: {
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
  otherMethodIcon: {
    width: 32,
    height: 32,
  },
  otherMethodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  securityText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  },
});
