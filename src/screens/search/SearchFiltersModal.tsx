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
    TouchableOpacity,
    View,
} from "react-native";

const SORT_OPTIONS = [
  { id: "distance", label: "Distance", icon: "near-me" },
  { id: "rating", label: "Rating", icon: "star" },
  { id: "price", label: "Price", icon: "payments" },
  { id: "time", label: "Delivery Time", icon: "schedule" },
];

const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];

const DIETARY_PREFERENCES = [
  "Vegan",
  "Gluten-Free",
  "Halal",
  "Vegetarian",
  "Dairy-Free",
  "Keto",
];

export const SearchFiltersModal: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [selectedSort, setSelectedSort] = useState("distance");
  const [selectedPrice, setSelectedPrice] = useState("$");
  const [selectedDietary, setSelectedDietary] = useState<string[]>([
    "Gluten-Free",
  ]);
  const [rating, setRating] = useState(4.5);
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [fastestDelivery, setFastestDelivery] = useState(false);

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const activeFiltersCount =
    (selectedSort !== "distance" ? 1 : 0) +
    (selectedPrice !== "$" ? 1 : 0) +
    selectedDietary.length +
    (rating > 1 ? 1 : 0) +
    (freeDelivery ? 1 : 0) +
    (fastestDelivery ? 1 : 0);

  const handleApply = () => {
    // TODO: Apply filters
    router.back();
  };

  const handleClearAll = () => {
    setSelectedSort("distance");
    setSelectedPrice("$");
    setSelectedDietary([]);
    setRating(1);
    setFreeDelivery(false);
    setFastestDelivery(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
      <View style={styles.modalContainer}>
        {/* Bottom Sheet */}
        <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
          {/* Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.closeBtn}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Advanced Filters
            </Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={[styles.clearText, { color: "#3b82f6" }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Sort By */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Sort By
              </Text>
              <View style={styles.chipsContainer}>
                {SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.chip,
                      selectedSort === option.id && {
                        backgroundColor: colors.primary,
                      },
                      selectedSort !== option.id && {
                        backgroundColor: colors.background,
                      },
                    ]}
                    onPress={() => setSelectedSort(option.id)}
                  >
                    <MaterialIcons
                      name={option.icon as any}
                      size={18}
                      color={selectedSort === option.id ? "#fff" : colors.text}
                    />
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color:
                            selectedSort === option.id ? "#fff" : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Price Range
              </Text>
              <View style={styles.priceContainer}>
                {PRICE_RANGES.map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceBox,
                      selectedPrice === price && {
                        backgroundColor: "rgba(236, 19, 55, 0.05)",
                        borderColor: colors.primary,
                        borderWidth: 2,
                      },
                      selectedPrice !== price && {
                        backgroundColor: colors.background,
                        borderColor: colors.border,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setSelectedPrice(price)}
                  >
                    <Text
                      style={[
                        styles.priceText,
                        {
                          color:
                            selectedPrice === price
                              ? colors.primary
                              : colors.textSecondary,
                        },
                      ]}
                    >
                      {price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Dietary Preferences */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Dietary Preferences
              </Text>
              <View style={styles.chipsContainer}>
                {DIETARY_PREFERENCES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.chip,
                      selectedDietary.includes(item) && {
                        backgroundColor: "rgba(236, 19, 55, 0.1)",
                        borderColor: "rgba(236, 19, 55, 0.2)",
                        borderWidth: 1,
                      },
                      !selectedDietary.includes(item) && {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => toggleDietary(item)}
                  >
                    {selectedDietary.includes(item) && (
                      <MaterialIcons
                        name="check"
                        size={18}
                        color={colors.primary}
                      />
                    )}
                    <Text
                      style={[
                        styles.chipText,
                        {
                          color: selectedDietary.includes(item)
                            ? colors.primary
                            : colors.text,
                        },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Rating */}
            <View style={styles.section}>
              <View style={styles.ratingHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Rating
                </Text>
                <View style={styles.ratingBadge}>
                  <Text
                    style={[styles.ratingBadgeText, { color: colors.primary }]}
                  >
                    {rating.toFixed(1)}+ Stars
                  </Text>
                </View>
              </View>
              <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                  <View
                    style={[
                      styles.sliderFill,
                      {
                        width: `${((rating - 1) / 4) * 100}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.sliderThumb,
                      {
                        left: `${((rating - 1) / 4) * 100}%`,
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.sliderThumbInner,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  </View>
                </View>
                <View style={styles.sliderLabels}>
                  <Text
                    style={[
                      styles.sliderLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    1.0
                  </Text>
                  <Text
                    style={[
                      styles.sliderLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    2.0
                  </Text>
                  <Text
                    style={[
                      styles.sliderLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    3.0
                  </Text>
                  <Text
                    style={[
                      styles.sliderLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    4.0
                  </Text>
                  <Text
                    style={[
                      styles.sliderLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    5.0
                  </Text>
                </View>
              </View>
            </View>

            {/* Delivery Options */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Delivery Options
              </Text>
              <View style={styles.optionsContainer}>
                <View style={styles.optionRow}>
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                      ]}
                    >
                      <MaterialIcons
                        name="delivery-dining"
                        size={24}
                        color="#3b82f6"
                      />
                    </View>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      Free Delivery
                    </Text>
                  </View>
                  <Switch
                    value={freeDelivery}
                    onValueChange={setFreeDelivery}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#fff"
                  />
                </View>

                <View style={styles.optionRow}>
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.optionIcon,
                        { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                      ]}
                    >
                      <MaterialIcons name="bolt" size={24} color="#3b82f6" />
                    </View>
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      Fastest Delivery
                    </Text>
                  </View>
                  <Switch
                    value={fastestDelivery}
                    onValueChange={setFastestDelivery}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#fff"
                  />
                </View>
              </View>
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Sticky Footer */}
          <View
            style={[
              styles.footer,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={handleApply}
            >
              <Text style={styles.applyBtnText}>
                Apply{" "}
                {activeFiltersCount > 0
                  ? `${activeFiltersCount} Filters`
                  : "Filters"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 8,
  },
  handle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#d1d5db",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  clearText: {
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    gap: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  priceContainer: {
    flexDirection: "row",
    gap: 16,
  },
  priceBox: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "700",
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingBadge: {
    backgroundColor: "rgba(236, 19, 55, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 14,
    fontWeight: "700",
  },
  sliderContainer: {
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    position: "relative",
  },
  sliderFill: {
    position: "absolute",
    left: 0,
    top: 0,
    height: "100%",
    borderRadius: 4,
  },
  sliderThumb: {
    position: "absolute",
    top: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sliderThumbInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 4,
  },
  sliderLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  optionsContainer: {
    gap: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  applyBtn: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#ec1337",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  applyBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
