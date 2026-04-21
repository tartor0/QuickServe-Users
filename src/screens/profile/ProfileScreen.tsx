import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { logoutThunk } from "@/src/store/slices/authSlice";
import { fetchProfile } from "@/src/store/slices/profileSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const MENU_ITEMS = [
  {
    id: "1",
    title: "Edit Profile",
    icon: "person",
    route: "/profile/edit",
  },
  {
    id: "favorites",
    title: "My Favorites",
    icon: "favorite-outline",
    route: "/profile/favorites",
  },
  {
    id: "2",
    title: "Saved Addresses",
    icon: "location-on",
    route: "/profile/addresses",
  },
  {
    id: "3",
    title: "Payment Methods",
    icon: "credit-card",
    route: "/profile/payment-methods",
  },
  {
    id: "4",
    title: "Order History",
    icon: "receipt-long",
    route: "/(tabs)/orders",
  },
  {
    id: "5",
    title: "QuickServe Plus",
    icon: "stars",
    route: "/profile/subscription",
  },
  {
    id: "rewards",
    title: "Rewards & Points",
    icon: "card-giftcard",
    route: "/rewards/index",
  },
  {
    id: "6",
    title: "Offers & Promos",
    icon: "local-offer",
    route: "/profile/promotions",
  },
  {
    id: "7",
    title: "Refer a Friend",
    icon: "people",
    route: "/profile/referral",
  },
  {
    id: "support",
    title: "Support & FAQ",
    icon: "help-outline",
    route: "/support",
  },
  {
    id: "8",
    title: "Settings",
    icon: "settings",
    route: "/profile/settings",
  },
];

export const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { profile } = useAppSelector((s) => s.profile);
  const { orders } = useAppSelector((s) => s.orders);
  const user = useAppSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const displayName = profile?.fullName ?? user?.email?.split("@")[0] ?? "User";
  const displayEmail = user?.email ?? "";
  const avatarUri = profile?.avatarUrl
    ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&size=128&background=3B82F6&color=fff`;

  const handleMenuPress = (route: string | null) => {
    if (route) router.push(route as any);
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    // _layout.tsx auth listener handles the redirect
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: avatarUri }}
              style={styles.avatar}
            />
            <TouchableOpacity
              onPress={() => router.push("/profile/edit" as any)}
              style={[
                styles.editAvatarBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <MaterialIcons name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>{displayName}</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{displayEmail}</Text>
        </View>

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{orders.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Orders
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              2.5k
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Points
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
            <View style={styles.tierBadge}>
              <MaterialIcons name="verified" size={14} color="#fbbf24" />
              <Text
                style={[styles.statValue, { color: "#fbbf24", fontSize: 16 }]}
              >
                GOLD
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Tier
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View
          style={[styles.menuContainer, { backgroundColor: colors.surface }]}
        >
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index !== MENU_ITEMS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={() => handleMenuPress(item.route)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.menuIconContainer,
                  { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={22}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.menuTitle, { color: colors.text }]}>
                {item.title}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            {
              backgroundColor: colors.error + "1A",
              borderColor: colors.error + "33",
            },
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        {/* Delete Account Link */}
        <TouchableOpacity
          style={styles.deleteAccountBtn}
          onPress={() => router.push("/profile/delete-account")}
        >
          <Text
            style={[styles.deleteAccountText, { color: colors.textSecondary }]}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  profileCard: {
    alignItems: "center",
    paddingBottom: 24,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: "500",
  },
  menuContainer: {
    marginHorizontal: 24,
    borderRadius: 32,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 32,
    gap: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
  },
  deleteAccountBtn: {
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 12,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
