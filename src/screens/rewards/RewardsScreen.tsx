import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const RewardsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Rewards Screen</Text>
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
