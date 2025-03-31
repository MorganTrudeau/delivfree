import { Text } from "app/components/Text";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { colors, spacing } from "app/theme";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import { ConsumerMenuItems } from "./ConsumerMenuItems";
import { EmptyList } from "app/components/EmptyList";
import { reorder } from "app/utils/general";

interface Props {
  menu: string;
  vendor: string;
  vendorLocation: string;
  vendorLocationClosed: boolean;
}

export const ConsumerMenuCategories = ({
  menu,
  vendor,
  vendorLocation,
  vendorLocationClosed,
}: Props) => {
  const { categories, categoriesLoaded, loadCategories } = useMenusLoading({
    menu,
  });

  useEffect(() => {
    loadCategories(false);
  }, [menu]);

  const orderedCategories = useMemo(
    () => reorder(categories, menu),
    [categories, menu]
  );

  return (
    <View>
      {!categoriesLoaded && <ActivityIndicator color={colors.primary} />}
      {categoriesLoaded && orderedCategories.length === 0 && (
        <EmptyList title={"No items available right now"} icon={"silverware"} />
      )}
      {orderedCategories.map((category) => {
        return (
          <View key={category.id}>
            <Text
              preset="subheading"
              style={{ marginBottom: spacing.sm, marginTop: spacing.md }}
            >
              {category.name}
            </Text>
            <ConsumerMenuItems
              category={category.id}
              vendor={vendor}
              vendorLocation={vendorLocation}
              vendorLocationClosed={vendorLocationClosed}
            />
          </View>
        );
      })}
    </View>
  );
};
