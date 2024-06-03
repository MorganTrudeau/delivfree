import React, { forwardRef } from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "./Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import {
  PopoverButton,
  Props as PopoverProps,
  PopoverRef,
} from "./Popover/PopoverButton";
import { $row } from "./styles";
import { Icon } from "./Icon";
import { sizing } from "app/theme/sizing";

type Props = { filter: string; value: string; style?: ViewStyle } & Omit<
  PopoverProps,
  "children"
>;

export const Filter = forwardRef<PopoverRef, Props>(
  ({ filter, value, renderPopover, position, style }, ref) => {
    return (
      <PopoverButton
        ref={ref}
        renderPopover={renderPopover}
        position={position}
      >
        <View
          style={[
            $row,
            {
              borderRadius: borderRadius.md,
              borderWidth: 1,
              borderColor: colors.border,
              alignSelf: "flex-start",
            },
            style,
          ]}
        >
          <View
            style={[
              $row,
              {
                paddingHorizontal: spacing.xs,
                paddingVertical: spacing.xxs,
              },
            ]}
          >
            <Icon
              icon="filter-variant"
              style={{ marginRight: spacing.xxs }}
              size={sizing.sm}
            />
            <Text size={"xs"}>{filter}</Text>
          </View>
          {!!value && (
            <View
              style={{
                paddingHorizontal: spacing.xs,
                paddingVertical: spacing.xxs,
                borderLeftWidth: 1,
                borderLeftColor: colors.border,
              }}
            >
              <Text size={"xs"} style={{ color: colors.primary }}>
                {value}
              </Text>
            </View>
          )}
        </View>
      </PopoverButton>
    );
  }
);
