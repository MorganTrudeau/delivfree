import React from "react";
import { View, StyleSheet } from "react-native";

export const Ul = ({ children }) => {
  return <View style={styles.list}>{children}</View>;
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
  },
});
