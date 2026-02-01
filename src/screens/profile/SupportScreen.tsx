import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    LayoutAnimation,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FAQS = [
  {
    question: "How do I track my order?",
    answer:
      'You can track your order in real-time by going to the Orders tab and clicking on the "Track Order" button for any active order.',
  },
  {
    question: "What if my food is late?",
    answer:
      "While we strive for timely deliveries, sometimes factors like traffic or restaurant delays occur. If your order is significantly late, please contact support.",
  },
  {
    question: "How do I cancel my order?",
    answer:
      "Orders can only be cancelled within 2 minutes of placing them. After that, the restaurant begins preparation. Go to Order Details to see cancellation options.",
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "You can change the address before the driver picks up the order. Contact support immediately if you need to change the destination.",
  },
];

const CONTACT_OPTIONS = [
  {
    id: "chat",
    label: "Live Chat",
    icon: "chat-bubble",
    color: "#3b82f6",
    sub: "Average wait: 2 mins",
  },
  {
    id: "call",
    label: "Call Us",
    icon: "phone",
    color: "#10b981",
    sub: "24/7 Premium support",
  },
  {
    id: "email",
    label: "Email Support",
    icon: "mail",
    color: "#7c3aed",
    sub: "Response within 24h",
  },
];

export const SupportScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

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
          Help & Support
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            CONTACT US
          </Text>
          <View style={styles.contactList}>
            {CONTACT_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.contactItem,
                  { backgroundColor: colors.surface },
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: item.color + "1A" },
                  ]}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={24}
                    color={item.color}
                  />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactLabel, { color: colors.text }]}>
                    {item.label}
                  </Text>
                  <Text
                    style={[styles.contactSub, { color: colors.textSecondary }]}
                  >
                    {item.sub}
                  </Text>
                </View>
                <MaterialIcons
                  name="chevron-right"
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* FAQs Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            FREQUENTLY ASKED QUESTIONS
          </Text>
          <View style={styles.faqList}>
            {FAQS.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.faqItem, { backgroundColor: colors.surface }]}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>
                    {faq.question}
                  </Text>
                  <MaterialIcons
                    name={
                      expandedFaq === index
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
                {expandedFaq === index && (
                  <Text
                    style={[styles.faqAnswer, { color: colors.textSecondary }]}
                  >
                    {faq.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Report an Issue Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.reportBtn, { backgroundColor: colors.surface }]}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: "#ef44441A" }]}
            >
              <MaterialIcons name="report-problem" size={24} color="#ef4444" />
            </View>
            <Text style={[styles.reportLabel, { color: colors.text }]}>
              Report a Technical Issue
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
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
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  contactList: {
    gap: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 16,
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
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  contactSub: {
    fontSize: 12,
  },
  faqList: {
    gap: 12,
  },
  faqItem: {
    padding: 16,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    marginRight: 16,
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  reportLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
  },
});
