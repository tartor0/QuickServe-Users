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

const CATEGORIES = ["Popular", "Burgers", "Sides", "Drinks", "Desserts"];

const MENU_ITEMS = [
  {
    id: "1",
    category: "Popular",
    name: "Signature Whopper",
    description:
      "Flame-grilled beef patty, topped with tomatoes, fresh cut lettuce, mayo, pickles.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
  },
  {
    id: "2",
    category: "Popular",
    name: "Loaded Cheesy Fries",
    description:
      "Golden fries loaded with cheddar cheese sauce, bacon bits, and green onions.",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400",
  },
  {
    id: "3",
    category: "Drinks",
    name: "Strawberry Shake",
    description:
      "Creamy strawberry soft serve blended with fresh milk and topped with whipped cream.",
    price: 4.5,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
  },
  {
    id: "4",
    category: "Drinks",
    name: "Iced Lemon Tea",
    description: "Freshly brewed tea with a splash of lemon and mint leaves.",
    price: 3.25,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
  },
];

export const SellerProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [cartItems, setCartItems] = useState<{ [key: string]: number }>({});

  const cartCount = Object.values(cartItems).reduce(
    (sum, count) => sum + count,
    0,
  );
  const cartTotal = Object.entries(cartItems).reduce((sum, [id, count]) => {
    const item = MENU_ITEMS.find((i) => i.id === id);
    return sum + (item?.price || 0) * count;
  }, 0);

  const addToCart = (itemId: string) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const filteredItems = MENU_ITEMS.filter(
    (item) =>
      selectedCategory === "Popular" || item.category === selectedCategory,
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
          }}
          style={styles.headerImage}
        />
        <View style={styles.headerGradient} />

        {/* Top Navigation */}
        <View style={styles.topNav}>
          <TouchableOpacity
            style={[
              styles.navBtn,
              { backgroundColor: "rgba(255,255,255,0.9)" },
            ]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navBtn,
              { backgroundColor: "rgba(255,255,255,0.9)" },
            ]}
          >
            <MaterialIcons name="favorite-border" size={24} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Seller Info */}
      <View style={[styles.sellerInfo, { backgroundColor: colors.background }]}>
        <View style={styles.sellerHeader}>
          <View style={styles.sellerTitleContainer}>
            <Text style={[styles.sellerName, { color: colors.text }]}>
              Burger King & Queen
            </Text>
            <View style={styles.sellerMeta}>
              <View style={styles.ratingBadge}>
                <Text style={[styles.ratingText, { color: colors.primary }]}>
                  4.8
                </Text>
                <MaterialIcons name="star" size={12} color={colors.primary} />
              </View>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                (500+)
              </Text>
              <Text style={[styles.metaDot, { color: colors.textSecondary }]}>
                •
              </Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                25-35 min
              </Text>
              <Text style={[styles.metaDot, { color: colors.textSecondary }]}>
                •
              </Text>
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                American
              </Text>
            </View>
          </View>
        </View>
        <Text
          style={[styles.sellerDescription, { color: colors.textSecondary }]}
        >
          Juicy flame-grilled burgers made with fresh ingredients, topped with
          our secret sauce and served with crispy fries.
        </Text>
      </View>

      {/* Category Tabs */}
      <View
        style={[
          styles.categoriesContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab,
                selectedCategory === category && {
                  backgroundColor: colors.primary,
                },
                selectedCategory !== category && {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  {
                    color: selectedCategory === category ? "#fff" : colors.text,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Menu Items */}
      <ScrollView
        style={styles.menuScroll}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {selectedCategory} Items
        </Text>

        {filteredItems.map((item) => (
          <View
            key={item.id}
            style={[styles.menuItem, { backgroundColor: colors.surface }]}
          >
            <View style={styles.menuItemInfo}>
              <View style={styles.menuItemText}>
                <Text style={[styles.menuItemName, { color: colors.text }]}>
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.menuItemDescription,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
                <Text style={[styles.menuItemPrice, { color: colors.text }]}>
                  ${item.price.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.menuItemImageContainer}>
              <Image
                source={{ uri: item.image }}
                style={styles.menuItemImage}
              />
              <TouchableOpacity
                style={[styles.addBtn, { backgroundColor: colors.primary }]}
                onPress={() => addToCart(item.id)}
              >
                <MaterialIcons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={[styles.floatingCart, { backgroundColor: colors.primary }]}
            activeOpacity={0.9}
          >
            <View style={styles.cartLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
              <View>
                <Text style={styles.cartLabel}>Total</Text>
                <Text style={styles.cartTotal}>${cartTotal.toFixed(2)}</Text>
              </View>
            </View>
            <View style={styles.cartRight}>
              <Text style={styles.cartButtonText}>View Cart</Text>
              <MaterialIcons name="shopping-bag" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImageContainer: {
    height: 280,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)",
  },
  topNav: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sellerInfo: {
    marginTop: -24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
  },
  sellerHeader: {
    marginBottom: 12,
  },
  sellerTitleContainer: {
    gap: 4,
  },
  sellerName: {
    fontSize: 28,
    fontWeight: "700",
  },
  sellerMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
  },
  metaText: {
    fontSize: 14,
    fontWeight: "500",
  },
  metaDot: {
    fontSize: 14,
  },
  sellerDescription: {
    fontSize: 15,
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryTab: {
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  menuItemText: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "700",
  },
  menuItemImageContainer: {
    position: "relative",
  },
  menuItemImage: {
    width: 112,
    height: 112,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
  },
  addBtn: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  floatingCartContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  floatingCart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cartLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  cartLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  cartTotal: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  cartRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});
