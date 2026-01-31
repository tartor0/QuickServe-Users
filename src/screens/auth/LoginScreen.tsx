import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Button } from "@/src/components/common/Button";
import { Input } from "@/src/components/common/Input";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export const LoginScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back-ios" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to continue to QuickServe
          </Text>
        </View>

        <View style={styles.form}>
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
            label="Password"
            placeholder="••••••••"
            secureTextEntry
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
              <MaterialIcons
                name="visibility-off"
                size={20}
                color={colors.textSecondary}
              />
            }
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button
            title="Log In"
            onPress={() => router.replace("/(tabs)")}
            size="lg"
            style={styles.loginBtn}
          />
        </View>

        <View style={styles.dividerContainer}>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
            Or continue with
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
        </View>

        <View style={styles.socialRow}>
          <TouchableOpacity
            style={[
              styles.socialBtn,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/color/48/000000/google-logo.png",
              }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.socialBtn,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Image
              source={{
                uri: "https://img.icons8.com/ios-filled/50/000000/mac-os.png",
              }}
              style={[styles.socialIcon, { tintColor: colors.text }]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Don't have an account?{" "}
          </Text>
          <Link href="/auth/signup" asChild>
            <TouchableOpacity>
              <Text style={[styles.signupText, { color: colors.primary }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loginBtn: {
    marginTop: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 32,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: "500",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
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
  signupText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
