import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useTheme } from "@/src/context/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface SettingItemProps {
  icon: string;
  label: string;
  value?: string;
  type: "toggle" | "link" | "none";
  isEnabled?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  color?: string;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  label,
  value,
  type,
  isEnabled,
  onToggle,
  onPress,
  color,
}) => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  return (
    <TouchableOpacity
      style={[styles.item, { backgroundColor: colors.surface }]}
      onPress={type === "link" ? onPress : undefined}
      activeOpacity={type === "link" ? 0.7 : 1}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: color ? color + "1A" : "rgba(59, 130, 246, 0.1)" },
        ]}
      >
        <MaterialIcons
          name={icon as any}
          size={22}
          color={color || colors.primary}
        />
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {value && (
          <Text style={[styles.valueText, { color: colors.textSecondary }]}>
            {value}
          </Text>
        )}
      </View>

      {type === "toggle" && (
        <Switch
          value={isEnabled}
          onValueChange={onToggle}
          trackColor={{ false: "#d1d5db", true: colors.primary + "80" }}
          thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
          ios_backgroundColor="#d1d5db"
        />
      )}

      {type === "link" && (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={colors.textSecondary}
        />
      )}
    </TouchableOpacity>
  );
};

export const SettingsScreen: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [faceId, setFaceId] = useState(true);

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
          Settings
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ACCOUNT
          </Text>
          <View style={styles.itemsCard}>
            <SettingItem
              icon="person-outline"
              label="Edit Profile"
              type="link"
              onPress={() => router.push("/profile/edit")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="location-on"
              label="Saved Addresses"
              type="link"
              onPress={() => router.push("/profile/addresses")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="payment"
              label="Payment Methods"
              type="link"
              onPress={() => router.push("/profile/payment-methods")}
            />
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            APPEARANCE
          </Text>
          <View style={styles.itemsCard}>
            <SettingItem
              icon={colorScheme === "dark" ? "dark-mode" : "light-mode"}
              label="Dark Mode"
              type="toggle"
              isEnabled={colorScheme === "dark"}
              onToggle={toggleColorScheme}
              color="#fbbf24"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="language"
              label="Language"
              value="English (US)"
              type="link"
            />
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            NOTIFICATIONS
          </Text>
          <View style={styles.itemsCard}>
            <SettingItem
              icon="notifications-none"
              label="Push Notifications"
              type="toggle"
              isEnabled={notifications}
              onToggle={setNotifications}
              color="#f87171"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="local-offer"
              label="Promotions & Deals"
              type="toggle"
              isEnabled={promotions}
              onToggle={setPromotions}
              color="#10b981"
            />
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SECURITY
          </Text>
          <View style={styles.itemsCard}>
            <SettingItem
              icon="fingerprint"
              label="Face ID / Biometrics"
              type="toggle"
              isEnabled={faceId}
              onToggle={setFaceId}
              color="#6366f1"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="lock-outline"
              label="Change Password"
              type="link"
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SUPPORT & ABOUT
          </Text>
          <View style={styles.itemsCard}>
            <SettingItem icon="help-outline" label="Help Center" type="link" />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="info-outline"
              label="Terms of Service"
              type="link"
            />
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
            <SettingItem
              icon="privacy-tip"
              label="Privacy Policy"
              type="link"
            />
          </View>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Version 1.0.0 (Build 2492)
          </Text>
        </View>

        <View style={{ height: 60 }} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  itemsCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  valueText: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  versionContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  versionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
