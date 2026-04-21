import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { signupThunk, clearError } from "@/src/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const SignupScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Clear any previous auth errors when this screen mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSignup = async () => {
    setValidationError("");

    // Basic validation
    if (!name.trim()) return setValidationError("Please enter your full name.");
    if (!email.trim() || !email.includes("@"))
      return setValidationError("Please enter a valid email address.");
    if (!phone.trim())
      return setValidationError("Please enter your phone number.");
    if (password.length < 8)
      return setValidationError("Password must be at least 8 characters.");
    if (!agreeToTerms)
      return setValidationError("You must agree to the Terms & Conditions.");

    const result = await dispatch(
      signupThunk({ email: email.trim(), password, fullName: name.trim(), phone: phone.trim() })
    );

    if (signupThunk.fulfilled.match(result)) {
      // _layout.tsx auth listener handles the redirect automatically
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={20}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign up to get started with QuickServe
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={name}
              onChangeText={setName}
              icon={
                <MaterialIcons
                  name="person"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />

            <Input
              label="Email"
              placeholder="hello@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              icon={
                <MaterialIcons
                  name="email"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />

            <Input
              label="Phone Number"
              placeholder="+1 (555) 000-0000"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              icon={
                <MaterialIcons
                  name="phone"
                  size={20}
                  color={colors.textSecondary}
                />
              }
            />

            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              icon={
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={colors.textSecondary}
                />
              }
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              }
            />

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: agreeToTerms ? colors.primary : colors.border,
                    backgroundColor: agreeToTerms
                      ? colors.primary
                      : "transparent",
                  },
                ]}
              >
                {agreeToTerms && (
                  <MaterialIcons name="check" size={16} color="#fff" />
                )}
              </View>
              <Text
                style={[styles.checkboxText, { color: colors.textSecondary }]}
              >
                I agree to the{" "}
                <Text style={{ color: colors.primary, fontWeight: "600" }}>
                  Terms & Conditions
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Error messages — validation errors first, then API errors */}
            {(validationError || error) ? (
              <Text style={styles.errorText}>
                {validationError || error}
              </Text>
            ) : null}

            <Button
              title="Sign Up"
              onPress={handleSignup}
              size="lg"
              style={styles.signupBtn}
              loading={loading}
              disabled={loading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text style={[styles.loginText, { color: colors.primary }]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 14,
    flex: 1,
  },
  signupBtn: {
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#ef4444",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
