import React, { useCallback, useMemo } from "react";
import { Menu, MenuCategory } from "functions/src/types";
import { TableHeader, TableHeaders } from "../../TableHeaders";
import { ActivityIndicator, FlatList, Pressable } from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { $borderBottom, isLargeScreen } from "../../styles";
import { DataCell, TableCell } from "../../TableCell";
import { Text } from "../../Text";
import { EmptyList } from "../../EmptyList";
import { colors, spacing } from "app/theme";

interface Props {
  categories: MenuCategory[];
  menus: Menu[];
  onPress?: (category: MenuCategory) => void;
  loaded: boolean;
}

export const MenuCategoriesList = ({
  categories,
  menus,
  onPress,
  loaded,
}: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const h: TableHeader[] = [{ title: "Name" }, { title: "Menus" }];
    return h;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MenuCategory }) => {
      const menuNames =
        item.menus
          .map((menuId) => menus.find((m) => m.id === menuId)?.name)
          .filter((m) => m)
          .join(", ") || "-";

      if (largeScreen) {
        const dataCells: DataCell[] = [
          { text: item.name },
          { text: menuNames },
        ];
        return (
          <TableCell data={item} onPress={onPress} dataCells={dataCells} />
        );
      }

      return (
        <Pressable
          onPress={onPress ? () => onPress(item) : undefined}
          style={[{ paddingVertical: spacing.sm }, $borderBottom]}
        >
          <Text preset="subheading">{item.name}</Text>
          <Text>{menuNames}</Text>
        </Pressable>
      );
    },
    [largeScreen, menus]
  );

  const renderEmpty = useCallback(() => {
    return loaded ? (
      <EmptyList title="No categories" />
    ) : (
      <ActivityIndicator
        color={colors.primary}
        style={{ margin: spacing.md }}
      />
    );
  }, [loaded]);

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} />}
      <FlatList
        data={categories}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};
