import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export const PaymentMethodsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [saveCard, setSaveCard] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.blue} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Add New Card
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card Mockup */}
        <View style={styles.cardContainer}>
          <LinearGradient
            colors={["#f04299", "#ff7eb3", "#2563eb"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardTop}>
              <View style={styles.chip} />
              <MaterialIcons
                name="contactless"
                size={32}
                color="rgba(255,255,255,0.8)"
              />
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.cardNumber}>**** **** **** 1234</Text>
              <View style={styles.cardInfoRow}>
                <View>
                  <Text style={styles.cardLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardValue}>JOHN DOE</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.cardLabel}>EXPIRES</Text>
                  <Text style={styles.cardValue}>MM/YY</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <Input
            label="Card Number"
            placeholder="0000 0000 0000 0000"
            keyboardType="numeric"
            rightIcon={
              <MaterialIcons name="credit-card" size={24} color={colors.blue} />
            }
          />
          <Input label="Cardholder Name" placeholder="e.g. John Doe" />
          <View style={styles.row}>
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              containerStyle={{ flex: 1, marginRight: 8 }}
            />
            <Input
              label="CVV"
              placeholder="123"
              secureTextEntry
              containerStyle={{ flex: 1, marginLeft: 8 }}
              rightIcon={
                <MaterialIcons
                  name="help-outline"
                  size={18}
                  color={colors.blue}
                />
              }
            />
          </View>

          {/* Toggle */}
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: colors.text }]}>
                Save card for future payments
              </Text>
              <Text style={styles.toggleSubtitle}>
                Securely save your card for 1-click checkout
              </Text>
            </View>
            <Switch
              value={saveCard}
              onValueChange={setSaveCard}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Button
            title="Save Card"
            onPress={() => {}}
            variant="primary"
            size="lg"
            style={styles.saveBtn}
            icon={<MaterialIcons name="lock" size={20} color="#FFFFFF" />}
          />

          <Text style={styles.disclaimer}>
            Your payment information is encrypted and processed securely. By
            adding this card, you agree to our Terms of Service.
          </Text>
        </View>

        {/* Security Badges */}
        <View style={styles.securityRow}>
          <MaterialIcons name="verified-user" size={32} color="#CBD5E1" />
          <MaterialIcons name="payments" size={32} color="#CBD5E1" />
          <MaterialIcons name="security" size={32} color="#CBD5E1" />
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
  },
  cardContainer: {
    padding: 24,
  },
  cardGradient: {
    height: 220,
    borderRadius: 24,
    padding: 24,
    justifyContent: "space-between",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chip: {
    width: 48,
    height: 36,
    backgroundColor: "rgba(255, 215, 0, 0.8)",
    borderRadius: 8,
  },
  cardBottom: {
    gap: 16,
  },
  cardNumber: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
    letterSpacing: 2,
  },
  cardInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  form: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    borderTopWidth: 1,
    borderTopColor: "rgba(226, 232, 240, 0.5)",
    marginTop: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  toggleSubtitle: {
    fontSize: 12,
    color: "#896175",
    marginTop: 4,
  },
  saveBtn: {
    marginTop: 24,
  },
  disclaimer: {
    textAlign: "center",
    fontSize: 10,
    color: "#896175",
    marginTop: 24,
    paddingHorizontal: 32,
    lineHeight: 16,
  },
  securityRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 32,
    opacity: 0.3,
  },
});
