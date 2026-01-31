import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const SearchFiltersModal: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Search Filters Modal</Text>
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
