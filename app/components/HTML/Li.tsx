import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../Text";
import { $flexShrink } from "../styles";

const OlLi = ({ index, children }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.index}>{index + 1}.</Text>
      <Text style={$flexShrink}>{children}</Text>
    </View>
  );
};

const UlLi = ({ children }) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.bullet}>{"\u2022"}</Text>
      <Text style={$flexShrink}>{children}</Text>
    </View>
  );
};

export const Li = ({
  listType,
  children,
  index,
}: {
  listType: "ol" | "ul";
  children: React.ReactNode;
  index?: number;
}) => {
  if (listType === "ol") {
    return <OlLi index={index}>{children}</OlLi>;
  } else {
    return <UlLi>{children}</UlLi>;
  }
};

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  index: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 14,
  },
  bullet: {
    marginRight: 10,
  },
});
