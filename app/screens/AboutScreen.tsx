import React from "react";
import { ListItem, Screen, Text } from "app/components";
import { ViewStyle } from "react-native";
import { spacing } from "app/theme";
import {
  $borderBottom,
  $containerPadding,
  $row,
  $screen,
  NO_TOP_BOTTOM_SAFE_AREA_EDGES,
} from "app/components/styles";
import appJson from "../../app.json";
import { getAppType } from "app/utils/general";
import { Drawer } from "app/components/Drawer";
import { AppStackScreenProps } from "app/navigators";
import { ScreenHeader } from "app/components/ScreenHeader";

interface Props extends AppStackScreenProps<"About"> {}

export const AboutScreen = ({ navigation }: Props) => {
  return (
    <Drawer navigation={navigation}>
      <Screen
        preset="scroll"
        style={$screen}
        contentContainerStyle={$containerPadding}
        safeAreaEdges={NO_TOP_BOTTOM_SAFE_AREA_EDGES}
        inDrawer
      >
        <ScreenHeader title="About" />
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
        <ListItem
          text={"Env"}
          RightComponent={<Text weight="semiBold">{getAppType()}</Text>}
          style={[$borderBottom, $row]}
        />
      </Screen>
    </Drawer>
  );
};

const $content: ViewStyle = { paddingHorizontal: spacing.md };
