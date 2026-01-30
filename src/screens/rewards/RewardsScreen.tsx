import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const COUPONS = [
  {
    id: "1",
    title: "50% OFF Entire Order",
    code: "QUICK50",
    expiry: "Ends in 2 days",
    store: "For all restaurants",
    type: "Flash Sale",
  },
  {
    id: "2",
    title: "$10 OFF Grocery",
    code: "FRESH10",
    expiry: "Ends in 5 days",
    store: "Min. spend $40",
    type: "Grocery",
  },
];

export const RewardsScreen: React.FC = () => {
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
          Rewards & Coupons
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Points Card */}
        <View style={styles.pointsWrapper}>
          <LinearGradient
            colors={["#2563eb", "#3b82f6", "#60a5fa"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pointsCard}
          >
            <View style={styles.cardInfo}>
              <Text style={styles.pointsLabel}>AVAILABLE POINTS</Text>
              <Text style={styles.pointsValue}>2,450</Text>
              <Text style={styles.pointsWorth}>≈ $24.50 credit</Text>
            </View>
            <TouchableOpacity style={styles.redeemBtn}>
              <Text style={styles.redeemText}>Redeem Now</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#2563eb" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Promo Code Input */}
        <View style={styles.promoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Have a Promo Code?
          </Text>
          <View
            style={[
              styles.inputContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TextInput
              placeholder="Enter code here..."
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text }]}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.applyBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Coupons */}
        <View style={styles.couponSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Active Coupons
          </Text>
          {COUPONS.map((coupon) => (
            <View
              key={coupon.id}
              style={[
                styles.couponCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <View
                style={[styles.couponLeft, { backgroundColor: colors.primary }]}
              >
                <Ionicons name="gift" size={24} color="#FFFFFF" />
                <View style={styles.cutout} />
              </View>
              <View style={styles.couponRight}>
                <View style={styles.couponInfo}>
                  <Text style={[styles.couponTitle, { color: colors.text }]}>
                    {coupon.title}
                  </Text>
                  <Text
                    style={[
                      styles.couponStore,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {coupon.store}
                  </Text>
                  <Text style={[styles.couponExpiry, { color: colors.error }]}>
                    {coupon.expiry}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyCode, { borderColor: colors.primary }]}
                >
                  <Text style={[styles.codeText, { color: colors.primary }]}>
                    {coupon.code}
                  </Text>
                  <MaterialIcons
                    name="content-copy"
                    size={14}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Reward History */}
        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            History
          </Text>
          {[1, 2].map((i) => (
            <View
              key={i}
              style={[styles.historyItem, { borderBottomColor: colors.border }]}
            >
              <View
                style={[
                  styles.historyIcon,
                  { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                ]}
              >
                <MaterialIcons name="add" size={20} color="#10b981" />
              </View>
              <View style={styles.historyInfo}>
                <Text style={[styles.historyTitle, { color: colors.text }]}>
                  Order Reward Points
                </Text>
                <Text style={styles.historyDate}>
                  Oct 24, 2023 • Order #2412
                </Text>
              </View>
              <Text style={[styles.historyPoints, { color: "#10b981" }]}>
                +120 pts
              </Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  pointsWrapper: {
    padding: 24,
  },
  pointsCard: {
    height: 160,
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  pointsValue: {
    fontSize: 40,
    color: "#FFFFFF",
    fontWeight: "800",
    marginVertical: 4,
  },
  pointsWorth: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "500",
  },
  redeemBtn: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  redeemText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "bold",
  },
  promoSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    padding: 4,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  applyBtn: {
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
  },
  applyBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  couponSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  couponCard: {
    height: 100,
    borderRadius: 16,
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  couponLeft: {
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  cutout: {
    position: "absolute",
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "transparent", // This would need SVG or negative margin tricks for a real cutout
  },
  couponRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  couponStore: {
    fontSize: 12,
    marginTop: 2,
  },
  couponExpiry: {
    fontSize: 10,
    fontWeight: "bold",
    marginTop: 4,
  },
  copyCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    gap: 4,
  },
  codeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  historySection: {
    paddingHorizontal: 24,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  historyDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
