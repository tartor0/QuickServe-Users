import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const NOTIFICATIONS = [
  {
    id: "1",
    title: "Order Delivered!",
    body: "Your order from Burger King has been delivered. Enjoy your meal!",
    time: "2 mins ago",
    icon: "check-circle",
    iconColor: "#10b981",
    unread: true,
  },
  {
    id: "2",
    title: "New Promo Code",
    body: "Get 20% OFF on your next order with code SAVE20. Valid for 48 hours.",
    time: "1 hour ago",
    icon: "local-offer",
    iconColor: "#3b82f6",
    unread: true,
  },
  {
    id: "3",
    title: "Order Picked Up",
    body: "The driver is on the way to your location.",
    time: "3 hours ago",
    icon: "delivery-dining",
    iconColor: "#f59e0b",
    unread: false,
  },
  {
    id: "4",
    title: "Wallet Top Up",
    body: "Successfully added $50.00 to your QuickServe Wallet.",
    time: "Yesterday",
    icon: "account-balance-wallet",
    iconColor: "#7c3aed",
    unread: false,
  },
];

export const NotificationsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <TouchableOpacity>
          <Text style={[styles.markRead, { color: colors.primary }]}>
            Mark all read
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={styles.content}>
          {NOTIFICATIONS.length > 0 ? (
            NOTIFICATIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.notificationItem,
                  { backgroundColor: colors.surface },
                  item.unread && {
                    borderLeftWidth: 4,
                    borderLeftColor: colors.primary,
                  },
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.iconColor + "1A" },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color={item.iconColor}
                  />
                </View>
                <View style={styles.textContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Text
                      style={[styles.itemTime, { color: colors.textSecondary }]}
                    >
                      {item.time}
                    </Text>
                  </View>
                  <Text
                    style={[styles.itemBody, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {item.body}
                  </Text>
                </View>
                {item.unread && (
                  <View
                    style={[
                      styles.unreadDot,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="notifications-none"
                size={64}
                color={colors.border}
              />
              <Text
                style={[styles.emptyTitle, { color: colors.textSecondary }]}
              >
                No notifications yet
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  markRead: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 12,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemTime: {
    fontSize: 12,
  },
  itemBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: "absolute",
    top: 16,
    right: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
});
