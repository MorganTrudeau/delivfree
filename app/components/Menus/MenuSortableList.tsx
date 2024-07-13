import React, { useCallback, useState } from "react";
import { MenuCategory, MenuItem } from "delivfree";
import DraggableFlatList, {
  NestableDraggableFlatList,
  NestableScrollContainer,
  RenderItemParams,
  ScaleDecorator,
  ShadowDecorator,
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
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import FastImage, { ImageStyle } from "react-native-fast-image";
import { borderRadius } from "app/theme/borderRadius";
import { ButtonSmall } from "../ButtonSmall";
import { sizing } from "app/theme/sizing";
import { useOnChange } from "app/hooks";

interface MenuSection {
  category: MenuCategory;
  items: MenuItem[];
}
interface Props {
  menu: string;
  sections: MenuSection[];
  onCategoryOrderChange: (menu: string, order: string[]) => void;
  onItemOrderChange: (category: string, order: string[]) => void;
  addItem: (category: string) => void;
  addCategory: (menu: string) => void;
}

export const MenuSortableList = React.memo(function MenuSortableList({
  menu,
  sections,
  onCategoryOrderChange,
  onItemOrderChange,
  addItem,
  addCategory,
}: Props) {
  const [layoutKey, setLayoutKey] = useState(Math.random().toString());

  const renderCategory = useCallback(
    ({ item, drag, isActive }: RenderItemParams<MenuSection>) => {
      return (
        <DropdownSection
          section={item}
          drag={drag}
          onItemOrderChange={onItemOrderChange}
          addItem={addItem}
          onExandedChange={() => setLayoutKey(Math.random().toString())}
          isActive={isActive}
        />
      );
    },
    [addItem, onItemOrderChange]
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

  const renderAddCategory = useCallback(() => {
    return (
      <View style={$categoryFooterInner}>
        <ButtonSmall
          text="New category"
          leftIcon="plus"
          onPress={() => addCategory(menu)}
        />
      </View>
    );
  }, [addCategory, menu]);

  return (
    <NestableScrollContainer>
      {renderAddCategory()}
      <DraggableFlatList
        keyExtractor={keyExtractor}
        data={sections}
        renderItem={renderCategory}
        activationDistance={1}
        onDragEnd={handleDragEnd}
        layoutKey={layoutKey}
        // dragItemOverflow={true}
      />
    </NestableScrollContainer>
  );
});

const SectionHeader = ({
  section,
  drag,
  onToggleOpen,
  openAnimation,
  expanded,
}: {
  section: MenuSection;
  drag: () => void;
  onToggleOpen: () => void;
  openAnimation: SharedValue<number>;
  expanded: boolean;
}) => {
  const activeAnimation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(
    () => ({
      borderBottomColor: interpolateColor(
        activeAnimation.value,
        [0, 1],
        [colors.border, "transparent"],
        "HSV"
      ),
    }),
    [activeAnimation]
  );
  const onPressIn = useCallback(() => {
    if (!expanded) {
      activeAnimation.value = withTiming(1, { duration: 100 });
    }
    drag();
  }, [drag, expanded]);
  const onPressOut = useCallback(() => {
    activeAnimation.value = withTiming(0);
  }, []);
  const chevronWrapperStyle = useAnimatedStyle(
    () => ({
      transform: [
        { rotate: `${interpolate(openAnimation.value, [0, 1], [0, 180])}deg` },
      ],
    }),
    [openAnimation]
  );
  return (
    <Pressable style={$itemOuter} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Icon icon={"drag-vertical"} />
      <Animated.View style={[$itemInner, animatedStyle]}>
        <View style={$flex}>
          <Text preset="semibold">{section.category.name}</Text>
          <Text size={"xs"} style={[$flex, { color: colors.textDim }]}>
            {section.items.length} item{section.items.length === 1 ? "" : "s"}
          </Text>
        </View>
        <Animated.View style={chevronWrapperStyle}>
          <Icon icon="chevron-down" onPress={onToggleOpen} hitSlop={30} />
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const DropdownSection = React.memo(function DropdownSection({
  section,
  drag,
  onItemOrderChange,
  addItem,
  onExandedChange,
  isActive,
}: {
  section: MenuSection;
  drag: () => void;
  onItemOrderChange: (category: string, order: string[]) => void;
  addItem: (category: string) => void;
  onExandedChange: (expanded: boolean) => void;
  isActive: boolean;
}) {
  const categoryId = section.category.id;

  const [open, setOpen] = useState(true);
  const openAnimation = useSharedValue(1);

  const toggleClosed = () => {
    if (!open) {
      return;
    }
    setOpen(false);
    openAnimation.value = withTiming(0, {
      duration: 100,
    });
    setTimeout(() => onExandedChange(false), 150);
  };
  const toggleOpen = () => {
    if (open) {
      return;
    }
    setOpen(true);
    openAnimation.value = withTiming(1, {
      duration: 100,
    });
    setTimeout(() => onExandedChange(true), 150);
  };
  const toggleSection = () => {
    open ? toggleClosed() : toggleOpen();
    openAnimation.value = withTiming(openAnimation.value ? 0 : 1, {
      duration: 100,
    });
  };

  const maxHeight = (section.items.length + 1) * ITEM_HEIGHT;
  const dropdownAnimatedStyle = useAnimatedStyle(
    () => ({
      overflow: "hidden",
      height: interpolate(openAnimation.value, [0, 1], [0, maxHeight]),
    }),
    [openAnimation, maxHeight]
  );

  const renderItem = useCallback(
    ({ item, drag, isActive }: RenderItemParams<MenuItem>) => {
      return <Item item={item} drag={drag} isActive={isActive} />;
    },
    []
  );

  const keyExtractorItem = useCallback((item: MenuItem) => item.id, []);

  const handleDragEnd = useCallback(
    ({ data }) => {
      onItemOrderChange(
        categoryId,
        data.map((d) => d.id)
      );
    },
    [categoryId]
  );

  const renderFooter = useCallback(() => {
    return (
      <View style={$itemOuter}>
        <View style={{ width: sizing.lg }} />
        <View style={$itemsFooterInner}>
          <ButtonSmall
            text="New item"
            leftIcon="plus"
            onPress={() => addItem(categoryId)}
          />
        </View>
      </View>
    );
  }, [addItem, categoryId]);

  return (
    <ShadowDecorator>
      <View collapsable={false}>
        <SectionHeader
          section={section}
          drag={drag}
          onToggleOpen={toggleSection}
          openAnimation={openAnimation}
          expanded={open}
        />
        <Animated.View style={dropdownAnimatedStyle}>
          <NestableDraggableFlatList
            keyExtractor={keyExtractorItem}
            data={section.items}
            renderItem={renderItem}
            activationDistance={1}
            onDragEnd={handleDragEnd}
            ListFooterComponent={renderFooter}
            scrollEnabled={false}
          />
        </Animated.View>
      </View>
    </ShadowDecorator>
  );
});

const Item = React.memo(function Item({
  item,
  drag,
  isActive,
}: {
  item: MenuItem;
  drag: () => void;
  isActive: boolean;
}) {
  const activeAnimation = useSharedValue(isActive ? 1 : 0);
  const animatedStyle = useAnimatedStyle(
    () => ({
      borderBottomColor: interpolateColor(
        activeAnimation.value,
        [0, 1],
        [colors.border, "transparent"],
        "HSV"
      ),
    }),
    [isActive]
  );
  const onPressIn = useCallback(() => {
    activeAnimation.value = withTiming(1, { duration: 100 });
    drag();
  }, []);
  const onPressOut = useCallback(() => {
    activeAnimation.value = withTiming(0);
  }, []);
  return (
    <ShadowDecorator>
      <Pressable
        style={$itemOuter}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        <Icon icon={"drag-vertical"} />
        <Animated.View style={[$itemInner, animatedStyle]}>
          <FastImage source={{ uri: item.image }} style={$itemImage} />
          <Text preset="semibold" style={$flex}>
            {item.name}
          </Text>
          <TextInput value={item.price} />
        </Animated.View>
      </Pressable>
    </ShadowDecorator>
  );
});

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
  justifyContent: "center",
  alignItems: "center",
};

const $itemsFooterInner: StyleProp<ViewStyle> = {
  height: ITEM_HEIGHT,
  justifyContent: "center",
  alignItems: "flex-start",
  marginLeft: spacing.xs,
};

const $categoryFooterInner: StyleProp<ViewStyle> = {
  height: ITEM_HEIGHT,
  justifyContent: "center",
  alignItems: "flex-start",
};
