import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ADDRESSES = [
  {
    id: "1",
    label: "Home",
    address: "123 Main Street, Apt 4B",
    city: "Queens, NY 11101",
    isDefault: true,
    icon: "home",
  },
  {
    id: "2",
    label: "Work",
    address: "456 Tech Avenue, Floor 12",
    city: "Manhattan, NY 10012",
    isDefault: false,
    icon: "business",
  },
  {
    id: "3",
    label: "Gym",
    address: "789 Fitness Blvd",
    city: "Brooklyn, NY 11201",
    isDefault: false,
    icon: "fitness-center",
  },
];

export const AddressesScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

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
          My Addresses
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/profile/addresses/edit" as any)}
          style={styles.addBtn}
        >
          <MaterialIcons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.addressList}>
          {ADDRESSES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.addressCard, { backgroundColor: colors.surface }]}
              activeOpacity={0.7}
              onPress={() =>
                router.push({
                  pathname: "/profile/addresses/edit",
                  params: { id: item.id },
                } as any)
              }
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                ]}
              >
                <MaterialIcons
                  name={item.icon as any}
                  size={24}
                  color={colors.primary}
                />
              </View>

              <View style={styles.addressInfo}>
                <View style={styles.labelRow}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  {item.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <Text
                  style={[styles.addressLine, { color: colors.textSecondary }]}
                >
                  {item.address}
                </Text>
                <Text
                  style={[styles.cityLine, { color: colors.textSecondary }]}
                >
                  {item.city}
                </Text>
              </View>

              <MaterialIcons
                name="edit"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty State Illustration would go here if ADDRESES was empty */}
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.addNewBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/profile/addresses/edit" as any)}
        >
          <MaterialIcons name="add-location-alt" size={20} color="#fff" />
          <Text style={styles.addNewText}>Add New Address</Text>
        </TouchableOpacity>
      </View>
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
  addBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  addressList: {
    gap: 12,
  },
  addressCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  defaultBadge: {
    backgroundColor: "#10b981",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  addressLine: {
    fontSize: 14,
    lineHeight: 20,
  },
  cityLine: {
    fontSize: 14,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  addNewBtn: {
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addNewText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
