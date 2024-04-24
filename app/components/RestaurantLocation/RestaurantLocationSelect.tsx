import { useAppSelector } from "app/redux/store";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RestaurantLocation } from "functions/src/types";
import { borderRadius } from "app/theme/borderRadius";
import { $shadow } from "../styles";
import { Portal } from "react-native-portalize";

interface Props {
  selectedLocationId: string;
  onSelect: (location: RestaurantLocation) => void;
  style?: ViewStyle;
}

export const RestaurantLocationSelect = ({
  selectedLocationId,
  onSelect,
  style,
}: Props) => {
  const restaurantLocations = useAppSelector(
    (state) => state.restaurantLocations.data
  );

  const buttonRef = useRef<View>(null);

  const [layout, setLayout] = useState<
    LayoutChangeEvent["nativeEvent"]["layout"] & { top: number; left: number }
  >();
  const onLayout = ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ ...layout, top: pageY, left: pageX });
    });
  };

  const openAnimation = useSharedValue(0);

  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    openAnimation.value = withTiming(open ? 0 : 1);
    setOpen(!open);
  };

  const restaurantLocationsList = useMemo(
    () => Object.values(restaurantLocations),
    [restaurantLocations]
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

  const handleMount = async () => {
    const lastSelected = await loadLastSelected();
    if (lastSelected && restaurantLocations[lastSelected]) {
      onSelect(restaurantLocations[lastSelected]);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  const selectedLocation = restaurantLocations[selectedLocationId];

  return (
    <View style={[{ zIndex: 999 }, style]}>
      <Pressable
        onPress={toggleOpen}
        style={$button}
        onLayout={onLayout}
        ref={buttonRef}
        collapsable={false}
      >
        {selectedLocation ? (
          <>
            <Text preset="semibold">{selectedLocation.name}</Text>
            <Text size={"xs"}>{selectedLocation.address}</Text>
          </>
        ) : (
          <Text>
            {restaurantLocationsList.length
              ? "Select a location"
              : "No locations"}
          </Text>
        )}
      </Pressable>
      {!!restaurantLocationsList.length && (
        <Portal>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={toggleOpen}
            pointerEvents={open ? "auto" : "none"}
          />
          <Animated.View
            style={[
              $shadow,
              $list,
              animatedStyle,
              {
                // @ts-ignore
                top: (layout?.top || 0) + (layout?.height || 0) + spacing.sm,
                // @ts-ignore
                left: layout?.left || 0,
              },
            ]}
            pointerEvents={open ? "auto" : "none"}
          >
            {restaurantLocationsList.map((restaurantLocation, index, arr) => {
              return (
                <Pressable
                  key={restaurantLocation.id}
                  style={[
                    $listItem,
                    index === arr.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => {
                    onSelect(restaurantLocation);
                    saveLastSelected(restaurantLocation.id);
                    toggleOpen();
                  }}
                >
                  <Text preset="semibold">{restaurantLocation.name}</Text>
                  <Text size={"xs"}>{restaurantLocation.address}</Text>
                </Pressable>
              );
            })}
          </Animated.View>
        </Portal>
      )}
    </View>
  );
};

const LAST_SELECTED_ASYNC_KEY = "LAST_SELECTED_RESTAURANT_LOCATION";

const loadLastSelected = async () => {
  try {
    return await AsyncStorage.getItem(LAST_SELECTED_ASYNC_KEY);
  } catch (error) {
    console.log("Failed to get last selected restaurant location", error);
    return null;
  }
};

const saveLastSelected = async (id: string) => {
  try {
    await AsyncStorage.setItem(LAST_SELECTED_ASYNC_KEY, id);
  } catch (error) {
    console.log("Failed to save last selected restaurant location", error);
  }
};

const $button: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderRadius: borderRadius.md,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
  backgroundColor: colors.surface,
};
const $list: ViewStyle = {
  padding: spacing.xxs,
  position: "absolute",
  backgroundColor: colors.background,
  borderRadius: borderRadius.md,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border,
};
const $listItem: ViewStyle = {
  paddingHorizontal: spacing.sm,
  paddingVertical: spacing.xs,
  borderBottomWidth: StyleSheet.hairlineWidth,
  borderBottomColor: colors.border,
};
