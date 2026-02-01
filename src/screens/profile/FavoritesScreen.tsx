import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FAVORITES = [
  {
    id: "1",
    name: "Gourmet Burgers",
    category: "American • Fast Food",
    rating: 4.5,
    time: "25-35 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    id: "3",
    name: "Organic Harvest",
    category: "Grocery • Organic",
    rating: 4.2,
    time: "30-45 min",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
  },
];

export const FavoritesScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sellers" | "items">("sellers");

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
            Sellers
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
            Items
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "sellers" ? (
          <View style={styles.listContainer}>
            {FAVORITES.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.favoriteCard,
                  { backgroundColor: colors.surface },
                ]}
                activeOpacity={0.8}
                onPress={() => router.push(`/seller/${item.id}` as any)}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.name, { color: colors.text }]}>
                      {item.name}
                    </Text>
                    <TouchableOpacity>
                      <MaterialIcons
                        name="favorite"
                        size={20}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={[styles.category, { color: colors.textSecondary }]}
                  >
                    {item.category}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.ratingBox}>
                      <MaterialIcons name="star" size={14} color="#fbbf24" />
                      <Text style={[styles.rating, { color: colors.text }]}>
                        {item.rating}
                      </Text>
                    </View>
                    <View style={styles.metaDot} />
                    <Text
                      style={[styles.metaText, { color: colors.textSecondary }]}
                    >
                      {item.time}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons
              name="favorite-border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No favorite items yet
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Save your favorite dishes to find them quickly here.
            </Text>
            <TouchableOpacity
              style={[styles.browseBtn, { backgroundColor: colors.primary }]}
              onPress={() => router.push("/(tabs)/" as any)}
            >
              <Text style={styles.browseText}>Browse Menu</Text>
            </TouchableOpacity>
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
