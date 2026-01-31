import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const SignupScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Signup Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
