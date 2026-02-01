import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const OFFERS = [
  {
    id: "1",
    title: "Free Delivery",
    description: "On your next 3 orders over $20",
    code: "FREESHIP",
    expiry: "Ends in 2 days",
    icon: "local-shipping",
    color: "#3b82f6",
  },
  {
    id: "2",
    title: "$10 Off First Order",
    description: "Welcome gift for new users",
    code: "WELCOME10",
    expiry: "Expires Oct 31",
    icon: "card-giftcard",
    color: "#10b981",
  },
  {
    id: "3",
    title: "20% Off Groceries",
    description: "Save on your weekly essentials",
    code: "FRESH20",
    expiry: "Expires in 5 days",
    icon: "shopping-cart",
    color: "#8b5cf6",
  },
];

export const PromotionsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

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
          Offers & Promos
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.promoInputContainer}>
          <Text style={[styles.inputLabel, { color: colors.text }]}>
            Have a promo code?
          </Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <MaterialIcons
              name="local-offer"
              size={20}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.placeholderText, { color: colors.textSecondary }]}
            >
              Enter code here
            </Text>
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.offersContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Offers
          </Text>

          {OFFERS.map((offer) => (
            <TouchableOpacity
              key={offer.id}
              style={[styles.offerCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.9}
            >
              <View
                style={[
                  styles.offerIcon,
                  { backgroundColor: offer.color + "1A" },
                ]}
              >
                <MaterialIcons
                  name={offer.icon as any}
                  size={24}
                  color={offer.color}
                />
              </View>

              <View style={styles.offerContent}>
                <Text style={[styles.offerTitle, { color: colors.text }]}>
                  {offer.title}
                </Text>
                <Text
                  style={[styles.offerDesc, { color: colors.textSecondary }]}
                >
                  {offer.description}
                </Text>

                <View style={styles.offerFooter}>
                  <View
                    style={[
                      styles.codeBadge,
                      { backgroundColor: colors.background },
                    ]}
                  >
                    <Text style={[styles.codeText, { color: colors.text }]}>
                      {offer.code}
                    </Text>
                  </View>
                  <Text
                    style={[styles.expiryText, { color: colors.textSecondary }]}
                  >
                    {offer.expiry}
                  </Text>
                </View>
              </View>

              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
            }}
            style={styles.promoBanner}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerTitle}>QuickServe Plus</Text>
            <Text style={styles.bannerSubtitle}>
              Get 0$ delivery fee on every order
            </Text>
            <TouchableOpacity
              style={styles.bannerBtn}
              onPress={() => router.push("/profile/subscription" as any)}
            >
              <Text style={styles.bannerBtnText}>Learn More</Text>
            </TouchableOpacity>
          </View>
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
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  promoInputContainer: {
    padding: 16,
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  placeholderText: {
    flex: 1,
    fontSize: 16,
  },
  applyBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  offersContainer: {
    padding: 16,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  offerCard: {
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
  offerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  offerContent: {
    flex: 1,
    gap: 4,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  offerDesc: {
    fontSize: 13,
    marginBottom: 8,
  },
  offerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  codeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  codeText: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  expiryText: {
    fontSize: 11,
    fontWeight: "500",
  },
  bannerContainer: {
    margin: 16,
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  promoBanner: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(59, 130, 246, 0.85)",
    padding: 24,
    justifyContent: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginBottom: 16,
  },
  bannerBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "700",
  },
});
