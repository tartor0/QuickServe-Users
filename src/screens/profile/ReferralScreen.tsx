import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const STEPS = [
  {
    id: "1",
    title: "Share Code",
    desc: "Send your referral code to your friends",
  },
  { id: "2", title: "Friends Join", desc: "They get $5 off their first order" },
  {
    id: "3",
    title: "Get Reward",
    desc: "You get $5 credit when they complete their order",
  },
];

export const ReferralScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const referralCode = "QUICK-ALEX-99";

  const onShare = async () => {
    try {
      await Share.share({
        message: `Use my code ${referralCode} to get $5 off on QuickServe! Download now.`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Refer a Friend
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View
            style={[
              styles.illustrationBlob,
              { backgroundColor: "rgba(238, 43, 140, 0.05)" },
            ]}
          />
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=400",
            }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            Give $5, Get $5
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Share the convenience of QuickServe with your friends and earn
            rewards together!
          </Text>
        </View>

        {/* Code Card */}
        <View
          style={[
            styles.codeCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
          <View style={styles.codeRow}>
            <Text style={[styles.codeValue, { color: colors.text }]}>
              {referralCode}
            </Text>
            <TouchableOpacity
              style={[
                styles.copyBtn,
                { backgroundColor: "rgba(238, 43, 140, 0.1)" },
              ]}
            >
              <MaterialIcons
                name="content-copy"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Buttons */}
        <View style={styles.shareSection}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textSecondary, textAlign: "center" },
            ]}
          >
            Share via
          </Text>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#25D366" }]}
            >
              <FontAwesome name="whatsapp" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { backgroundColor: "#0084FF" }]}
            >
              <FontAwesome
                name="facebook-messenger"
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShare}
              style={[styles.socialBtn, { backgroundColor: colors.text }]}
            >
              <MaterialIcons
                name="more-horiz"
                size={28}
                color={colors.surface}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* How it works */}
        <View style={styles.stepsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How it Works
          </Text>
          <View style={styles.stepsList}>
            {STEPS.map((step, index) => (
              <View key={step.id} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepNumber,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.stepInfo}>
                  <Text style={[styles.stepTitle, { color: colors.text }]}>
                    {step.title}
                  </Text>
                  <Text
                    style={[styles.stepDesc, { color: colors.textSecondary }]}
                  >
                    {step.desc}
                  </Text>
                </View>
                {index < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepLine,
                      { backgroundColor: colors.border },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    position: "relative",
  },
  illustrationBlob: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  textContent: {
    alignItems: "center",
    marginTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  codeCard: {
    marginTop: 32,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
  },
  codeLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#94A3B8",
    letterSpacing: 2,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 16,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  copyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  shareSection: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  stepsSection: {
    marginTop: 48,
  },
  stepsList: {
    marginTop: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 32,
    position: "relative",
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    zIndex: 2,
  },
  stepNumberText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stepDesc: {
    fontSize: 14,
    marginTop: 4,
  },
  stepLine: {
    position: "absolute",
    left: 15,
    top: 32,
    width: 1,
    height: 32,
    zIndex: 1,
  },
});
