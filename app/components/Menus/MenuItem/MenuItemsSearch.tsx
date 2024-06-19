import { ButtonSmall } from "app/components/ButtonSmall";
import { Icon } from "app/components/Icon";
import { Text } from "app/components/Text";
import { TextInput } from "app/components/TextInput";
import { Toggle } from "app/components/Toggle";
import { $borderBottom, $flex, $row } from "app/components/styles";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { MenuCategory, MenuItem } from "delivfree/types";
import React, { useMemo, useState } from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";

interface Props {
  items: MenuItem[];
  categories: MenuCategory[];
  selectedItems: string[];
  onSelect: (items: string[]) => void;
}

export const MenuItemsSearch = ({
  items,
  categories,
  selectedItems,
  onSelect,
}: Props) => {
  const [category, setCategory] = useState<{
    category: null | MenuCategory;
    items: MenuItem[];
  }>();

  const categorizedItems = useMemo(() => {
    const categoryItemMap = items.reduce((acc, item) => {
      if (!item.categories.length) {
        acc.uncategorized = acc.uncategorized || {
          category: null,
          items: [],
        };
        acc.uncategorized.items.push(item);
      } else {
        item.categories.forEach((categoryId) => {
          const category = categories.find((c) => c.id === categoryId);
          if (category) {
            acc[category.id] = acc[category.id] || {
              category,
              items: [],
            };
            acc[category.id].items.push(item);
          }
        });
      }
      return acc;
    }, {} as { [categoryId: string]: { category: MenuCategory | null; items: MenuItem[] } });
    return Object.values(categoryItemMap).sort((a, b) => {
      if (a.category && b.category) {
        return a.category.name < b.category.name ? -1 : 1;
      } else if (a.category && !b.category) {
        return -1;
      } else if (b.category && !a.category) {
        return 1;
      } else {
        return 0;
      }
    });
  }, [items, categories]);

  const renderCategories = () => {
    return (
      <>
        {categorizedItems.map((c) => {
          const categoryId = c.category?.id || "uncategorized";
          const itemsSelected = c.items.filter((i) =>
            selectedItems.includes(i.id)
          ).length;
          return (
            <Pressable
              onPress={() => setCategory(c)}
              style={$category}
              key={categoryId}
            >
              <Text>{c.category ? c.category.name : "Uncategorized"}</Text>
              <Text style={{ color: colors.textDim }} size={"xs"}>
                {itemsSelected} Items selected
              </Text>
            </Pressable>
          );
        })}
      </>
    );
  };

  const renderCategoryItems = () => {
    if (!category) {
      return null;
    }

    const itemIds = category.items.map((item) => item.id);

    return (
      <>
        <View style={[$row, $borderBottom]}>
          <Pressable
            style={{
              padding: spacing.sm,
              paddingRight: spacing.md,
            }}
            onPress={() => setCategory(undefined)}
          >
            <Icon icon="arrow-left" />
          </Pressable>
          <View style={{ paddingVertical: spacing.xs, flex: 1 }}>
            <Text preset="semibold" size={"md"}>
              {category.category ? category.category.name : "Uncategorized"}
            </Text>
            <Text style={{ color: colors.textDim }} size="xs">
              Category ({category.items.length} Items)
            </Text>
          </View>
          <ButtonSmall
            preset="reversed"
            text={"Select all"}
            onPress={() => {
              onSelect([
                ...selectedItems.filter((id) => !itemIds.includes(id)),
                ...itemIds,
              ]);
            }}
          />
        </View>
        {category.items.map((item) => {
          const selected = selectedItems.includes(item.id);
          return (
            <Pressable
              style={[$category, $row]}
              key={item.id}
              onPress={() => {
                const filteredItems = selectedItems.filter(
                  (id) => id !== item.id
                );
                onSelect(
                  selected ? [...filteredItems] : [...filteredItems, item.id]
                );
              }}
            >
              <FastImage
                source={{ uri: item.image }}
                style={{
                  height: 50,
                  aspectRatio: 1,
                  marginRight: spacing.sm,
                  borderRadius: borderRadius.sm,
                }}
              />
              <Text style={$flex}>{item.name}</Text>
              <Toggle value={selected} />
            </Pressable>
          );
        })}
      </>
    );
  };

  return (
    <View>
      {!category && renderCategories()}
      {!!category && renderCategoryItems()}
    </View>
  );
};

const $searchInput: ViewStyle = { marginBottom: spacing.sm };

const $category: StyleProp<ViewStyle> = [
  {
    paddingVertical: spacing.sm,
  },
  $borderBottom,
];
