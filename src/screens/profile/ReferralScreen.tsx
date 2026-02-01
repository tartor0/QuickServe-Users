import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Clipboard,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const REFERRAL_CODE = "ALEX2024";

const BENEFITS = [
  {
    id: "1",
    icon: "card-giftcard",
    title: "They Get $10",
    description: "Your friend gets $10 off their first order",
  },
  {
    id: "2",
    icon: "stars",
    title: "You Get 200 Points",
    description: "Earn points when they complete their first order",
  },
  {
    id: "3",
    icon: "people",
    title: "Unlimited Referrals",
    description: "Invite as many friends as you want",
  },
];

const REFERRAL_STATS = [
  { label: "Total Referrals", value: "12" },
  { label: "Pending", value: "3" },
  { label: "Points Earned", value: "1,800" },
];

export const ReferralScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    Clipboard.setString(REFERRAL_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join QuickServe and get $10 off your first order! Use my code: ${REFERRAL_CODE}\n\nDownload the app: https://quickserve.app`,
      });
    } catch (error) {
      console.error(error);
    }
  };

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
          Refer a Friend
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroContainer}>
          <LinearGradient
            colors={["#3b82f6", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroCard, { shadowColor: colors.primary }]}
          >
            <View style={styles.heroIcon}>
              <MaterialIcons name="card-giftcard" size={48} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>Give $10, Get Points!</Text>
            <Text style={styles.heroSubtitle}>
              Share the love and earn rewards for every friend who joins
            </Text>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {REFERRAL_STATS.map((stat, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.statValue, { color: colors.text }]}>
                {stat.value}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Referral Code Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Referral Code
          </Text>
          <View style={[styles.codeCard, { backgroundColor: colors.surface }]}>
            <View style={styles.codeContent}>
              <Text style={[styles.codeLabel, { color: colors.textSecondary }]}>
                Share this code
              </Text>
              <Text style={[styles.code, { color: colors.text }]}>
                {REFERRAL_CODE}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.copyBtn,
                copied
                  ? { backgroundColor: "#10b981" }
                  : { backgroundColor: colors.primary },
              ]}
              onPress={handleCopyCode}
            >
              <MaterialIcons
                name={copied ? "check" : "content-copy"}
                size={20}
                color="#fff"
              />
              <Text style={styles.copyBtnText}>
                {copied ? "Copied!" : "Copy"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How It Works
          </Text>
          <View style={styles.benefitsContainer}>
            {BENEFITS.map((benefit, index) => (
              <View key={benefit.id} style={styles.benefitRow}>
                <View
                  style={[
                    styles.benefitNumber,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.benefitNumberText}>{index + 1}</Text>
                </View>
                <View
                  style={[
                    styles.benefitIconContainer,
                    { backgroundColor: colors.primary + "1A" },
                  ]}
                >
                  <MaterialIcons
                    name={benefit.icon as any}
                    size={24}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.benefitContent}>
                  <Text style={[styles.benefitTitle, { color: colors.text }]}>
                    {benefit.title}
                  </Text>
                  <Text
                    style={[
                      styles.benefitDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {benefit.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Share Button */}
        <View style={styles.shareContainer}>
          <TouchableOpacity
            style={[
              styles.shareBtn,
              { backgroundColor: colors.primary, shadowColor: colors.primary },
            ]}
            onPress={handleShare}
          >
            <MaterialIcons name="share" size={20} color="#fff" />
            <Text style={styles.shareBtnText}>Share with Friends</Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: colors.textSecondary }]}>
            By sharing your referral code, you agree to our{" "}
            <Text style={{ color: colors.primary, fontWeight: "600" }}>
              Referral Terms & Conditions
            </Text>
          </Text>
        </View>

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
  heroContainer: {
    padding: 16,
  },
  heroCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  codeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  codeContent: {
    flex: 1,
  },
  codeLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  code: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
  },
  copyBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  benefitsContainer: {
    gap: 20,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  benefitNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitNumberText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  shareContainer: {
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderRadius: 28,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  shareBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  termsContainer: {
    paddingHorizontal: 32,
    paddingTop: 24,
  },
  termsText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
});
