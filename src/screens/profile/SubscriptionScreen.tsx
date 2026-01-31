import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const BENEFITS = [
  {
    id: "1",
    icon: "delivery-dining",
    title: "Zero Delivery Fees",
    description: "On all orders over $15",
  },
  {
    id: "2",
    icon: "confirmation-number",
    title: "Monthly Coupons",
    description: "$10 worth of vouchers",
  },
  {
    id: "3",
    icon: "support-agent",
    title: "Priority Support",
    description: "Skip the wait times",
  },
  {
    id: "4",
    icon: "star",
    title: "Double Points",
    description: "Earn rewards 2x faster",
  },
];

const COMPARISON_FEATURES = [
  { feature: "Delivery Fee", free: "Variable", plus: "$0" },
  { feature: "Service Fee", free: "Full", plus: "-50% OFF" },
  { feature: "Priority Hub", free: false, plus: true },
  { feature: "Exclusive Perks", free: false, plus: true },
];

export const SubscriptionScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

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
          QuickServe Plus
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
        {/* Hero Card */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={["#FFD700", "#1e3a8a"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            {/* Pattern Overlay */}
            <View style={styles.patternOverlay} />

            <View style={styles.heroContent}>
              <Text style={styles.heroLabel}>PREMIUM MEMBERSHIP</Text>
              <Text style={styles.heroTitle}>QuickServe Plus</Text>
              <Text style={styles.heroSubtitle}>
                Elevate your delivery experience
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Exclusive Benefits
          </Text>
          <View style={styles.benefitsGrid}>
            {BENEFITS.map((benefit) => (
              <View
                key={benefit.id}
                style={[
                  styles.benefitCard,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.benefitIcon}>
                  <MaterialIcons
                    name={benefit.icon as any}
                    size={30}
                    color="#f04299"
                  />
                </View>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>
                  {benefit.title}
                </Text>
                <Text
                  style={[
                    styles.benefitDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {benefit.description}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Comparison Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Compare Plans
          </Text>
          <View
            style={[
              styles.comparisonTable,
              { backgroundColor: colors.surface },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.tableHeader,
                { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: colors.textSecondary },
                ]}
              >
                Feature
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { color: colors.textSecondary },
                ]}
              >
                Free
              </Text>
              <Text style={[styles.tableHeaderTextPlus, { color: "#f04299" }]}>
                Plus
              </Text>
            </View>

            {/* Rows */}
            {COMPARISON_FEATURES.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index !== COMPARISON_FEATURES.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.featureText, { color: colors.text }]}>
                  {item.feature}
                </Text>
                <View style={styles.tableCell}>
                  {typeof item.free === "boolean" ? (
                    item.free ? (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="#10b981"
                      />
                    ) : (
                      <MaterialIcons name="close" size={20} color="#d1d5db" />
                    )
                  ) : (
                    <Text
                      style={[styles.cellText, { color: colors.textSecondary }]}
                    >
                      {item.free}
                    </Text>
                  )}
                </View>
                <View style={styles.tableCell}>
                  {typeof item.plus === "boolean" ? (
                    item.plus ? (
                      <MaterialIcons
                        name="check-circle"
                        size={20}
                        color="#f04299"
                      />
                    ) : (
                      <MaterialIcons name="close" size={20} color="#d1d5db" />
                    )
                  ) : (
                    <Text style={[styles.cellTextPlus, { color: "#f04299" }]}>
                      {item.plus}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom CTA */}
      <View style={[styles.bottomCTA, { backgroundColor: colors.surface }]}>
        <View style={styles.pricingContainer}>
          <View>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>
              Subscription Price
            </Text>
            <Text style={[styles.priceAmount, { color: colors.text }]}>
              $9.99
              <Text
                style={[styles.pricePeriod, { color: colors.textSecondary }]}
              >
                {" "}
                /month
              </Text>
            </Text>
          </View>
          <View style={styles.cancelContainer}>
            <Text style={styles.cancelText}>CANCEL ANYTIME</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.joinBtn, { backgroundColor: "#f04299" }]}
        >
          <Text style={styles.joinBtnText}>Join Now</Text>
        </TouchableOpacity>
        <View style={{ height: 8 }} />
      </View>
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
  heroContainer: {
    padding: 16,
  },
  heroGradient: {
    borderRadius: 16,
    overflow: "hidden",
    paddingTop: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  patternOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  heroContent: {
    backgroundColor: "rgba(0,0,0,0.2)",
    backdropFilter: "blur(4px)",
    padding: 24,
  },
  heroLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  benefitCard: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  benefitIcon: {
    width: 48,
    height: 48,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 20,
  },
  benefitDescription: {
    fontSize: 12,
  },
  comparisonTable: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableHeaderTextPlus: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  tableCell: {
    flex: 1,
    alignItems: "center",
  },
  cellText: {
    fontSize: 14,
  },
  cellTextPlus: {
    fontSize: 14,
    fontWeight: "700",
  },
  bottomCTA: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  pricingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 12,
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: "800",
  },
  pricePeriod: {
    fontSize: 14,
    fontWeight: "400",
  },
  cancelContainer: {
    alignItems: "flex-end",
  },
  cancelText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#f04299",
    letterSpacing: 1.5,
  },
  joinBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f04299",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  joinBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
