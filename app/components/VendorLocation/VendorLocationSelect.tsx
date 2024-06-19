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
import { VendorLocation } from "delivfree";
import { borderRadius } from "app/theme/borderRadius";
import { $shadow } from "../styles";
import { Portal } from "react-native-portalize";
import { useDimensions } from "app/hooks/useDimensions";

interface Props {
  selectedLocationId: string;
  onSelect: (location: VendorLocation) => void;
  style?: ViewStyle;
}

export const VendorLocationSelect = ({
  selectedLocationId,
  onSelect,
  style,
}: Props) => {
  const { width } = useDimensions();

  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const vendorLocationsList = useMemo(
    () => Object.values(vendorLocations),
    [vendorLocations]
  );

  const buttonRef = useRef<View>(null);

  const [layout, setLayout] =
    useState<LayoutChangeEvent["nativeEvent"]["layout"]>();
  const handleLayout = (e: LayoutChangeEvent) => {
    setLayout(e.nativeEvent.layout);
  };

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
    buttonRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setDropdownState({ left: pageX, top: pageY, open: true });
      openAnimation.value = withTiming(1);
    });
  };
  const toggleOpen = () => {
    if (!vendorLocationsList.length && !open) {
      return;
    }
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

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
    if (vendorLocationsList.length === 1) {
      return onSelect(vendorLocationsList[0]);
    }
    const lastSelected = await loadLastSelected();
    if (lastSelected && vendorLocations[lastSelected]) {
      onSelect(vendorLocations[lastSelected]);
    }
  };

  const hasLocations = vendorLocationsList.length > 0;

  useEffect(() => {
    if (hasLocations) {
      handleMount();
    }
  }, [hasLocations]);

  const selectedLocation = vendorLocations[selectedLocationId];

  return (
    <View style={[{ zIndex: 999 }, style]}>
      <Pressable
        onPress={toggleOpen}
        style={$button}
        ref={buttonRef}
        onLayout={handleLayout}
        collapsable={false}
      >
        {selectedLocation ? (
          <>
            <Text preset="semibold">{selectedLocation.name}</Text>
            <Text size={"xs"}>{selectedLocation.address}</Text>
          </>
        ) : (
          <Text>
            {vendorLocationsList.length ? "Select a location" : "No locations"}
          </Text>
        )}
      </Pressable>
      {!!vendorLocationsList.length && (
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
                top: top + (layout?.height || 0) + spacing.sm,
                left,
                maxWidth: width - spacing.md * 2,
              },
            ]}
            pointerEvents={open ? "auto" : "none"}
          >
            {vendorLocationsList.map((vendorLocation, index, arr) => {
              return (
                <Pressable
                  key={vendorLocation.id}
                  style={[
                    $listItem,
                    index === arr.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => {
                    onSelect(vendorLocation);
                    saveLastSelected(vendorLocation.id);
                    toggleOpen();
                  }}
                >
                  <Text preset="semibold">{vendorLocation.name}</Text>
                  <Text size={"xs"}>{vendorLocation.address}</Text>
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
