import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const SEARCH_RESULTS = [
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
    id: "4",
    name: "Burger Haven",
    category: "Burgers • Grill",
    rating: 4.3,
    distance: "1.8 km",
    deliveryTime: "20-30 min",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400",
  },
  {
    id: "5",
    name: "Classic Burger Co.",
    category: "Burgers • American",
    rating: 4.7,
    distance: "2.5 km",
    deliveryTime: "30-40 min",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
  },
];

export const SearchResultsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { query: initialQuery } = useLocalSearchParams();

  const [query, setQuery] = useState((initialQuery as string) || "");
  const [activeFilters, setActiveFilters] = useState(["Distance", "Rating"]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with Search */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for burgers, pizza..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <MaterialIcons
                name="cancel"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => router.push("/search/filters" as any)}
        >
          <MaterialIcons name="tune" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsPadding}
        >
          {["Distance", "Rating", "Price", "Under 30 min", "Top Rated"].map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.chip,
                  activeFilters.includes(filter)
                    ? {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      }
                    : {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                ]}
                onPress={() => {
                  setActiveFilters((prev) =>
                    prev.includes(filter)
                      ? prev.filter((f) => f !== filter)
                      : [...prev, filter],
                  );
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    {
                      color: activeFilters.includes(filter)
                        ? "#fff"
                        : colors.text,
                    },
                  ]}
                >
                  {filter}
                </Text>
                {activeFilters.includes(filter) && (
                  <MaterialIcons name="close" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.resultsHeader}>
          <Text style={[styles.resultsTitle, { color: colors.text }]}>
            Results for "{query || "Burgers"}"
          </Text>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {SEARCH_RESULTS.length} vendors found
          </Text>
        </View>

        <View style={styles.sellersList}>
          {SEARCH_RESULTS.map((seller) => (
            <TouchableOpacity
              key={seller.id}
              style={[styles.sellerCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/seller/${seller.id}` as any)}
            >
              <Image
                source={{ uri: seller.image }}
                style={styles.sellerImage}
              />
              <View style={styles.sellerInfo}>
                <View style={styles.sellerTop}>
                  <Text style={[styles.sellerName, { color: colors.text }]}>
                    {seller.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Text
                      style={[styles.ratingText, { color: colors.primary }]}
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
                <Text
                  style={[
                    styles.sellerCategory,
                    { color: colors.textSecondary },
                  ]}
                >
                  {seller.category}
                </Text>
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
                  <View style={styles.metaItem}>
                    <MaterialIcons
                      name="schedule"
                      size={14}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[styles.metaText, { color: colors.textSecondary }]}
                    >
                      {seller.deliveryTime}
                    </Text>
                  </View>
                </View>
              </View>
              {seller.discount && (
                <View
                  style={[
                    styles.discountBadge,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={styles.discountText}>{seller.discount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
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
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  filterBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsRow: {
    paddingVertical: 8,
  },
  chipsPadding: {
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  resultsHeader: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 14,
  },
  sellersList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  sellerCard: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  sellerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#eee",
  },
  sellerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  sellerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellerCategory: {
    fontSize: 13,
    marginBottom: 8,
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 12,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
  },
});
