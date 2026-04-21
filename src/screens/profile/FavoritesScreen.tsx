import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { EmptyState } from "@/src/components/common/EmptyState";
import { supabase } from "@/src/services/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface FavoriteSeller {
  id: string;         // favorites row id
  sellerId: string;
  name: string;
  category: string;
  rating: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  imageUrl: string;
}

export const FavoritesScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sellers" | "items">("sellers");
  const [sellers, setSellers] = useState<FavoriteSeller[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_favorites")
        .select("id, seller_id, sellers (id, name, category, rating, min_delivery_time, max_delivery_time, image_url)")
        .eq("user_id", user.id);
      setSellers((data ?? []).map((row: any) => ({
        id: row.id,
        sellerId: row.seller_id,
        name: row.sellers?.name ?? "",
        category: row.sellers?.category ?? "",
        rating: row.sellers?.rating ?? 0,
        minDeliveryTime: row.sellers?.min_delivery_time ?? 20,
        maxDeliveryTime: row.sellers?.max_delivery_time ?? 40,
        imageUrl: row.sellers?.image_url ?? "",
      })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  const handleUnfavorite = async (favoriteId: string) => {
    setSellers((prev) => prev.filter((s) => s.id !== favoriteId));
    await supabase.from("user_favorites").delete().eq("id", favoriteId);
  };

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
          Favorites
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "sellers" && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("sellers")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "sellers"
                    ? colors.primary
                    : colors.textSecondary,
              },
            ]}
          >
          Sellers ({sellers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "items" && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("items")}
        >
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === "items" ? colors.primary : colors.textSecondary,
              },
            ]}
          >
          Items (0)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadFavorites} />}
      >
        {activeTab === "sellers" ? (
          sellers.length === 0 ? (
            <EmptyState
              icon="favorite-border"
              title="No favorite sellers yet"
              subtitle="Save your favorite restaurants and stores to find them quickly here."
              buttonText="Explore Sellers"
              onButtonPress={() => router.push("/(tabs)" as any)}
            />
          ) : (
            <View style={styles.listContainer}>
              {sellers.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.favoriteCard, { backgroundColor: colors.surface }]}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/seller/${item.sellerId}` as any)}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
                      <TouchableOpacity onPress={() => handleUnfavorite(item.id)}>
                        <MaterialIcons name="favorite" size={20} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.category, { color: colors.textSecondary }]}>{item.category}</Text>
                    <View style={styles.metaRow}>
                      <View style={styles.ratingBox}>
                        <MaterialIcons name="star" size={14} color="#fbbf24" />
                        <Text style={[styles.rating, { color: colors.text }]}>{item.rating.toFixed(1)}</Text>
                      </View>
                      <View style={styles.metaDot} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {item.minDeliveryTime}–{item.maxDeliveryTime} min
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )
        ) : (
          <EmptyState
            icon="restaurant-menu"
            title="No favorite items yet"
            subtitle="Explore our menus and save your favorite dishes to this list!"
            buttonText="Browse Menus"
            onButtonPress={() => router.push("/(tabs)" as any)}
          />
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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  favoriteCard: {
    flexDirection: "row",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  category: {
    fontSize: 12,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rating: {
    fontSize: 12,
    fontWeight: "700",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#9ca3af",
    marginHorizontal: 8,
  },
  metaText: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  browseBtn: {
    height: 50,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  browseText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
