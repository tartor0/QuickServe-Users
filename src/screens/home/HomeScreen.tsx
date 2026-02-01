import { Colors } from "@/constants/theme";
import { useTheme } from "@/src/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIES = [
  { id: "food", label: "Food", icon: "restaurant" },
  { id: "grocery", label: "Grocery", icon: "shopping-cart" },
  { id: "pharmacy", label: "Pharmacy", icon: "local-pharmacy" },
  { id: "courier", label: "Courier", icon: "local-shipping" },
  { id: "supplies", label: "Supplies", icon: "inventory-2" },
];

const SELLERS = [
  {
    id: "1",
    name: "Gourmet Burgers",
    category: "American • Fast Food",
    rating: 4.5,
    distance: "1.2 km",
    deliveryTime: "25-35 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    discount: "20% OFF",
  },
  {
    id: "2",
    name: "Health First Pharmacy",
    category: "Health • Medicine",
    rating: 4.8,
    distance: "0.5 km",
    deliveryTime: "10-20 min",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
  },
  {
    id: "3",
    name: "Organic Harvest",
    category: "Grocery • Organic",
    rating: 4.2,
    distance: "2.0 km",
    deliveryTime: "30-45 min",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
  },
];

const RECENTLY_ORDERED = [
  {
    id: "1",
    name: "Burger King",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    id: "2",
    name: "Health First Pharmacy",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400",
  },
  {
    id: "3",
    name: "Organic Harvest",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
  },
];

export const HomeScreen: React.FC = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

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
          <TouchableOpacity onPress={() => router.push("/search/results")}>
            <MaterialIcons name="tune" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
          {RECENTLY_ORDERED.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.recentCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/seller/${item.id}` as any)}
            >
              <Image source={{ uri: item.image }} style={styles.recentImage} />
              <Text
                style={[styles.recentName, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section Header */}
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
          {SELLERS.map((seller) => (
            <TouchableOpacity
              key={seller.id}
              style={[styles.sellerCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/seller/${seller.id}` as any)}
            >
              <View style={styles.sellerImageContainer}>
                <Image
                  source={{ uri: seller.image }}
                  style={styles.sellerImage}
                />
                {seller.discount && (
                  <View style={styles.discountBadge}>
                    <MaterialIcons name="local-offer" size={12} color="#fff" />
                    <Text style={styles.discountText}>{seller.discount}</Text>
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
                    {seller.deliveryTime}
                  </Text>
                </View>
              </View>

              <View style={styles.sellerInfo}>
                <View style={styles.sellerHeader}>
                  <Text style={[styles.sellerName, { color: colors.text }]}>
                    {seller.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={[styles.rating, { color: colors.primary }]}>
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
                      style={[styles.metaText, { color: colors.textSecondary }]}
                    >
                      {seller.distance}
                    </Text>
                  </View>
                  <Text
                    style={[styles.metaDot, { color: colors.textSecondary }]}
                  >
                    •
                  </Text>
                  <Text
                    style={[styles.metaText, { color: colors.textSecondary }]}
                  >
                    {seller.category}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
});
