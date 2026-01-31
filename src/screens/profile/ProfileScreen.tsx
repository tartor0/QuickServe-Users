import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useRouter } from "expo-router";

const MENU_ITEMS = [
  {
    id: "1",
    title: "Subscription",
    icon: "stars",
    color: "#3B82F6",
    route: "/profile/subscription",
  },
  {
    id: "2",
    title: "Payment Methods",
    icon: "credit-card",
    color: "#3B82F6",
    route: "/profile/payment-methods",
  },
  {
    id: "3",
    title: "Rewards",
    icon: "card-giftcard",
    color: "#3B82F6",
    route: "/rewards/index",
  },
  {
    id: "4",
    title: "Refer a Friend",
    icon: "people",
    color: "#3B82F6",
    route: "/profile/referral",
  },
  {
    id: "5",
    title: "Delete Account",
    icon: "delete",
    color: "#EF4444",
    route: "/profile/delete-account",
  },
];

export const ProfileScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ... (Header remains same) */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            My Profile
          </Text>
          <View style={styles.avatarContainer}>
            <View
              style={[styles.avatarWrapper, { borderColor: colors.surface }]}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
                }}
                style={styles.avatar}
              />
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <MaterialIcons name="edit" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              Alex Johnson
            </Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
              alex.j@example.com
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <View
            style={[
              styles.menuList,
              {
                backgroundColor:
                  colorScheme === "dark" ? "rgba(30, 41, 59, 0.5)" : "#FFFFFF",
              },
            ]}
          >
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => item.route && router.push(item.route as any)}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    {
                      backgroundColor:
                        colorScheme === "dark"
                          ? "rgba(59, 130, 246, 0.1)"
                          : "#EFF6FF",
                    },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={22}
                    color={item.color}
                  />
                </View>
                <Text style={[styles.menuItemText, { color: colors.text }]}>
                  {item.title}
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.logoutBtn,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(236, 72, 153, 0.1)"
                    : "#FDF2F8",
              },
            ]}
          >
            <MaterialIcons name="logout" size={20} color="#f04299" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 32,
  },
  avatarContainer: {
    position: "relative",
  },
  avatarWrapper: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  editBtn: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#f04299",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userInfo: {
    marginTop: 16,
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 4,
  },
  menuContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  menuList: {
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.5)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
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
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutBtn: {
    marginTop: 24,
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(236, 72, 153, 0.2)",
  },
  logoutText: {
    color: "#f04299",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
