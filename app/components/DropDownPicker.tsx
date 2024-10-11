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
import { useDimensions } from "app/hooks/useDimensions";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
interface Item<V> {
  label: string;
  value: V;
}
interface Props<V> {
  items: Item<V>[];
  onSelect: (values: V[]) => void;
  selectedValues?: V[];
  placeholder?: string;
  singleSelect?: boolean;
  containerStyle?: ViewStyle;
}

export const DropDownPicker = <V extends any>({
  items,
  onSelect,
  selectedValues,
  placeholder = "Select",
  singleSelect,
  containerStyle,
}: Props<V>) => {
  const dropdown = useRef<View>(null);

  const { height } = useDimensions();

  const [{ open, top, left }, setDropdownState] = useState({
    open: false,
    top: 0,
    left: 0,
  });

  const openAnimation = useSharedValue(0);

  const closeDropdown = () => {
    setDropdownState((s) => ({ ...s, open: false }));
    openAnimation.value = withTiming(0);
  };
  const openDropdown = () => {
    dropdown.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownState({ left: pageX, top: pageY, open: true });
      openAnimation.value = withTiming(1);
    });
  };
  const toggleOpen = () => {
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  const buttonLabel = useMemo(
    () =>
      selectedValues?.length
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
    if (singleSelect) {
      onSelect([val]);
      closeDropdown();
    } else if (selectedValues?.includes(val)) {
      onSelect(selectedValues.filter((v) => v !== val));
    } else {
      onSelect([...(selectedValues || []), val]);
    }
  };

  const [layout, setLayout] =
    useState<LayoutChangeEvent["nativeEvent"]["layout"]>();
  const handleLayout = (e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  };

  return (
    <View style={containerStyle}>
      <Pressable
        ref={dropdown}
        onPress={toggleOpen}
        style={[$input, $row]}
        onLayout={handleLayout}
      >
        <Text
          style={{
            flex: 1,
            color: !selectedValues?.length ? colors.textDim : undefined,
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
              maxHeight: height / 3,
              position: "absolute",
              left,
            },
            top + (layout?.height || 0) > height / 2
              ? { bottom: height - top + spacing.xxs }
              : { top: top + (layout?.height || 0) + spacing.xxs },
          ]}
        >
          <ScrollView
            style={{ maxHeight: height / 3 }}
            showsVerticalScrollIndicator={false}
          >
            {!items.length ? (
              <View style={$pickerItem}>
                <Text style={$flex}>No items</Text>
              </View>
            ) : (
              items.map((item, index, arr) => (
                <Pressable
                  key={`${item.label} + ${index}`}
                  style={[
                    $pickerItem,
                    index !== arr.length - 1 && $borderBottom,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={$flex}>{item.label}</Text>
                  {selectedValues?.includes(item.value) && (
                    <Icon
                      icon={"check-circle"}
                      color={colors.primary}
                      size={sizing.md}
                    />
                  )}
                </Pressable>
              ))
            )}
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
  borderRadius: borderRadius.sm,
};
const $pickerItem: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  flexDirection: "row",
  alignItems: "center",
};
