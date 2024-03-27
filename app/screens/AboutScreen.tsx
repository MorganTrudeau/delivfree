import React from "react";
import { ListItem, Screen, Text } from "app/components";
import { ViewStyle } from "react-native";
import { spacing } from "app/theme";
import {
  $borderBottom,
  $row,
  NO_TOP_BOTTOM_SAFE_AREA_EDGES,
} from "app/components/styles";
import appJson from "../../app.json";

export const AboutScreen = () => {
  return (
    <Screen
      preset="scroll"
      contentContainerStyle={$content}
      safeAreaEdges={NO_TOP_BOTTOM_SAFE_AREA_EDGES}
    >
      <ListItem
        text={"Version"}
        RightComponent={<Text weight="semiBold">{appJson.version}</Text>}
        style={[$borderBottom, $row]}
      />
      <ListItem
        text={"Build Number"}
        RightComponent={<Text weight="semiBold">{appJson.buildNumber}</Text>}
        style={[$borderBottom, $row]}
      />
    </Screen>
  );
};

const $content: ViewStyle = { paddingHorizontal: spacing.md };
