import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CONSEQUENCES = [
  {
    id: "1",
    icon: "history",
    title: "Order History",
    description: "All your past orders will be permanently deleted",
  },
  {
    id: "2",
    icon: "stars",
    title: "Rewards & Points",
    description: "You will lose all accumulated points and rewards",
  },
  {
    id: "3",
    icon: "credit-card",
    title: "Payment Methods",
    description: "All saved payment methods will be removed",
  },
  {
    id: "4",
    icon: "location-on",
    title: "Saved Addresses",
    description: "All your saved delivery addresses will be deleted",
  },
];

export const DeleteAccountScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [understood, setUnderstood] = useState(false);

  const canDelete = confirmText.toLowerCase() === "delete" && understood;

  const handleDelete = () => {
    if (canDelete) {
      // TODO: Implement actual account deletion
      router.replace("/auth/onboarding");
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
          Delete Account
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Warning Banner */}
        <View style={styles.warningBanner}>
          <View style={styles.warningIcon}>
            <MaterialIcons name="warning" size={32} color="#ef4444" />
          </View>
          <Text style={styles.warningTitle}>This action cannot be undone</Text>
          <Text style={styles.warningSubtitle}>
            Once you delete your account, all your data will be permanently
            removed from our servers.
          </Text>
        </View>

        {/* What You'll Lose */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What you'll lose
          </Text>
          <View style={styles.consequencesContainer}>
            {CONSEQUENCES.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.consequenceItem,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.consequenceIcon}>
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color="#ef4444"
                  />
                </View>
                <View style={styles.consequenceContent}>
                  <Text
                    style={[styles.consequenceTitle, { color: colors.text }]}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={[
                      styles.consequenceDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Alternatives */}
        <View
          style={[
            styles.alternativesCard,
            { backgroundColor: "rgba(59, 130, 246, 0.1)" },
          ]}
        >
          <Text style={[styles.alternativesTitle, { color: "#3b82f6" }]}>
            Consider these alternatives
          </Text>
          <View style={styles.alternativesList}>
            <View style={styles.alternativeItem}>
              <MaterialIcons
                name="pause-circle-outline"
                size={20}
                color="#3b82f6"
              />
              <Text style={[styles.alternativeText, { color: "#3b82f6" }]}>
                Temporarily deactivate your account
              </Text>
            </View>
            <View style={styles.alternativeItem}>
              <MaterialIcons
                name="notifications-off"
                size={20}
                color="#3b82f6"
              />
              <Text style={[styles.alternativeText, { color: "#3b82f6" }]}>
                Turn off notifications instead
              </Text>
            </View>
            <View style={styles.alternativeItem}>
              <MaterialIcons name="support-agent" size={20} color="#3b82f6" />
              <Text style={[styles.alternativeText, { color: "#3b82f6" }]}>
                Contact support for help
              </Text>
            </View>
          </View>
        </View>

        {/* Confirmation */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Confirm Deletion
          </Text>

          <View
            style={[styles.inputContainer, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Type "DELETE" to confirm
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="DELETE"
              placeholderTextColor={colors.textSecondary}
              value={confirmText}
              onChangeText={setConfirmText}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.checkboxContainer}>
            <Switch
              value={understood}
              onValueChange={setUnderstood}
              trackColor={{ false: colors.border, true: "#ef4444" }}
              thumbColor="#fff"
            />
            <Text style={[styles.checkboxText, { color: colors.text }]}>
              I understand that this action is permanent and cannot be reversed
            </Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Footer */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.cancelBtn,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelBtnText, { color: colors.text }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.deleteBtn,
            canDelete
              ? { backgroundColor: "#ef4444" }
              : { backgroundColor: colors.border },
          ]}
          onPress={handleDelete}
          disabled={!canDelete}
        >
          <Text
            style={[
              styles.deleteBtnText,
              { color: canDelete ? "#fff" : colors.textSecondary },
            ]}
          >
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>
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
  warningBanner: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  warningIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ef4444",
    marginBottom: 8,
    textAlign: "center",
  },
  warningSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 20,
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
  consequencesContainer: {
    gap: 12,
  },
  consequenceItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  consequenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  consequenceContent: {
    flex: 1,
  },
  consequenceTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  consequenceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  alternativesCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
  },
  alternativesTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  alternativesList: {
    gap: 12,
  },
  alternativeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  inputContainer: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 2,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
  deleteBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
