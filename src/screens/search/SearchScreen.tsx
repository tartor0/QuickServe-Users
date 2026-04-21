import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { sellersService, Seller } from "@/src/services/api/sellers";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const MAX_RECENT = 8;

export const SearchScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Debounced search — fires 500ms after the user stops typing
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await sellersService.search(q.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  const commitSearch = (q: string) => {
    if (!q.trim()) return;
    setRecentSearches((prev) => {
      const next = [q.trim(), ...prev.filter((r) => r !== q.trim())].slice(0, MAX_RECENT);
      return next;
    });
    runSearch(q);
  };

  const clearQuery = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    inputRef.current?.focus();
  };

  const renderSeller = ({ item }: { item: Seller }) => (
    <TouchableOpacity
      style={[styles.resultCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/seller/${item.id}` as any)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={[styles.resultName, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.resultCategory, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.category}
        </Text>
        <View style={styles.resultMeta}>
          <MaterialIcons name="star" size={12} color={colors.primary} />
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.rating.toFixed(1)}
          </Text>
          <Text style={[styles.metaDot, { color: colors.textSecondary }]}>•</Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.minDeliveryTime}–{item.maxDeliveryTime} min
          </Text>
          <Text style={[styles.metaDot, { color: colors.textSecondary }]}>•</Text>
          <Text style={[styles.metaText, { color: colors.textSecondary }]}>
            ${item.deliveryFee.toFixed(2)} delivery
          </Text>
        </View>
      </View>
      {item.isFeatured && (
        <View style={[styles.featuredBadge, { backgroundColor: colors.primary + "22" }]}>
          <Text style={[styles.featuredText, { color: colors.primary }]}>Featured</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
        <MaterialIcons name="search" size={22} color={colors.textSecondary} />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          placeholder="Search restaurants, cuisines…"
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={() => commitSearch(query)}
          returnKeyType="search"
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={clearQuery} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialIcons name="cancel" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Results */}
      {!loading && searched && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderSeller}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <MaterialIcons name="search-off" size={56} color={colors.border} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No results found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try searching for something else
              </Text>
            </View>
          }
        />
      )}

      {/* Recent Searches (shown when input is empty) */}
      {!loading && !searched && recentSearches.length > 0 && (
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
            <TouchableOpacity onPress={() => setRecentSearches([])}>
              <Text style={[styles.clearAll, { color: colors.primary }]}>Clear all</Text>
            </TouchableOpacity>
          </View>
          {recentSearches.map((term) => (
            <TouchableOpacity
              key={term}
              style={styles.recentItem}
              onPress={() => {
                setQuery(term);
                commitSearch(term);
              }}
            >
              <MaterialIcons name="history" size={18} color={colors.textSecondary} />
              <Text style={[styles.recentText, { color: colors.text }]}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Empty state when nothing typed + no recents */}
      {!loading && !searched && recentSearches.length === 0 && (
        <View style={styles.centered}>
          <MaterialIcons name="search" size={64} color={colors.border} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Find your favourites</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Search for restaurants, cuisines, or dishes
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  input: { flex: 1, fontSize: 16, fontWeight: "500" },
  listContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },
  resultCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  resultImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#e5e7eb",
  },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 15, fontWeight: "700", marginBottom: 2 },
  resultCategory: { fontSize: 12, marginBottom: 6 },
  resultMeta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 11, fontWeight: "500" },
  metaDot: { fontSize: 11 },
  featuredBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredText: { fontSize: 11, fontWeight: "700" },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginTop: 16 },
  emptySubtitle: { fontSize: 14, textAlign: "center", paddingHorizontal: 32 },
  recentContainer: { paddingHorizontal: 16, paddingTop: 12 },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  clearAll: { fontSize: 14, fontWeight: "600" },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e5e7eb",
  },
  recentText: { fontSize: 15, fontWeight: "500" },
});
