import { $row } from "app/components/styles";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { colors, spacing } from "app/theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ConsumerMenuItem } from "./ConsumerMenuItem";
import { MenuItem } from "delivfree/types";
import { ConsumerItemSelectModal } from "./ConsumerItemSelect";
import { ModalRef } from "app/components/Modal/CenterModal";
import { useDimensions } from "app/hooks/useDimensions";

interface Props {
  category: string;
}

export const ConsumerMenuItems = ({ category }: Props) => {
  const itemSelectModal = useRef<ModalRef>(null);

  const { width } = useDimensions();

  const { items, itemsLoaded, loadItems } = useMenusLoading({ category });

  useEffect(() => {
    loadItems(false);
  }, [category]);

  const [selectedItem, setSelectedItem] = useState<MenuItem>();

  const handleItemPress = useCallback((item: MenuItem) => {
    setSelectedItem(item);
    itemSelectModal.current?.open();
  }, []);

  return (
    <View>
      {!itemsLoaded && <ActivityIndicator color={colors.primary} />}
      <View
        style={[
          width > 750 ? $row : undefined,
          { flexWrap: "wrap", rowGap: spacing.md, columnGap: spacing.md },
        ]}
      >
        {items.map((item) => {
          return (
            <ConsumerMenuItem
              key={item.id}
              item={item}
              onPress={handleItemPress}
            />
          );
        })}
      </View>
      <ConsumerItemSelectModal
        ref={itemSelectModal}
        item={selectedItem}
        onClose={() => itemSelectModal.current?.close()}
      />
    </View>
  );
};
