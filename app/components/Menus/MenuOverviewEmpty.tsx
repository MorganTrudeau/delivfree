import { spacing } from "app/theme";
import React, { useMemo } from "react";
import { Text } from "../Text";
import { View } from "react-native";
import { Button } from "../Button";
import { Icon } from "../Icon";

export const MenuOverviewEmpty = ({ onAddMenu }: { onAddMenu: () => void }) => {
  const PlusIcon = useMemo(
    () =>
      ({ style }) =>
        <Icon icon="plus" color={"#fff"} style={style} />,
    []
  );

  return (
    <View style={{ paddingVertical: spacing.md }}>
      <Text preset="subheading">Create your first menu</Text>
      <Button
        text="New menu"
        preset="reversed"
        style={{ maxWidth: 500, marginTop: spacing.sm }}
        LeftAccessory={PlusIcon}
        onPress={onAddMenu}
      />
    </View>
  );
};
