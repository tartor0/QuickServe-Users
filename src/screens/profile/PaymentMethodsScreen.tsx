import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const PaymentMethodsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Payment Methods Screen</Text>
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
