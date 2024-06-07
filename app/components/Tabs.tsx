import React, { useCallback } from "react";
import { $row } from "./styles";
import { Pressable, View } from "react-native";
import { Text } from "./Text";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing } from "app/theme";
import { typedMemo } from "app/utils/general";

export interface TabItem<K> {
  id: K;
  title: string;
}
interface Props<K> {
  tabs: TabItem<K>[];
  initialIndex?: number;
  onTabPress?: (tab: TabItem<K>) => void;
}

export const ListTabs = typedMemo(function ListTabs<K extends string>({
  tabs,
  initialIndex = 0,
  onTabPress,
}: Props<K>) {
  const activeIndexAnimation = useSharedValue(initialIndex);

  const handlePress = useCallback(
    (tab: TabItem<K>, index: number) => {
      activeIndexAnimation.value = index;
      onTabPress && onTabPress(tab);
    },
    [onTabPress]
  );

  return (
    <View>
      <View
        style={{
          height: 3,
          width: "100%",
          backgroundColor: colors.border,
          position: "absolute",
          bottom: 0,
        }}
      />
      <View style={$row}>
        {tabs.map((tab, index) => (
          <Tab
            tab={tab}
            index={index}
            key={tab.id}
            activeIndexAnimation={activeIndexAnimation}
            onPress={handlePress}
          />
        ))}
      </View>
    </View>
  );
});

const Tab = typedMemo(function Tab<K extends string>({
  tab,
  index,
  activeIndexAnimation,
  onPress,
}: {
  tab: TabItem<K>;
  index: number;
  activeIndexAnimation: SharedValue<number>;
  onPress: (tab: TabItem<K>, index: number) => void;
}) {
  console.log("RENDER");
  const animatedStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      bottom: 0,
      height: 3,
      opacity: withTiming(activeIndexAnimation.value === index ? 1 : 0),
      width: "100%",
      backgroundColor: colors.primary,
    }),
    [activeIndexAnimation, index]
  );

  return (
    <View style={{ overflow: "hidden" }}>
      <Pressable
        key={tab.id}
        onPress={() => onPress(tab, index)}
        style={{
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.md,
        }}
      >
        <Text>{tab.title}</Text>
      </Pressable>

      <Animated.View style={animatedStyle} />
    </View>
  );
});
