import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const MENU_CATEGORIES = ["Popular", "Mains", "Sides", "Drinks", "Desserts"];

const MENU_ITEMS = [
  {
    id: "1",
    name: "Supreme Wagyu Burger",
    description:
      "Double wagyu beef patty, truffle mayo, caramelized onions, and aged cheddar.",
    price: "$18.50",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200",
    rating: "4.9",
    calories: "850 kcal",
  },
  {
    id: "2",
    name: "Truffle Parmesan Fries",
    description:
      "Crispy golden fries tossed in truffle oil and freshly grated parmesan.",
    price: "$6.00",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=200",
    calories: "420 kcal",
  },
  {
    id: "3",
    name: "Signature Milkshake",
    description:
      "Hand-spun vanilla bean ice cream with your choice of toppings.",
    price: "$7.50",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=200",
    calories: "650 kcal",
  },
];

export const SellerProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [activeTab, setActiveTab] = useState("Popular");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />

      {/* Banner & Header */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
          }}
          style={styles.bannerImage}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.8)"]}
          style={styles.bannerOverlay}
        />
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.circleBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.circleBtn}>
              <MaterialIcons name="search" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn}>
              <MaterialIcons name="share" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Seller Info Card */}
      <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
        <View style={styles.infoTop}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.sellerName, { color: colors.text }]}>
              The Burger Loft
            </Text>
            <Text style={[styles.sellerTags, { color: colors.textSecondary }]}>
              American • Burgers • Gourmet
            </Text>
          </View>
          <View
            style={[styles.ratingBadge, { backgroundColor: colors.primary }]}
          >
            <MaterialIcons name="star" size={16} color="#FFFFFF" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="schedule" size={18} color={colors.blue} />
            <Text style={[styles.statText, { color: colors.text }]}>
              25-35 min
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <MaterialIcons name="location-pin" size={18} color={colors.blue} />
            <Text style={[styles.statText, { color: colors.text }]}>
              1.2 km
            </Text>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.statItem}>
            <MaterialIcons name="local-offer" size={18} color="#10b981" />
            <Text style={[styles.statText, { color: "#10b981" }]}>
              Free Delivery
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Categories */}
      <View
        style={[styles.tabsContainer, { backgroundColor: colors.background }]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScroll}
        >
          {MENU_CATEGORIES.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tabBtn,
                activeTab === tab && {
                  borderBottomColor: colors.primary,
                  borderBottomWidth: 3,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab ? colors.primary : colors.textSecondary,
                  },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuScroll}
      >
        <Text style={[styles.categoryTitle, { color: colors.text }]}>
          {activeTab}
        </Text>

        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, { color: colors.text }]}>
                {item.name}
              </Text>
              <Text
                style={[styles.itemDesc, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
              <View style={styles.priceRow}>
                <Text style={[styles.itemPrice, { color: colors.primary }]}>
                  {item.price}
                </Text>
                {item.calories && (
                  <Text
                    style={[styles.calories, { color: colors.textSecondary }]}
                  >
                    • {item.calories}
                  </Text>
                )}
              </View>
            </View>
            <View style={styles.itemImageContainer}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
              >
                <MaterialIcons name="add" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Floating Cart Button */}
      <TouchableOpacity
        style={[styles.floatingCart, { backgroundColor: colors.primary }]}
      >
        <View style={styles.cartCount}>
          <Text style={styles.cartCountText}>2</Text>
        </View>
        <Text style={styles.viewCartText}>View Basket</Text>
        <Text style={styles.cartTotal}>$24.50</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    height: 240,
    width: "100%",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  headerRow: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 12,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoCard: {
    marginHorizontal: 16,
    marginTop: -40,
    borderRadius: 24,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  sellerName: {
    fontSize: 24,
    fontWeight: "800",
  },
  sellerTags: {
    fontSize: 14,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.5,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  statDivider: {
    width: 1,
    height: 20,
    opacity: 0.3,
  },
  tabsContainer: {
    marginTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  tabsScroll: {
    paddingHorizontal: 16,
  },
  tabBtn: {
    paddingVertical: 16,
    marginRight: 24,
    paddingHorizontal: 4,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
  },
  menuScroll: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDesc: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  calories: {
    fontSize: 12,
  },
  itemImageContainer: {
    position: "relative",
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  addBtn: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  floatingCart: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#ee2b8c",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cartCount: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cartCountText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  viewCartText: {
    flex: 1,
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cartTotal: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
