import React, { useCallback, useState } from "react";
import { MenuCategory, MenuItem } from "functions/src/types";
import DraggableFlatList, {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { colors, spacing } from "app/theme";
import { $borderBottom, $flex, $row } from "../styles";
import { TextInput } from "../TextInput";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { borderRadius } from "app/theme/borderRadius";

interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
}
interface Props {
  menu: string;
  sections: MenuSection[];
  onCategoryOrderChange: (menu: string, order: string[]) => void;
  onItemOrderChange: (category: string, order: string[]) => void;
}

export const MenuSortableList = React.memo(function MenuSortableList({
  menu,
  sections,
  onCategoryOrderChange,
  onItemOrderChange,
}: Props) {
  const renderCategory = useCallback(
    ({ item, drag, isActive }: RenderItemParams<MenuSection>) => {
      return (
        <DropdownSection
          section={item}
          drag={drag}
          onItemOrderChange={(order, section) => {
            onItemOrderChange(item.category.id, order);
          }}
        />
      );
    },
    []
  );

  const keyExtractor = useCallback((item: MenuSection) => item.category.id, []);

  const handleDragEnd = useCallback(
    ({ data }: { data: MenuSection[] }) => {
      onCategoryOrderChange(
        menu,
        data.map((d) => d.category.id)
      );
    },
    [menu]
  );

  return (
    <NestableScrollContainer>
      <DraggableFlatList
        keyExtractor={keyExtractor}
        data={sections}
        renderItem={renderCategory}
        activationDistance={1}
        onDragEnd={handleDragEnd}
      />
    </NestableScrollContainer>
  );
});

const SectionHeader = ({
  section,
  drag,
  onToggleOpen,
  openAnimation,
}: {
  section: MenuSection;
  drag: () => void;
  onToggleOpen: () => void;
  openAnimation: SharedValue<number>;
}) => {
  const chevronWrapperStyle = useAnimatedStyle(
    () => ({
      transform: [
        { rotate: `${interpolate(openAnimation.value, [0, 1], [0, 180])}deg` },
      ],
    }),
    [openAnimation]
  );
  return (
    <Pressable style={$itemOuter} onPressIn={drag}>
      <Icon icon={"drag-vertical"} />
      <View style={$itemInner}>
        <View style={$flex}>
          <Text preset="semibold">{section.category.name}</Text>
          <Text size={"xs"} style={[$flex, { color: colors.textDim }]}>
            {section.items.length} item{section.items.length === 1 ? "" : "s"}
          </Text>
        </View>
        <Animated.View style={chevronWrapperStyle}>
          <Icon icon="chevron-down" onPress={onToggleOpen} hitSlop={30} />
        </Animated.View>
      </View>
    </Pressable>
  );
};

const DropdownSection = React.memo(function DropdownSection({
  section,
  drag,
  onItemOrderChange,
}: {
  section: MenuSection;
  drag: () => void;
  onItemOrderChange: (order: string[], section: MenuSection) => void;
}) {
  const [open, setOpen] = useState(true);
  const openAnimation = useSharedValue(1);

  const toggleClosed = () => {
    if (!open) {
      return;
    }
    openAnimation.value = withTiming(
      0,
      {
        duration: 100,
      },
      () => {
        setOpen(false);
      }
    );
  };
  const toggleOpen = () => {
    if (open) {
      return;
    }
    openAnimation.value = withTiming(
      1,
      {
        duration: 100,
      },
      () => {
        setOpen(true);
      }
    );
  };
  const toggleSection = () => {
    open ? toggleClosed() : toggleOpen();
    openAnimation.value = withTiming(openAnimation.value ? 0 : 1, {
      duration: 100,
    });
  };

  const dropdownAnimatedStyle = useAnimatedStyle(
    () => ({
      overflow: "hidden",
      height: interpolate(
        openAnimation.value,
        [0, 1],
        [0, section.items.length * ITEM_HEIGHT]
      ),
    }),
    [openAnimation]
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<MenuItem>) => {
      return <Item item={item} drag={drag} />;
    },
    []
  );

  const keyExtractorItem = useCallback((item: MenuItem) => item.id, []);

  const handleDragEnd = useCallback(({ data }) => {
    onItemOrderChange(
      data.map((d) => d.id),
      { category: section.category, items: data }
    );
  }, []);

  return (
    <>
      <SectionHeader
        section={section}
        drag={drag}
        onToggleOpen={toggleSection}
        openAnimation={openAnimation}
      />
      <Animated.View style={dropdownAnimatedStyle}>
        <NestableDraggableFlatList
          keyExtractor={keyExtractorItem}
          data={section.items}
          renderItem={renderItem}
          activationDistance={1}
          onDragEnd={handleDragEnd}
        />
      </Animated.View>
    </>
  );
});

const Item = ({ item, drag }: { item: MenuItem; drag: () => void }) => {
  return (
    <Pressable style={$itemOuter} onPressIn={drag}>
      <Icon icon={"drag-vertical"} />
      <View style={$itemInner}>
        <FastImage source={{ uri: item.image }} style={$itemImage} />
        <Text preset="semibold" style={$flex}>
          {item.name}
        </Text>
        <TextInput value={item.price} />
      </View>
    </Pressable>
  );
};

const ITEM_HEIGHT = 70;
const ITEM_IMAGE_SIZE = ITEM_HEIGHT - spacing.xs * 2;
const $itemOuter: StyleProp<ViewStyle> = [
  { backgroundColor: colors.background },
  $row,
];
const $itemInner: StyleProp<ViewStyle> = [
  $borderBottom,
  {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    paddingRight: spacing.sm,
    marginLeft: spacing.xs,
    flex: 1,
  },
  $row,
];
const $itemImage: ImageStyle = {
  height: ITEM_IMAGE_SIZE,
  width: ITEM_IMAGE_SIZE,
  borderRadius: borderRadius.sm,
  backgroundColor: colors.borderLight,
  marginRight: spacing.sm,
};
