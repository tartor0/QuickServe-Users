import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmptyState } from "@/src/components/common/EmptyState";
import { sellersService, Seller } from "@/src/services/api/sellers";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

export const SearchResultsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();

  const [query, setQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState(["Distance", "Rating"]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const data = await sellersService.search(q.trim());
      setResults(data);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  // Run immediately on mount if query was passed in
  useEffect(() => { if (initialQuery) runSearch(initialQuery); }, []); // eslint-disable-line

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
            Results for "{query || "all"}"
          </Text>
          <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
            {loading ? "Searching…" : `${results.length} vendor${results.length !== 1 ? "s" : ""} found`}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 48 }} />
        ) : results.length === 0 ? (
          <EmptyState
            icon="search-off"
            title="No results found"
            subtitle={`No vendors match "${query}". Try a different term.`}
            buttonText="Clear Search"
            onButtonPress={() => setQuery("")}
          />
        ) : (
          <View style={styles.sellersList}>
            {results.map((seller) => (
              <TouchableOpacity
                key={seller.id}
                style={[styles.sellerCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/seller/${seller.id}` as any)}
              >
                <Image source={{ uri: seller.imageUrl }} style={styles.sellerImage} />
                <View style={styles.sellerInfo}>
                  <View style={styles.sellerTop}>
                    <Text style={[styles.sellerName, { color: colors.text }]}>{seller.name}</Text>
                    <View style={styles.ratingBadge}>
                      <Text style={[styles.ratingText, { color: colors.primary }]}>{seller.rating.toFixed(1)}</Text>
                      <MaterialIcons name="star" size={12} color={colors.primary} />
                    </View>
                  </View>
                  <Text style={[styles.sellerCategory, { color: colors.textSecondary }]}>{seller.category}</Text>
                  <View style={styles.sellerMeta}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="schedule" size={14} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {seller.minDeliveryTime}-{seller.maxDeliveryTime} min
                      </Text>
                    </View>
                    <Text style={[styles.metaDot, { color: colors.textSecondary }]}>•</Text>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="delivery-dining" size={14} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        ${seller.deliveryFee.toFixed(2)} delivery
                      </Text>
                    </View>
                  </View>
                </View>
                {seller.isFeatured && (
                  <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
                    <Text style={styles.discountText}>Featured</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

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
