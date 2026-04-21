import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/src/services/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface PaymentMethod {
  id: string;
  brand: string;
  last_four: string;
  expiry_month: number;
  expiry_year: number;
  is_default: boolean;
}

const BRAND_IMAGES: Record<string, string> = {
  visa: "https://img.icons8.com/color/96/visa.png",
  mastercard: "https://img.icons8.com/color/96/mastercard.png",
  amex: "https://img.icons8.com/color/96/amex.png",
};

export const PaymentMethodsScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const loadCards = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: methods }, { data: profile }] = await Promise.all([
        supabase
          .from("payment_methods")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false }),
        supabase
          .from("users")
          .select("wallet_balance")
          .eq("id", user.id)
          .single(),
      ]);

      setCards(methods ?? []);
      setWalletBalance(profile?.wallet_balance ?? 0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCards(); }, [loadCards]);

  const handleSetDefault = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("payment_methods").update({ is_default: true }).eq("id", id);
    loadCards();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Remove Card", "Remove this card from your account?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove", style: "destructive",
        onPress: async () => {
          await supabase.from("payment_methods").delete().eq("id", id);
          loadCards();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>SAVED CARDS</Text>

        {cards.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No saved cards yet.</Text>
        ) : (
          <View style={styles.cardsList}>
            {cards.map((card) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardItem, { backgroundColor: colors.surface }]}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: BRAND_IMAGES[card.brand.toLowerCase()] ?? BRAND_IMAGES.visa }}
                    style={styles.cardIcon}
                    resizeMode="contain"
                  />
                  {card.is_default ? (
                    <View style={[styles.defaultBadge, { backgroundColor: colors.primary + "1A" }]}>
                      <Text style={[styles.defaultText, { color: colors.primary }]}>Default</Text>
                    </View>
                  ) : (
                    <TouchableOpacity onPress={() => handleSetDefault(card.id)}>
                      <Text style={[styles.setDefaultText, { color: colors.primary }]}>Set default</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.cardInfo}>
                  <Text style={[styles.cardNumber, { color: colors.text }]}>
                    •••• •••• •••• {card.last_four}
                  </Text>
                  <View style={styles.cardMeta}>
                    <Text style={[styles.expiryLabel, { color: colors.textSecondary }]}>Expires</Text>
                    <Text style={[styles.expiryValue, { color: colors.text }]}>
                      {String(card.expiry_month).padStart(2, "0")}/{String(card.expiry_year).slice(-2)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.moreBtn} onPress={() => handleDelete(card.id)}>
                  <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity style={[styles.addCardBtn, { borderColor: colors.primary }]} activeOpacity={0.7}>
          <View style={[styles.addIconContainer, { backgroundColor: colors.primary }]}>
            <MaterialIcons name="add" size={24} color="#fff" />
          </View>
          <Text style={[styles.addCardText, { color: colors.primary }]}>Add New Payment Method</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: 32 }]}>OTHER METHODS</Text>
        <View style={styles.otherMethods}>
          <TouchableOpacity style={[styles.methodItem, { backgroundColor: colors.surface }]}>
            <View style={[styles.methodIcon, { backgroundColor: "#EBF4FF" }]}>
              <MaterialIcons name="account-balance-wallet" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.methodName, { color: colors.text }]}>
              Wallet Balance (${walletBalance.toFixed(2)})
            </Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.methodItem, { backgroundColor: colors.surface }]}>
            <View style={[styles.methodIcon, { backgroundColor: "#F3F4F6" }]}>
              <MaterialIcons name="qr-code-scanner" size={24} color="#374151" />
            </View>
            <Text style={[styles.methodName, { color: colors.text }]}>Google Pay</Text>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 16,
    marginLeft: 4,
  },
  cardsList: {
    gap: 16,
  },
  cardItem: {
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cardIcon: {
    width: 60,
    height: 36,
  },
  defaultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardInfo: {
    gap: 12,
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  cardMeta: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  expiryLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  expiryValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  moreBtn: {
    position: "absolute",
    top: 20,
    right: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  addCardBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 64,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    marginTop: 24,
    gap: 12,
  },
  addIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addCardText: {
    fontSize: 16,
    fontWeight: "700",
  },
  otherMethods: {
    gap: 12,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  methodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 16,
  },
});
