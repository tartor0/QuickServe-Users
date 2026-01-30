import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const REASONS = [
  "Privacy concerns",
  "Too many notifications",
  "Issues with orders",
  "I have a another account",
  "Other",
];

export const DeleteAccountScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [selectedReason, setSelectedReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Delete Account
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Warning Section */}
        <View style={styles.warningContainer}>
          <View
            style={[
              styles.iconBlob,
              { backgroundColor: "rgba(239, 68, 68, 0.1)" },
            ]}
          >
            <MaterialIcons name="warning" size={48} color="#ef4444" />
          </View>
          <Text style={[styles.warningTitle, { color: colors.text }]}>
            We're sorry to see you go
          </Text>
          <Text
            style={[styles.warningSubtitle, { color: colors.textSecondary }]}
          >
            Deleting your account is permanent and cannot be undone. All your
            data will be cleared.
          </Text>
        </View>

        {/* Consequences */}
        <View
          style={[
            styles.consequences,
            { backgroundColor: colorScheme === "dark" ? "#1E293B" : "#F8FAFC" },
          ]}
        >
          <Text style={[styles.consqTitle, { color: colors.text }]}>
            What you'll lose:
          </Text>
          <View style={styles.consqList}>
            <View style={styles.consqItem}>
              <MaterialIcons
                name="history"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.consqText, { color: colors.textSecondary }]}>
                Complete order history and receipts
              </Text>
            </View>
            <View style={styles.consqItem}>
              <MaterialIcons
                name="stars"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.consqText, { color: colors.textSecondary }]}>
                Saved rewards points (2,450 pts)
              </Text>
            </View>
            <View style={styles.consqItem}>
              <MaterialIcons
                name="favorite"
                size={20}
                color={colors.textSecondary}
              />
              <Text style={[styles.consqText, { color: colors.textSecondary }]}>
                All saved favorite restaurants and addresses
              </Text>
            </View>
          </View>
        </View>

        {/* Reason Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Why are you leaving?
          </Text>
          {REASONS.map((reason) => (
            <TouchableOpacity
              key={reason}
              onPress={() => setSelectedReason(reason)}
              style={[
                styles.reasonItem,
                { borderColor: colors.border },
                selectedReason === reason && {
                  borderColor: colors.primary,
                  backgroundColor: "rgba(238, 43, 140, 0.05)",
                },
              ]}
            >
              <Text
                style={[
                  styles.reasonText,
                  {
                    color:
                      selectedReason === reason ? colors.primary : colors.text,
                  },
                ]}
              >
                {reason}
              </Text>
              <View
                style={[
                  styles.radioOuter,
                  {
                    borderColor:
                      selectedReason === reason
                        ? colors.primary
                        : colors.border,
                  },
                ]}
              >
                {selectedReason === reason && (
                  <View
                    style={[
                      styles.radioInner,
                      { backgroundColor: colors.primary },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Confirmation */}
        <TouchableOpacity
          style={styles.confirmRow}
          onPress={() => setConfirmed(!confirmed)}
          activeOpacity={0.8}
        >
          <View
            style={[
              styles.checkbox,
              { borderColor: colors.border },
              confirmed && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
          >
            {confirmed && (
              <MaterialIcons name="check" size={16} color="#FFFFFF" />
            )}
          </View>
          <Text style={[styles.confirmText, { color: colors.text }]}>
            I understand that this action is permanent and my data cannot be
            recovered.
          </Text>
        </TouchableOpacity>

        {/* Action Button */}
        <View style={styles.actionSection}>
          <Button
            title="Delete My Account"
            onPress={() => {}}
            variant="danger"
            size="lg"
            disabled={!confirmed || !selectedReason}
            style={styles.deleteBtn}
          />
          <TouchableOpacity style={styles.cancelBtn}>
            <Text
              style={[styles.cancelBtnText, { color: colors.textSecondary }]}
            >
              Keep My Account
            </Text>
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
  warningContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  iconBlob: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  warningSubtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
  consequences: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  consqTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  consqList: {
    gap: 16,
  },
  consqItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  consqText: {
    fontSize: 14,
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 15,
    fontWeight: "600",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confirmRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 32,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  confirmText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  actionSection: {
    gap: 16,
  },
  deleteBtn: {
    width: "100%",
  },
  cancelBtn: {
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
