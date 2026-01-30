import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const BENEFITS = [
  {
    id: "1",
    title: "Zero Delivery Fees",
    icon: "local-shipping",
    description: "On all orders from Plus-eligible stores",
  },
  {
    id: "2",
    title: "Member-only Discounts",
    icon: "local-offer",
    description: "Save up to 30% more on selected items",
  },
  {
    id: "3",
    title: "Priority Support",
    icon: "headset-mic",
    description: "Get help faster with dedicated support",
  },
  {
    id: "4",
    title: "Double Reward Points",
    icon: "stars",
    description: "Earn points twice as fast on every order",
  },
];

export const SubscriptionScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [isYearly, setIsYearly] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          QuickServe Plus
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Pro Card */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={["#ee2b8c", "#8b5cf6", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.proCard}
          >
            <View style={styles.cardHeader}>
              <View style={styles.logoBadge}>
                <MaterialIcons name="rocket-launch" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.plusBadge}>
                <Text style={styles.plusText}>PLUS</Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>Elevate Your Experience</Text>
              <Text style={styles.cardSubtitle}>
                Unlock all premium benefits and save more on every order.
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.avatarGroup}>
                {[1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.miniAvatar,
                      {
                        left: (i - 1) * 15,
                        zIndex: 4 - i,
                        borderColor: "#8b5cf6",
                      },
                    ]}
                  />
                ))}
                <Text style={styles.joinedText}>Join 10k+ members</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Pricing Toggle */}
        <View style={styles.pricingSection}>
          <View
            style={[
              styles.toggleContainer,
              {
                backgroundColor: colorScheme === "dark" ? "#1E293B" : "#F1F5F9",
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => setIsYearly(false)}
              style={[
                styles.toggleBtn,
                !isYearly && { backgroundColor: "#FFFFFF", ...styles.shadow },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  !isYearly && { color: colors.primary },
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsYearly(true)}
              style={[
                styles.toggleBtn,
                isYearly && { backgroundColor: "#FFFFFF", ...styles.shadow },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  isYearly && { color: colors.primary },
                ]}
              >
                Yearly
              </Text>
              <View style={styles.saveBadge}>
                <Text style={styles.saveBadgeText}>SAVE 20%</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.priceDisplay}>
            <Text style={[styles.priceTag, { color: colors.text }]}>
              {isYearly ? "$99.99" : "$9.99"}
            </Text>
            <Text style={[styles.pricePeriod, { color: colors.textSecondary }]}>
              {isYearly ? "/year" : "/month"}
            </Text>
          </View>
        </View>

        {/* Benefits List */}
        <View style={styles.benefitsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Premium Benefits
          </Text>
          {BENEFITS.map((benefit) => (
            <View key={benefit.id} style={styles.benefitItem}>
              <View
                style={[
                  styles.benefitIcon,
                  {
                    backgroundColor:
                      colorScheme === "dark"
                        ? "rgba(238, 43, 140, 0.1)"
                        : "#FFF1F2",
                  },
                ]}
              >
                <MaterialIcons
                  name={benefit.icon as any}
                  size={24}
                  color={colors.primary}
                />
              </View>
              <View style={styles.benefitInfo}>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>
                  {benefit.title}
                </Text>
                <Text
                  style={[styles.benefitDesc, { color: colors.textSecondary }]}
                >
                  {benefit.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Button
            title={isYearly ? "Subscribe Yearly" : "Subscribe Monthly"}
            onPress={() => {}}
            variant="primary"
            size="lg"
            style={styles.subscribeBtn}
          />
          <Text style={styles.disclaimer}>
            Recurring billing. Cancel anytime in your account settings. Terms
            apply.
          </Text>
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
  cardWrapper: {
    padding: 24,
  },
  proCard: {
    height: 200,
    borderRadius: 24,
    padding: 24,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#ee2b8c",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  plusBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  plusText: {
    color: "#ee2b8c",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1,
  },
  cardBody: {
    gap: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
    width: 80,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    borderWidth: 2,
    position: "absolute",
  },
  joinedText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 60,
  },
  pricingSection: {
    alignItems: "center",
    paddingTop: 8,
  },
  toggleContainer: {
    flexDirection: "row",
    width: width - 48,
    height: 50,
    borderRadius: 25,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#64748B",
  },
  saveBadge: {
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  saveBadgeText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#15803D",
  },
  priceDisplay: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 24,
    gap: 4,
  },
  priceTag: {
    fontSize: 48,
    fontWeight: "800",
  },
  pricePeriod: {
    fontSize: 18,
    fontWeight: "600",
  },
  benefitsContainer: {
    paddingHorizontal: 24,
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  benefitInfo: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  benefitDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  actionSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  subscribeBtn: {
    width: "100%",
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 16,
    paddingHorizontal: 20,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
