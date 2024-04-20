import { colors, spacing } from "app/theme";
import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  ViewStyle,
  StyleSheet,
  LayoutChangeEvent,
  ScrollView,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { $borderBottom, $flex, $input, $row, $shadow } from "./styles";
import { Text } from "./Text";
import { Icon } from "./Icon";
import { sizing } from "app/theme/sizing";
import { Portal } from "react-native-portalize";
import { borderRadius } from "app/theme/borderRadius";

interface Item<V> {
  label: string;
  value: V;
}
interface Props<V> {
  items: Item<V>[];
  onSelect: (values: V[]) => void;
  selectedValues: V[];
  placeholder?: string;
}

export const DropDownPicker = <V extends string>({
  items,
  onSelect,
  selectedValues,
  placeholder = "Select",
}: Props<V>) => {
  const [open, setOpen] = useState(false);

  const openAnimation = useSharedValue(0);

  const toggleOpen = () => {
    setOpen(!open);
    openAnimation.value = withTiming(open ? 0 : 1);
  };

  const buttonLabel = useMemo(
    () =>
      selectedValues.length
        ? selectedValues
            .map((v) => items.find((i) => i.value === v)?.label)
            .join(", ")
        : placeholder,
    [items, selectedValues, placeholder]
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: openAnimation.value,
      transform: [
        { translateY: interpolate(openAnimation.value, [0, 1], [10, 0]) },
      ],
    }),
    [openAnimation]
  );

  const handleSelect = (val: V) => {
    if (selectedValues.includes(val)) {
      onSelect(selectedValues.filter((v) => v !== val));
    } else {
      onSelect([...selectedValues, val]);
    }
  };

  const [layout, setLayout] =
    useState<LayoutChangeEvent["nativeEvent"]["layout"]>();
  const handleLayout = (e: LayoutChangeEvent) => {
    console.log(e.nativeEvent.layout);
    setLayout(e.nativeEvent.layout);
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={toggleOpen}
        style={[$input, $row]}
        onLayout={handleLayout}
      >
        <Text
          style={{
            flex: 1,
            color: selectedValues.length === 0 ? colors.textDim : undefined,
          }}
        >
          {buttonLabel}
        </Text>
        <Icon icon={"chevron-down"} />
      </Pressable>
      <Portal>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={toggleOpen}
          pointerEvents={open ? "auto" : "none"}
        />
        <Animated.View
          pointerEvents={open ? "auto" : "none"}
          style={[
            $shadow,
            $picker,
            animatedStyle,
            {
              width: layout?.width,
              maxHeight: 200,
              position: "absolute",
              // @ts-ignore
              top: layout?.top + layout?.height + spacing.sm,
              // @ts-ignore
              left: layout?.left,
            },
          ]}
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {items.map((item, index, arr) => (
              <Pressable
                key={item.value}
                style={[$pickerItem, index !== arr.length - 1 && $borderBottom]}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={$flex}>{item.label}</Text>
                {selectedValues.includes(item.value) && (
                  <Icon
                    icon={"check-circle"}
                    color={colors.primary}
                    size={sizing.md}
                  />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>
      </Portal>
    </View>
  );
};

const $button: ViewStyle = {};
const $picker: ViewStyle = {
  backgroundColor: colors.background,
  borderRadius: borderRadius.md,
};
const $pickerItem: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
};
