import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const SELLERS = [
  {
    id: "1",
    name: "Burger King",
    rating: 4.5,
    time: "25-35 min",
    fee: "$2.99",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500",
    tags: ["Burgers", "Fast Food"],
    isPromo: true,
  },
  {
    id: "2",
    name: "McDonald's",
    rating: 4.3,
    time: "20-30 min",
    fee: "$1.99",
    image: "https://images.unsplash.com/photo-1623061923930-199c5dd4635b?w=500",
    tags: ["Burgers", "American"],
    isPromo: false,
  },
  {
    id: "3",
    name: "Five Guys",
    rating: 4.8,
    time: "30-40 min",
    fee: "$3.99",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500",
    tags: ["Gourmet Burgers", "Premium"],
    isPromo: true,
  },
];

const SUB_CATEGORIES = ["All", "Burgers", "Chicken", "Veggies", "Offers"];

export const CategoryBrowseScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id, name } = useLocalSearchParams();
  const [selectedSub, setSelectedSub] = useState("All");

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
          {name || "Category"}
        </Text>
        <TouchableOpacity style={styles.searchBtn}>
          <MaterialIcons name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Subcategories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.subCatContainer}
          contentContainerStyle={styles.subCatContent}
        >
          {SUB_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.subCatChip,
                {
                  backgroundColor:
                    selectedSub === cat ? colors.primary : colors.surface,
                },
              ]}
              onPress={() => setSelectedSub(cat)}
            >
              <Text
                style={[
                  styles.subCatText,
                  {
                    color: selectedSub === cat ? "#fff" : colors.textSecondary,
                  },
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.content}>
          <View style={styles.resultsHeader}>
            <Text
              style={[styles.resultsCount, { color: colors.textSecondary }]}
            >
              {SELLERS.length} results near you
            </Text>
            <TouchableOpacity style={styles.filterBtn}>
              <MaterialIcons name="tune" size={20} color={colors.primary} />
              <Text style={[styles.filterText, { color: colors.primary }]}>
                Sort & Filter
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sellers List */}
          <View style={styles.sellersList}>
            {SELLERS.map((seller) => (
              <TouchableOpacity
                key={seller.id}
                style={[styles.sellerCard, { backgroundColor: colors.surface }]}
                activeOpacity={0.9}
                onPress={() => router.push(`/seller/${seller.id}` as any)}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ uri: seller.image }}
                    style={styles.sellerImage}
                  />
                  {seller.isPromo && (
                    <View
                      style={[
                        styles.promoBadge,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text style={styles.promoText}>PROMO</Text>
                    </View>
                  )}
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{seller.time}</Text>
                  </View>
                </View>

                <View style={styles.sellerInfo}>
                  <View style={styles.sellerRow}>
                    <Text style={[styles.sellerName, { color: colors.text }]}>
                      {seller.name}
                    </Text>
                    <View style={styles.ratingRow}>
                      <MaterialIcons name="star" size={16} color="#fbbf24" />
                      <Text style={[styles.ratingText, { color: colors.text }]}>
                        {seller.rating}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sellerMeta}>
                    <Text
                      style={[styles.metaText, { color: colors.textSecondary }]}
                    >
                      {seller.tags.join(" • ")}
                    </Text>
                    <View style={styles.metaDot} />
                    <Text
                      style={[styles.metaText, { color: colors.textSecondary }]}
                    >
                      {seller.fee} delivery
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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
  searchBtn: {
    width: 40,
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  subCatContainer: {
    maxHeight: 60,
    marginVertical: 8,
  },
  subCatContent: {
    paddingHorizontal: 16,
    gap: 12,
    alignItems: "center",
  },
  subCatChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  subCatText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    padding: 16,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellersList: {
    gap: 20,
  },
  sellerCard: {
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  sellerImage: {
    width: "100%",
    height: "100%",
  },
  promoBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  promoText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  timeBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },
  sellerInfo: {
    padding: 16,
  },
  sellerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    fontWeight: "500",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#9ca3af",
    marginHorizontal: 8,
  },
});
