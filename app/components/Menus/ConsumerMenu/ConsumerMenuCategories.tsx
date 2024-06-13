import { Text } from "app/components/Text";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { colors, spacing } from "app/theme";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { ConsumerMenuItems } from "./ConsumerMenuItems";

interface Props {
  menu: string;
}

export const ConsumerMenuCategories = ({ menu }: Props) => {
  const { categories, categoriesLoaded, loadCategories } = useMenusLoading({
    menu,
  });

  useEffect(() => {
    loadCategories(false);
  }, [menu]);

  const orderedCategories = useMemo(
    () => categories.sort((a, b) => a.order[menu] - b.order[menu]),
    [categories]
  );

  return (
    <View>
      {!categoriesLoaded && <ActivityIndicator color={colors.primary} />}
      {orderedCategories.map((category) => {
        return (
          <View key={category.id}>
            <Text
              preset="subheading"
              style={{ marginBottom: spacing.sm, marginTop: spacing.md }}
            >
              {category.name}
            </Text>
            <ConsumerMenuItems category={category.id} />
          </View>
        );
      })}
    </View>
  );
};
