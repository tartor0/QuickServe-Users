import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
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
    route: null,
  },
  {
    id: "2",
    title: "Saved Addresses",
    icon: "location-on",
    route: null,
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
    id: "6",
    title: "Rewards",
    icon: "card-giftcard",
    route: "/rewards/index",
  },
  {
    id: "7",
    title: "Refer a Friend",
    icon: "people",
    route: "/profile/referral",
  },
  {
    id: "8",
    title: "Settings",
    icon: "settings",
    route: null,
  },
];

export const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const handleMenuPress = (route: string | null) => {
    if (route) {
      router.push(route as any);
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    router.replace("/auth/onboarding");
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
              source={{
                uri: "https://ui-avatars.com/api/?name=Alex+Johnson&size=128&background=3B82F6&color=fff",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={[styles.editAvatarBtn, { backgroundColor: "#f04299" }]}
            >
              <MaterialIcons name="edit" size={16} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.userName, { color: colors.text }]}>
            Alex Johnson
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            alex.j@example.com
          </Text>
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
                  color="#3B82F6"
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
            { backgroundColor: "rgba(240, 66, 153, 0.1)" },
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="#f04299" />
          <Text style={[styles.logoutText, { color: "#f04299" }]}>Log Out</Text>
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
    borderColor: "rgba(240, 66, 153, 0.2)",
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
});
