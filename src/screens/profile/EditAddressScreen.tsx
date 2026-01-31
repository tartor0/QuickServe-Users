import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const ADDRESS_TYPES = [
  { label: "Home", icon: "home" },
  { label: "Work", icon: "business" },
  { label: "Other", icon: "location-on" },
];

export const EditAddressScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = !!id;

  const [type, setType] = useState("Home");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    // Save logic here
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
          {isEditing ? "Edit Address" : "New Address"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Picker Placeholder */}
        <View
          style={[styles.mapPlaceholder, { backgroundColor: colors.surface }]}
        >
          <MaterialIcons name="map" size={48} color={colors.textSecondary} />
          <Text style={[styles.mapText, { color: colors.textSecondary }]}>
            Select on Map
          </Text>
          <View style={styles.pinContainer}>
            <MaterialIcons
              name="location-on"
              size={40}
              color={colors.primary}
            />
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Label as
          </Text>
          <View style={styles.typeContainer}>
            {ADDRESS_TYPES.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.typeBtn,
                  { backgroundColor: colors.surface },
                  type === item.label && {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setType(item.label)}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={20}
                  color={
                    type === item.label ? colors.primary : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.typeLabel,
                    {
                      color:
                        type === item.label
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Street Address
            </Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <MaterialIcons
                name="location-on"
                size={20}
                color={colors.textSecondary}
              />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="123 Main St"
                placeholderTextColor={colors.textSecondary}
                value={street}
                onChangeText={setStreet}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Apt / Suite
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="4B"
                  placeholderTextColor={colors.textSecondary}
                  value={apt}
                  onChangeText={setApt}
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text
                style={[styles.inputLabel, { color: colors.textSecondary }]}
              >
                Zip Code
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="10001"
                  placeholderTextColor={colors.textSecondary}
                  value={zip}
                  onChangeText={setZip}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              City
            </Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="New York"
                placeholderTextColor={colors.textSecondary}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Delivery Instructions
            </Text>
            <View
              style={[
                styles.inputContainer,
                styles.textArea,
                { backgroundColor: colors.surface },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  { color: colors.text, textAlignVertical: "top" },
                ]}
                placeholder="Gate code, drop at door, etc."
                placeholderTextColor={colors.textSecondary}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>Save Address</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  mapPlaceholder: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(0,0,0,0.1)",
  },
  mapText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  pinContainer: {
    position: "absolute",
    bottom: "50%",
    marginBottom: -4,
  },
  form: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  typeBtn: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  textArea: {
    height: 120,
    alignItems: "flex-start",
    paddingVertical: 16,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  saveBtn: {
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
