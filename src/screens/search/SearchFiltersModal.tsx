import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Dimensions,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const SORT_OPTIONS = [
  "Recommended",
  "Popularity",
  "Rating",
  "Price: Low to High",
  "Price: High to Low",
];
const PRICE_RANGES = ["$", "$$", "$$$", "$$$$"];
const DIETARY = ["Vegetarian", "Vegan", "Gluten-free", "Halal", "Dairy-free"];
const RATINGS = ["4.5+", "4.0+", "3.5+", "Any"];

export const SearchFiltersModal: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [selectedSort, setSelectedSort] = useState("Recommended");
  const [selectedPrice, setSelectedPrice] = useState("$$");
  const [dietary, setDietary] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState("4.0+");

  const toggleDietary = (item: string) => {
    if (dietary.includes(item)) {
      setDietary(dietary.filter((i) => i !== item));
    } else {
      setDietary([...dietary, item]);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.closeBtn}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Filters
        </Text>
        <TouchableOpacity>
          <Text style={[styles.resetText, { color: colors.primary }]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sort By */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Sort By
          </Text>
          <View style={styles.sortList}>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedSort(option)}
                style={styles.radioItem}
              >
                <Text
                  style={[
                    styles.radioText,
                    {
                      color:
                        selectedSort === option
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {option}
                </Text>
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor:
                        selectedSort === option
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                >
                  {selectedSort === option && (
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
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Price Range
          </Text>
          <View style={styles.chipRow}>
            {PRICE_RANGES.map((price) => (
              <TouchableOpacity
                key={price}
                onPress={() => setSelectedPrice(price)}
                style={[
                  styles.priceChip,
                  {
                    backgroundColor:
                      selectedPrice === price
                        ? colors.primary
                        : colorScheme === "dark"
                          ? "#1E293B"
                          : "#F1F5F9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priceChipText,
                    {
                      color: selectedPrice === price ? "#FFFFFF" : colors.text,
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
          <View style={styles.wrapRow}>
            {DIETARY.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => toggleDietary(item)}
                style={[
                  styles.filterChip,
                  (dietary.includes(item) && {
                    backgroundColor: "rgba(238, 43, 140, 0.1)",
                    borderColor: colors.primary,
                  }) || { borderColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: dietary.includes(item)
                        ? colors.primary
                        : colors.textSecondary,
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Ratings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Rating
          </Text>
          <View style={styles.chipRow}>
            {RATINGS.map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() => setSelectedRating(rating)}
                style={[
                  styles.ratingChip,
                  (selectedRating === rating && {
                    backgroundColor: colors.blue,
                    borderColor: colors.blue,
                  }) || { borderColor: colors.border },
                ]}
              >
                <MaterialIcons
                  name="star"
                  size={16}
                  color={selectedRating === rating ? "#FFFFFF" : "#EAB308"}
                />
                <Text
                  style={[
                    styles.ratingChipText,
                    {
                      color:
                        selectedRating === rating ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {rating}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <Button
          title="Apply Filters"
          onPress={() => {}}
          variant="primary"
          size="lg"
          style={styles.applyBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resetText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  sortList: {
    gap: 16,
  },
  radioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  radioText: {
    fontSize: 16,
    fontWeight: "500",
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
  chipRow: {
    flexDirection: "row",
    gap: 12,
  },
  priceChip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  priceChipText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  wrapRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  ratingChip: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  ratingChipText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    borderTopWidth: 1,
  },
  applyBtn: {
    width: "100%",
  },
});
