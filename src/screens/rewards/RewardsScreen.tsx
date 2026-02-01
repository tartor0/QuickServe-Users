import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const REWARDS = [
  {
    id: "1",
    title: "$5 OFF",
    description: "On orders over $25",
    points: 500,
    image: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400",
  },
  {
    id: "2",
    title: "Free Delivery",
    description: "Valid for 1 order",
    points: 300,
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400",
  },
  {
    id: "3",
    title: "$10 OFF",
    description: "On orders over $50",
    points: 1000,
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=400",
  },
  {
    id: "4",
    title: "Double Points",
    description: "For your next order",
    points: 750,
    image: "https://images.unsplash.com/photo-1607083206325-caf1edba7a0f?w=400",
  },
];

const HISTORY = [
  { id: "1", action: "Order Completed", points: "+50", date: "Oct 24, 2023" },
  { id: "2", action: "Redeemed $5 OFF", points: "-500", date: "Oct 20, 2023" },
  { id: "3", action: "Order Completed", points: "+50", date: "Oct 18, 2023" },
  { id: "4", action: "Referral Bonus", points: "+200", date: "Oct 15, 2023" },
];

export const RewardsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"rewards" | "history">(
    "rewards",
  );

  const currentPoints = 1250;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top App Bar */}
      <View style={[styles.topBar, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons
            name="arrow-back-ios-new"
            size={20}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.topBarTitle, { color: colors.text }]}>
          Rewards
        </Text>
        <TouchableOpacity>
          <MaterialIcons name="info-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Points Card */}
        <View style={styles.pointsCardContainer}>
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.pointsCard, { shadowColor: colors.primary }]}
          >
            <View style={styles.pointsCardContent}>
              <View style={styles.pointsLeft}>
                <Text style={styles.pointsLabel}>Your Points</Text>
                <Text style={styles.pointsAmount}>
                  {currentPoints.toLocaleString()}
                </Text>
                <Text style={styles.pointsSubtext}>
                  Keep earning to unlock more!
                </Text>
              </View>
              <View style={styles.pointsIcon}>
                <MaterialIcons
                  name="stars"
                  size={64}
                  color="rgba(255,255,255,0.3)"
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* How to Earn Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How to Earn
          </Text>
          <View style={styles.earnGrid}>
            <View
              style={[styles.earnCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.earnIcon,
                  { backgroundColor: colors.primary + "1A" },
                ]}
              >
                <MaterialIcons
                  name="shopping-bag"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.earnPoints, { color: colors.text }]}>
                +50
              </Text>
              <Text style={[styles.earnLabel, { color: colors.textSecondary }]}>
                Per Order
              </Text>
            </View>

            <View
              style={[styles.earnCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.earnIcon,
                  { backgroundColor: "rgba(139, 92, 246, 0.1)" },
                ]}
              >
                <MaterialIcons name="people" size={24} color="#8b5cf6" />
              </View>
              <Text style={[styles.earnPoints, { color: colors.text }]}>
                +200
              </Text>
              <Text style={[styles.earnLabel, { color: colors.textSecondary }]}>
                Per Referral
              </Text>
            </View>

            <View
              style={[styles.earnCard, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.earnIcon,
                  { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                ]}
              >
                <MaterialIcons name="rate-review" size={24} color="#3b82f6" />
              </View>
              <Text style={[styles.earnPoints, { color: colors.text }]}>
                +25
              </Text>
              <Text style={[styles.earnLabel, { color: colors.textSecondary }]}>
                Per Review
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "rewards" && {
                borderBottomWidth: 2,
                borderBottomColor: colors.primary,
              },
            ]}
            onPress={() => setSelectedTab("rewards")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === "rewards"
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              Available Rewards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "history" && {
                borderBottomWidth: 2,
                borderBottomColor: colors.primary,
              },
            ]}
            onPress={() => setSelectedTab("history")}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedTab === "history"
                      ? colors.primary
                      : colors.textSecondary,
                },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === "rewards" ? (
          <View style={styles.rewardsGrid}>
            {REWARDS.map((reward) => {
              const canRedeem = currentPoints >= reward.points;
              return (
                <View
                  key={reward.id}
                  style={[
                    styles.rewardCard,
                    { backgroundColor: colors.surface },
                    !canRedeem && { opacity: 0.6 },
                  ]}
                >
                  <Image
                    source={{ uri: reward.image }}
                    style={styles.rewardImage}
                  />
                  <View style={styles.rewardContent}>
                    <Text style={[styles.rewardTitle, { color: colors.text }]}>
                      {reward.title}
                    </Text>
                    <Text
                      style={[
                        styles.rewardDescription,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {reward.description}
                    </Text>
                    <View style={styles.rewardFooter}>
                      <View style={styles.pointsBadge}>
                        <MaterialIcons name="stars" size={14} color="#f59e0b" />
                        <Text
                          style={[
                            styles.pointsRequired,
                            { color: colors.text },
                          ]}
                        >
                          {reward.points} pts
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.redeemBtn,
                          canRedeem
                            ? { backgroundColor: colors.primary }
                            : { backgroundColor: colors.border },
                        ]}
                        disabled={!canRedeem}
                      >
                        <Text
                          style={[
                            styles.redeemBtnText,
                            {
                              color: canRedeem ? "#fff" : colors.textSecondary,
                            },
                          ]}
                        >
                          {canRedeem ? "Redeem" : "Locked"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.historyList}>
            {HISTORY.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.historyItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.historyLeft}>
                  <Text style={[styles.historyAction, { color: colors.text }]}>
                    {item.action}
                  </Text>
                  <Text
                    style={[
                      styles.historyDate,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.historyPoints,
                    {
                      color: item.points.startsWith("+")
                        ? "#10b981"
                        : "#ef4444",
                    },
                  ]}
                >
                  {item.points}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 8,
  },
  backBtn: {
    width: 48,
    height: 48,
    justifyContent: "center",
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  pointsCardContainer: {
    padding: 16,
  },
  pointsCard: {
    borderRadius: 24,
    padding: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  pointsCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsLeft: {
    flex: 1,
  },
  pointsLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  pointsAmount: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "800",
    marginBottom: 4,
  },
  pointsSubtext: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
  },
  pointsIcon: {
    opacity: 0.5,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  earnGrid: {
    flexDirection: "row",
    gap: 12,
  },
  earnCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  earnIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  earnPoints: {
    fontSize: 18,
    fontWeight: "700",
  },
  earnLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "700",
  },
  rewardsGrid: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  rewardCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rewardImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#e5e7eb",
  },
  rewardContent: {
    padding: 16,
  },
  rewardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  rewardDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pointsRequired: {
    fontSize: 14,
    fontWeight: "700",
  },
  redeemBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  redeemBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  historyList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  historyLeft: {
    flex: 1,
  },
  historyAction: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
  },
  historyPoints: {
    fontSize: 16,
    fontWeight: "700",
  },
});
