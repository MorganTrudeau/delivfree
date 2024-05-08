import { colors, spacing } from "app/theme";
import React, { useMemo, useRef, useState } from "react";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
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
  const dropdown = useRef<View>(null);

  const [{ open, top, left }, setDropdownState] = useState({
    open: false,
    top: 0,
    left: 0,
  });

  const openAnimation = useSharedValue(0);

  const toggleOpen = () => {
    if (open) {
      setDropdownState((s) => ({ ...s, open: false }));
      openAnimation.value = withTiming(0);
    } else {
      dropdown.current?.measure((x, y, width, height, pageX, pageY) => {
        console.log(x, y, width, height, pageX, pageY);
        setDropdownState({ left: pageX, top: pageY, open: true });
        openAnimation.value = withTiming(1);
      });
    }
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

  const backdropStyle = useAnimatedStyle(
    () => ({ opacity: openAnimation.value }),
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
        ref={dropdown}
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
        <AnimatedPressable
          style={[$backdrop, backdropStyle]}
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
              top: top + (layout?.height || 0) + spacing.sm,
              // @ts-ignore
              left: left,
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

const $backdrop: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: colors.palette.overlay20,
};
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
