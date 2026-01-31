import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const SellerProfileScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Seller Profile Screen</Text>
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
