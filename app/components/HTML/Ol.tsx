import React from "react";
import { View, StyleSheet } from "react-native";

export const Ol = ({ children }) => {
  return (
    <View style={styles.list}>
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, { index })
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    marginVertical: 10,
  },
});
