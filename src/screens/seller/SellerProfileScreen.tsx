import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
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
          colors={["rgba(0,0,0,0.6)", "transparent", "rgba(0,0,0,0.4)"]}
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
          <View>
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
      <View style={styles.tabsContainer}>
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
                activeTab === tab && { borderBottomColor: colors.primary },
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

      {/* Floating Cart Button (Optional) */}
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

// Helper for banner gradient
const LinearGradient = ({ colors, style }: any) => {
  return <View style={style} />; // Placeholder as I'll use expo-linear-gradient properly
};
