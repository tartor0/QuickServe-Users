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

export const RateOrderScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [foodRating, setFoodRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [comment, setComment] = useState("");

  const renderStars = (rating: number, setRating: (r: number) => void) => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <MaterialIcons
              name={star <= rating ? "star" : "star-border"}
              size={40}
              color={star <= rating ? "#fbbf24" : colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSubmit = () => {
    // Logic to submit rating
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
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Rate Your Order
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.orderSummary}>
            <Text style={[styles.orderId, { color: colors.textSecondary }]}>
              Order #{id || "2492"}
            </Text>
            <Text style={[styles.sellerName, { color: colors.text }]}>
              Burger King
            </Text>
          </View>

          {/* Food Rating */}
          <View style={styles.ratingSection}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>
              How was the food?
            </Text>
            {renderStars(foodRating, setFoodRating)}
          </View>

          {/* Delivery Rating */}
          <View style={styles.ratingSection}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>
              How was the delivery?
            </Text>
            {renderStars(deliveryRating, setDeliveryRating)}
          </View>

          {/* Comment Section */}
          <View style={styles.commentSection}>
            <Text style={[styles.ratingLabel, { color: colors.text }]}>
              Add a comment (Optional)
            </Text>
            <View
              style={[
                styles.textAreaContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <TextInput
                style={[styles.textArea, { color: colors.text }]}
                placeholder="Tell us what you liked or how we can improve..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={comment}
                onChangeText={setComment}
              />
            </View>
          </View>

          {/* Photo Upload Placeholder */}
          <View style={styles.photoSection}>
            <TouchableOpacity
              style={[styles.photoBtn, { borderColor: colors.border }]}
            >
              <MaterialIcons
                name="add-a-photo"
                size={32}
                color={colors.textSecondary}
              />
              <Text style={[styles.photoText, { color: colors.textSecondary }]}>
                Add Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor:
                foodRating > 0 && deliveryRating > 0
                  ? colors.primary
                  : colors.border,
            },
          ]}
          disabled={foodRating === 0 || deliveryRating === 0}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Submit Rating</Text>
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
  content: {
    padding: 24,
  },
  orderSummary: {
    alignItems: "center",
    marginBottom: 40,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 24,
    fontWeight: "800",
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },
  starContainer: {
    flexDirection: "row",
    gap: 12,
  },
  commentSection: {
    marginBottom: 32,
  },
  textAreaContainer: {
    borderRadius: 20,
    padding: 16,
    height: 120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  textArea: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: "top",
  },
  photoSection: {
    marginBottom: 32,
  },
  photoBtn: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  photoText: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  submitBtn: {
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
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
