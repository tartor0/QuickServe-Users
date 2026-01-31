import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const MapExploreScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Map Explore Screen</Text>
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
