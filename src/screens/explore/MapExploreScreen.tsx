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
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const FILTERS = [
  { id: "nearby", label: "Nearby", active: true },
  { id: "rated", label: "Top Rated", active: false },
  { id: "open", label: "Open Now", active: false },
  { id: "fast", label: "Fast Food", active: false },
];

const SELECTED_SELLER = {
  id: "1",
  name: "Burger King",
  location: "Downtown • 1.2km",
  rating: 4.5,
  deliveryTime: "15-20 min",
  deliveryFee: "Free",
  image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
};

export const MapExploreScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [filters, setFilters] = useState(FILTERS);

  return (
    <View style={styles.container}>
      {/* Map Background */}
      <View style={styles.mapContainer}>
        <View style={[styles.mapPlaceholder, { backgroundColor: "#e5e7eb" }]}>
          <Text style={styles.mapText}>Map View</Text>
          {/* Map markers would be rendered here */}
          <View style={styles.markerContainer}>
            <MaterialIcons name="location-on" size={40} color="#135bec" />
            <View style={styles.markerLabel}>
              <Text style={styles.markerText}>Burger King</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Floating Search Bar */}
      <View style={styles.searchOverlay}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search for tacos, burgers..."
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity
            style={[styles.filterBtn, { backgroundColor: colors.background }]}
            onPress={() => router.push("/search/filters")}
          >
            <MaterialIcons name="tune" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Quick Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                filter.active && { backgroundColor: colors.primary },
                !filter.active && {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter.active ? "#fff" : colors.text },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Location FAB */}
      <TouchableOpacity
        style={[styles.locationFab, { backgroundColor: colors.surface }]}
      >
        <MaterialIcons name="my-location" size={24} color={colors.text} />
      </TouchableOpacity>

      {/* Bottom Seller Card */}
      <View style={[styles.bottomCard, { backgroundColor: colors.surface }]}>
        <View style={styles.cardContent}>
          <Image
            source={{ uri: SELECTED_SELLER.image }}
            style={styles.sellerImage}
          />

          <View style={styles.sellerDetails}>
            <View style={styles.sellerHeader}>
              <Text style={[styles.sellerName, { color: colors.text }]}>
                {SELECTED_SELLER.name}
              </Text>
              <View style={styles.ratingBadge}>
                <Text style={[styles.ratingText, { color: "#10b981" }]}>
                  {SELECTED_SELLER.rating} ★
                </Text>
              </View>
            </View>

            <Text
              style={[styles.sellerLocation, { color: colors.textSecondary }]}
            >
              {SELECTED_SELLER.location}
            </Text>

            <View style={styles.metaRow}>
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: colors.background },
                ]}
              >
                <MaterialIcons
                  name="schedule"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.metaText, { color: colors.textSecondary }]}
                >
                  {SELECTED_SELLER.deliveryTime}
                </Text>
              </View>
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: colors.background },
                ]}
              >
                <MaterialIcons
                  name="local-shipping"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={[styles.metaText, { color: colors.textSecondary }]}
                >
                  {SELECTED_SELLER.deliveryFee}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.orderBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push(`/seller/${SELECTED_SELLER.id}`)}
        >
          <Text style={styles.orderBtnText}>Order Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#9ca3af",
  },
  markerContainer: {
    position: "absolute",
    top: "55%",
    left: "45%",
    alignItems: "center",
  },
  markerLabel: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  markerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1f2937",
  },
  searchOverlay: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersScroll: {
    marginTop: 12,
  },
  filtersContent: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  filterText: {
    fontSize: 12,
    fontWeight: "700",
  },
  locationFab: {
    position: "absolute",
    bottom: 300,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  bottomCard: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  sellerImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  sellerDetails: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  sellerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sellerName: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
  },
  sellerLocation: {
    fontSize: 14,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: 24,
    gap: 8,
    shadowColor: "#135bec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  orderBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
