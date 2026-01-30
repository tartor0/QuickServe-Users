import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React from "react";
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

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { id: "1", name: "Food", icon: "lunch-dining", primary: true },
  { id: "2", name: "Grocery", icon: "shopping-cart" },
  { id: "3", name: "Pharmacy", icon: "medical-services" },
  { id: "4", name: "Courier", icon: "local-shipping" },
];

const FAVORITES = [
  {
    id: "1",
    name: "Gourmet Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500",
    rating: "4.5",
    distance: "1.2 km",
    tags: "$$ • American • Fast Food",
    discount: "20% OFF",
    time: "25-35 min",
  },
  {
    id: "2",
    name: "Health First Pharmacy",
    image:
      "https://images.unsplash.com/photo-1586015555751-6397072cc411?q=80&w=500",
    rating: "4.8",
    distance: "0.5 km",
    tags: "Health • Medicine",
    time: "10-20 min",
  },
];

export const HomeScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.deliverToText}>DELIVER TO</Text>
            <TouchableOpacity style={styles.locationContainer}>
              <Text style={[styles.locationText, { color: "#FFFFFF" }]}>
                Current Location
              </Text>
              <MaterialIcons
                name="expand-more"
                size={20}
                color={colors.neonBlue}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="#FFFFFF"
            />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInner}>
            <MaterialIcons name="search" size={24} color="#94A3B8" />
            <TextInput
              placeholder="Search for a location or vendor..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />
            <View style={styles.searchDivider} />
            <TouchableOpacity>
              <MaterialIcons name="tune" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryBtn,
                cat.primary
                  ? styles.categoryBtnActive
                  : styles.categoryBtnInactive,
              ]}
            >
              <MaterialIcons
                name={cat.icon as any}
                size={20}
                color={cat.primary ? "#FFFFFF" : colors.neonBlue}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: cat.primary ? "#FFFFFF" : "#FFFFFF" },
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Favorites */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Favorites</Text>
          <TouchableOpacity>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {FAVORITES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.favoriteCard}
            activeOpacity={0.9}
          >
            <View style={styles.cardImageContainer}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              {item.discount && (
                <View style={styles.discountBadge}>
                  <MaterialIcons
                    name="local-offer"
                    size={14}
                    color={colors.primary}
                  />
                  <Text style={styles.discountText}>{item.discount}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.favoriteBtn}>
                <Ionicons name="heart" size={20} color={colors.primary} />
              </TouchableOpacity>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
            <View style={styles.cardContent}>
              <View style={styles.cardTopRow}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <MaterialIcons name="star" size={12} color={colors.primary} />
                </View>
              </View>
              <View style={styles.cardInfoRow}>
                <MaterialIcons name="location-pin" size={16} color="#94A3B8" />
                <Text style={styles.cardInfoText}>{item.distance}</Text>
                <View style={styles.dot} />
                <Text style={styles.cardInfoText}>{item.tags}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Simulation at the bottom */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="home" size={26} color={colors.primary} />
          <Text style={[styles.navText, { color: colors.primary }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="description" size={26} color="#64748B" />
          <Text style={styles.navText}>Orders</Text>
        </TouchableOpacity>
        <View style={styles.cartBtnContainer}>
          <TouchableOpacity style={styles.centralCartBtn}>
            <MaterialIcons name="shopping-bag" size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="favorite" size={26} color="#64748B" />
          <Text style={styles.navText}>Saved</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={26} color="#64748B" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 16,
    paddingBottom: 16,
    zIndex: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  deliverToText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    letterSpacing: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ec4899",
  },
  searchContainer: {
    width: "100%",
  },
  searchInner: {
    height: 56,
    backgroundColor: "#1E293B",
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  searchDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#334155",
    marginHorizontal: 12,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesScroll: {
    paddingLeft: 16,
    marginVertical: 16,
  },
  categoryBtn: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryBtnActive: {
    backgroundColor: "#ec4899",
  },
  categoryBtnInactive: {
    backgroundColor: "#1E293B",
    borderWidth: 1,
    borderColor: "#334155",
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
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
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  favoriteCard: {
    marginHorizontal: 16,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(51, 65, 85, 0.5)",
  },
  cardImageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  timeBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(15, 23, 42, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardContent: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(236, 72, 153, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    color: "#ec4899",
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 2,
  },
  cardInfoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardInfoText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "500",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#475569",
    marginHorizontal: 8,
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#0F172A",
    borderTopWidth: 1,
    borderTopColor: "#1E293B",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#64748B",
    marginTop: 4,
  },
  cartBtnContainer: {
    flex: 1,
    alignItems: "center",
    top: -20,
  },
  centralCartBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ec4899",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec4899",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
