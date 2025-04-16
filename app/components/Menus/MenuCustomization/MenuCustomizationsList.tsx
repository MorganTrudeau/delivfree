import React, { useCallback, useMemo } from "react";
import { MenuCustomization, MenuItem } from "delivfree";
import { TableHeader, TableHeaders } from "../../TableHeaders";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  Pressable,
} from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { $borderBottom, isLargeScreen } from "../../styles";
import { DataCell, TableCell } from "../../TableCell";
import { Text } from "../../Text";
import { EmptyList } from "../../EmptyList";
import { colors, spacing } from "app/theme";
import { pluralFormat } from "app/utils/general";

interface Props
  extends Omit<FlatListProps<MenuCustomization>, "data" | "renderItem"> {
  customizations: MenuCustomization[];
  items: MenuItem[];
  onPress?: (data: MenuCustomization) => void;
  loaded: boolean;
}

export const MenuCustomizationsList = ({
  customizations,
  onPress,
  loaded,
  ...rest
}: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const h: TableHeader[] = [
      { title: "Name" },
      { title: "Type" },
      { title: "Options" },
    ];
    return h;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MenuCustomization }) => {
      const optionsNumberText =
        item.type === "note"
          ? "-"
          : item.choices.length +
            " " +
            pluralFormat("Choice", item.choices.length);

      if (largeScreen) {
        const dataCells: DataCell[] = [
          { text: item.name },
          { text: item.type === "note" ? "Note" : "Choices" },
          {
            text: optionsNumberText,
          },
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
          <Text>{optionsNumberText}</Text>
        </Pressable>
      );
    },
    [largeScreen]
  );

  const renderEmpty = useCallback(() => {
    return loaded ? (
      <EmptyList title="No customizations" />
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
        data={customizations}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    </>
  );
};
