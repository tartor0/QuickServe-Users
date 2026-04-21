import { Colors } from "@/constants/theme";
import { Skeleton } from "@/src/components/common/Skeleton";
import { useTheme } from "@/src/context/ThemeContext";
import { sellersService } from "@/src/services/api/sellers";
import type { Seller } from "@/src/services/api/sellers";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";

// Used only in StyleSheet.create (evaluated once — acceptable for banners)
const SCREEN_WIDTH = Dimensions.get("window").width;

// BANNERS stay static — these are marketing content, not DB data
const BANNERS = [
  {
    id: "b1",
    title: "50% OFF",
    subtitle: "On your first 3 orders",
    color: "#3b82f6",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
  },
  {
    id: "b2",
    title: "Free Delivery",
    subtitle: "QuickServe Plus member",
    color: "#ee2b8c",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
  },
];

const CATEGORIES = [
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "grocery", label: "Grocery", icon: "shopping-cart" },
  { id: "pharmacy", label: "Pharmacy", icon: "local-pharmacy" },
  { id: "courier", label: "Courier", icon: "local-shipping" },
  { id: "supplies", label: "Supplies", icon: "inventory-2" },
];

export const HomeScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [featuredSellers, setFeaturedSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const loadSellers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setFetchError("");
    try {
      const [all, featured] = await Promise.all([
        sellersService.list(),
        sellersService.getFeatured(),
      ]);
      setSellers(all);
      setFeaturedSellers(featured);
    } catch (e: any) {
      setFetchError(e.message ?? "Failed to load sellers.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSellers();
  }, [loadSellers]);

  const renderSkeleton = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonBanners}>
        <Skeleton width={SCREEN_WIDTH - 32} height={160} borderRadius={24} />
      </View>
      <View style={styles.skeletonCategories}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width={100} height={40} borderRadius={20} />
        ))}
      </View>
      <View style={styles.skeletonSection}>
        <Skeleton
          width={150}
          height={24}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        <View style={{ flexDirection: "row", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} width={80} height={80} borderRadius={40} />
          ))}
        </View>
      </View>
      <View style={styles.skeletonSection}>
        <Skeleton
          width={200}
          height={24}
          borderRadius={4}
          style={{ marginBottom: 16 }}
        />
        {[1, 2].map((i) => (
          <Skeleton
            key={i}
            width="100%"
            height={200}
            borderRadius={16}
            style={{ marginBottom: 16 }}
          />
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.locationContainer}>
          <Text style={[styles.deliverTo, { color: colors.textSecondary }]}>
            DELIVER TO
          </Text>
          <View style={styles.locationRow}>
            <Text style={[styles.location, { color: colors.text }]}>
              Current Location
            </Text>
            <MaterialIcons
              name="expand-more"
              size={20}
              color={colors.primary}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.notificationBtn}
          onPress={() => router.push("/profile/notifications" as any)}
        >
          <MaterialIcons name="notifications" size={24} color={colors.text} />
          <View style={[styles.badge, { backgroundColor: colors.accent }]} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for a location or vendor..."
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity
            onPress={() => router.push("/search/results" as any)}
          >
            <MaterialIcons name="tune" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
            {/* Promo Banners */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.bannersContainer}
              contentContainerStyle={styles.bannersContent}
            >
              {BANNERS.map((banner) => (
                <TouchableOpacity
                  key={banner.id}
                  style={[styles.bannerCard, { backgroundColor: banner.color }]}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: banner.image }}
                    style={styles.bannerImage}
                  />
                  <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                    <View style={styles.bannerBtn}>
                      <Text style={styles.bannerBtnText}>Claim Now</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Categories */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
              contentContainerStyle={styles.categoriesContent}
            >
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: `/category/${category.id}`,
                      params: { name: category.label },
                    } as any)
                  }
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={18}
                    color={colors.primary}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: colors.text,
                      },
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Recently Ordered */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recently Ordered
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recentContainer}
              contentContainerStyle={styles.recentContent}
            >
              {sellers.slice(0, 5).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.recentCard,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => router.push(`/seller/${item.id}` as any)}
                >
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.recentImage}
                  />
                  <Text
                    style={[styles.recentName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Nearby Favorites Section */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Nearby Favorites
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: colors.primary }]}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sellers List */}
            <View style={styles.sellersList}>
              {sellers.map((seller: import("@/src/services/api/sellers").Seller) => (
                <TouchableOpacity
                  key={seller.id}
                  style={[
                    styles.sellerCard,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={() => router.push(`/seller/${seller.id}` as any)}
                  activeOpacity={0.9}
                >
                  <View style={styles.sellerImageContainer}>
                    <Image
                      source={{ uri: seller.imageUrl }}
                      style={styles.sellerImage}
                    />
                    {seller.isFeatured && (
                      <View style={styles.discountBadge}>
                        <MaterialIcons
                          name="local-offer"
                          size={12}
                          color="#fff"
                        />
                        <Text style={styles.discountText}>
                          Featured
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity style={styles.favoriteBtn}>
                      <MaterialIcons
                        name="favorite-border"
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                    <View style={styles.deliveryTimeBadge}>
                      <Text style={styles.deliveryTimeText}>
                        {`${seller.minDeliveryTime}-${seller.maxDeliveryTime} min`}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sellerInfo}>
                    <View style={styles.sellerHeader}>
                      <Text style={[styles.sellerName, { color: colors.text }]}>
                        {seller.name}
                      </Text>
                      <View style={styles.ratingContainer}>
                        <Text
                          style={[styles.rating, { color: colors.primary }]}
                        >
                          {seller.rating}
                        </Text>
                        <MaterialIcons
                          name="star"
                          size={12}
                          color={colors.primary}
                        />
                      </View>
                    </View>

                    <View style={styles.sellerMeta}>
                      <View style={styles.metaItem}>
                        <MaterialIcons
                          name="location-on"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.metaText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {seller.address || seller.category}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.metaDot,
                          { color: colors.textSecondary },
                        ]}
                      >
                        •
                      </Text>
                      <Text
                        style={[
                          styles.metaText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {seller.category}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  locationContainer: {
    flex: 1,
  },
  deliverTo: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  location: {
    fontSize: 18,
    fontWeight: "700",
  },

  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellersList: {
    paddingHorizontal: 16,
    gap: 20,
  },
  sellerCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sellerImageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
  },
  sellerImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryTimeBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deliveryTimeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  sellerInfo: {
    padding: 16,
  },
  sellerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 14,
  },
  recentContainer: {
    marginBottom: 24,
  },
  recentContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  recentCard: {
    width: 100,
    alignItems: "center",
    gap: 8,
  },
  recentImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#e5e7eb",
  },
  recentName: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  bannersContainer: {
    marginBottom: 24,
  },
  bannersContent: {
    paddingHorizontal: 16,
    gap: 16,
  },
  bannerCard: {
    width: SCREEN_WIDTH - 32,
    height: 160,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.6,
  },
  bannerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: "center",
  },
  bannerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  bannerSubtitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerBtn: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  bannerBtnText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonBanners: {
    marginBottom: 24,
  },
  skeletonCategories: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  skeletonSection: {
    marginBottom: 32,
  },
});
