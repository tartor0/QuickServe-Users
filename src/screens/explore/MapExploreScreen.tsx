import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const CATEGORIES = [
  { id: "1", name: "Restaurants", icon: "restaurant" },
  { id: "2", name: "Grocery", icon: "shopping-basket" },
  { id: "3", name: "Laundry", icon: "local-laundry-service" },
  { id: "4", name: "Pharmacy", icon: "local-pharmacy" },
];

const NEARBY_STORES = [
  {
    id: "1",
    name: "Burger King",
    rating: "4.5",
    time: "20 min",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=200",
    location: "150m away",
  },
  {
    id: "2",
    name: "Starbucks",
    rating: "4.8",
    time: "12 min",
    image:
      "https://images.unsplash.com/photo-1544991523-28929767a0a7?q=80&w=200",
    location: "300m away",
  },
];

export const MapExploreScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [activeCategory, setActiveCategory] = useState("Restaurants");

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Map Layer (Placeholder) */}
      <View
        style={[
          styles.mapPlaceholder,
          { backgroundColor: colorScheme === "dark" ? "#0F172A" : "#E2E8F0" },
        ]}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1000",
          }}
          style={[
            styles.mapImage,
            { opacity: colorScheme === "dark" ? 0.5 : 1 },
          ]}
        />

        {/* Destination Marker */}
        <View style={styles.centerMarker}>
          <View
            style={[styles.markerPulse, { backgroundColor: colors.primary }]}
          />
          <View
            style={[styles.markerCore, { backgroundColor: colors.primary }]}
          >
            <MaterialIcons name="person-pin-circle" size={24} color="#FFFFFF" />
          </View>
        </View>

        {/* Store Markers (Placeholders) */}
        <View style={[styles.storeMarker, { top: "30%", left: "40%" }]}>
          <View
            style={[styles.markerLabel, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.markerLabelText, { color: colors.text }]}>
              Burger King
            </Text>
          </View>
          <MaterialIcons name="location-on" size={32} color={colors.primary} />
        </View>
      </View>

      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <TouchableOpacity style={styles.searchBack}>
            <MaterialIcons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <TextInput
            placeholder="Search in this area..."
            placeholderTextColor={colors.textSecondary}
            style={[styles.searchInput, { color: colors.text }]}
          />
          <TouchableOpacity style={styles.searchFilter}>
            <MaterialIcons name="tune" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setActiveCategory(cat.name)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    activeCategory === cat.name
                      ? colors.primary
                      : colors.surface,
                },
              ]}
            >
              <MaterialIcons
                name={cat.icon as any}
                size={18}
                color={activeCategory === cat.name ? "#FFFFFF" : colors.primary}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      activeCategory === cat.name ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Carousel */}
      <View style={styles.bottomSection}>
        <View style={styles.carouselHeader}>
          <Text
            style={[
              styles.carouselTitle,
              { color: colorScheme === "dark" ? "#FFFFFF" : "#0F172A" },
            ]}
          >
            Nearby {activeCategory}
          </Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: "bold" }}>
              See list
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
        >
          {NEARBY_STORES.map((store) => (
            <TouchableOpacity
              key={store.id}
              style={[styles.storeCard, { backgroundColor: colors.surface }]}
            >
              <Image source={{ uri: store.image }} style={styles.storeImage} />
              <View style={styles.storeInfo}>
                <Text style={[styles.storeName, { color: colors.text }]}>
                  {store.name}
                </Text>
                <View style={styles.storeMeta}>
                  <MaterialIcons name="star" size={14} color="#EAB308" />
                  <Text style={[styles.storeMetaText, { color: colors.text }]}>
                    {store.rating}
                  </Text>
                  <View style={styles.dot} />
                  <Text
                    style={[
                      styles.storeMetaText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {store.time}
                  </Text>
                </View>
                <Text style={styles.storeDistance}>{store.location}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Recenter Button */}
      <TouchableOpacity
        style={[styles.recenterBtn, { backgroundColor: colors.surface }]}
      >
        <MaterialIcons name="my-location" size={24} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  centerMarker: {
    position: "absolute",
    top: "45%",
    left: "50%",
    marginLeft: -24,
    marginTop: -24,
    alignItems: "center",
    justifyContent: "center",
  },
  markerPulse: {
    width: 48,
    height: 48,
    borderRadius: 24,
    opacity: 0.2,
  },
  markerCore: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  storeMarker: {
    position: "absolute",
    alignItems: "center",
  },
  markerLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  markerLabelText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  floatingHeader: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 28,
    paddingHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  searchBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 8,
  },
  searchFilter: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0,0,0,0.05)",
  },
  categoryScroll: {
    marginTop: 16,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
    zIndex: 10,
  },
  carouselHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  carouselContent: {
    paddingLeft: 16,
  },
  storeCard: {
    width: 280,
    height: 100,
    borderRadius: 20,
    marginRight: 12,
    flexDirection: "row",
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  storeImage: {
    width: 76,
    height: 76,
    borderRadius: 12,
  },
  storeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  storeMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  storeMetaText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  storeDistance: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },
  recenterBtn: {
    position: "absolute",
    bottom: 180,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
