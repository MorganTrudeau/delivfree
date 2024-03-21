import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { TabScreenProps } from "app/navigators/TabNavigator";
import React, { FC } from "react";
import { HORIZONTAL_SAFE_AREA_EDGES } from "app/components/styles";

export const HomeScreen: FC<TabScreenProps<"Home">> = (props) => {
  return (
    <Drawer navigation={props.navigation}>
      <Screen
        preset={"scroll"}
        safeAreaEdges={HORIZONTAL_SAFE_AREA_EDGES}
        inDrawer
      ></Screen>
    </Drawer>
  );
};
