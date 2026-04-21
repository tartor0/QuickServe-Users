import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Skeleton } from "@/src/components/common/Skeleton";
import { supabase } from "@/src/services/supabase";
import { addItem, selectCartItems } from "@/src/store/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

interface Seller {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  minDeliveryTime: number;
  maxDeliveryTime: number;
  deliveryFee: number;
  category: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
}

export const SellerProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [seller, setSeller] = useState<Seller | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const cartItems = useAppSelector(selectCartItems);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [{ data: sellerData }, { data: itemsData }] = await Promise.all([
          supabase.from("sellers").select("*").eq("id", id).single(),
          supabase.from("menu_items").select("*").eq("seller_id", id).eq("is_available", true),
        ]);
        if (sellerData) {
          setSeller({
            id: sellerData.id,
            name: sellerData.name,
            description: sellerData.description ?? "",
            imageUrl: sellerData.image_url ?? "",
            rating: sellerData.rating ?? 0,
            minDeliveryTime: sellerData.min_delivery_time ?? 20,
            maxDeliveryTime: sellerData.max_delivery_time ?? 40,
            deliveryFee: sellerData.delivery_fee ?? 0,
            category: sellerData.category ?? "",
          });
        }
        setMenuItems((itemsData ?? []).map((i: any) => ({
          id: i.id,
          name: i.name,
          description: i.description ?? "",
          price: i.price,
          imageUrl: i.image_url ?? "",
          category: i.category ?? "Other",
          isAvailable: i.is_available,
        })));
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  // Derive categories from fetched items
  const categories = useMemo(() => {
    const cats = ["All", ...Array.from(new Set(menuItems.map((i) => i.category)))];
    return cats;
  }, [menuItems]);

  // Cart counts derived from Redux state — stays in sync across screens
  const cartCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    cartItems.forEach((i) => { map[i.id] = i.quantity; });
    return map;
  }, [cartItems]);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const addToCart = (item: MenuItem) => {
    if (!seller) return;
    const existing = cartItems.find((c) => c.id === item.id);
    dispatch(addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      sellerId: seller.id,
      sellerName: seller.name,
      imageUrl: item.imageUrl,
      customizations: [],
    }));
  };

  const filteredItems = selectedCategory === "All"
    ? menuItems
    : menuItems.filter((i) => i.category === selectedCategory);

  const renderSkeleton = () => (
    <View style={styles.menuContent}>
      <Skeleton
        width={150}
        height={24}
        borderRadius={4}
        style={{ marginBottom: 16 }}
      />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonItem}>
          <View style={{ flex: 1, gap: 8 }}>
            <Skeleton width="60%" height={20} borderRadius={4} />
            <Skeleton width="90%" height={16} borderRadius={4} />
            <Skeleton width="40%" height={16} borderRadius={4} />
          </View>
          <Skeleton width={112} height={112} borderRadius={16} />
        </View>
      ))}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        {isLoading ? (
          <Skeleton width="100%" height="100%" borderRadius={0} />
        ) : (
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800",
            }}
            style={styles.headerImage}
          />
        )}
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
          {isLoading ? (
            <View style={{ gap: 8 }}>
              <Skeleton width={200} height={28} borderRadius={4} />
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Skeleton width={40} height={18} borderRadius={4} />
                <Skeleton width={80} height={18} borderRadius={4} />
                <Skeleton width={60} height={18} borderRadius={4} />
              </View>
            </View>
          ) : (
            <View style={styles.sellerTitleContainer}>
              <Text style={[styles.sellerName, { color: colors.text }]}>
                {seller?.name ?? ""}
              </Text>
              <View style={styles.sellerMeta}>
                <View style={styles.ratingBadge}>
                  <Text style={[styles.ratingText, { color: colors.primary }]}>
                    {seller?.rating.toFixed(1)}
                  </Text>
                  <MaterialIcons name="star" size={12} color={colors.primary} />
                </View>
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {seller?.minDeliveryTime}-{seller?.maxDeliveryTime} min
                </Text>
                <Text style={[styles.metaDot, { color: colors.textSecondary }]}>•</Text>
                <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                  {seller?.category}
                </Text>
              </View>
            </View>
          )}
        </View>
        {isLoading ? (
          <Skeleton width="100%" height={40} borderRadius={4} style={{ marginTop: 8 }} />
        ) : (
          <Text style={[styles.sellerDescription, { color: colors.textSecondary }]}>
            {seller?.description}
          </Text>
        )}
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
          {isLoading
            ? [1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} width={80} height={40} borderRadius={20} />
              ))
            : categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    selectedCategory === category && { backgroundColor: colors.primary },
                    selectedCategory !== category && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      { color: selectedCategory === category ? "#fff" : colors.text },
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
        {isLoading ? (
          renderSkeleton()
        ) : (
          <>
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
                    <Text
                      style={[styles.menuItemPrice, { color: colors.text }]}
                    >
                      ${item.price.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.menuItemImageContainer}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.menuItemImage}
                  />
                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      {
                        backgroundColor: colors.primary,
                      },
                    ]}
                    onPress={() => addToCart(item)}
                  >
                    {(cartCountMap[item.id] ?? 0) > 0 ? (
                      <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                        {cartCountMap[item.id]}
                      </Text>
                    ) : (
                      <MaterialIcons name="add" size={24} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <View style={styles.floatingCartContainer}>
          <TouchableOpacity
            style={[
              styles.floatingCart,
              { backgroundColor: colors.primary, shadowColor: colors.primary },
            ]}
            activeOpacity={0.9}
            onPress={() => router.push("/cart" as any)}
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
    backgroundColor: "rgba(0,0,0,0.4)", // Replaced invalid gradient string
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
  skeletonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginBottom: 16,
    gap: 16,
  },
});
