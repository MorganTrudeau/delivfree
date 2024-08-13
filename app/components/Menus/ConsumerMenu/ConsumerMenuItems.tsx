import { $row } from "app/components/styles";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { colors, spacing } from "app/theme";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ConsumerMenuItem } from "./ConsumerMenuItem";
import { MenuItem } from "delivfree";
import { ConsumerItemSelectModal } from "./ConsumerItemSelect";
import { ModalRef } from "app/utils/types";
import { useDimensions } from "app/hooks/useDimensions";
import { BottomSheetRef } from "app/components/Modal/BottomSheet";

interface Props {
  category: string;
  vendor: string;
  vendorLocation: string;
  vendorLocationClosed: boolean;
}

export const ConsumerMenuItems = ({
  category,
  vendor,
  vendorLocation,
  vendorLocationClosed,
}: Props) => {
  const itemSelectModal = useRef<BottomSheetRef>(null);

  const { width } = useDimensions();

  const { items, itemsLoaded, loadItems } = useMenusLoading({ category });

  useEffect(() => {
    loadItems(false);
  }, [category]);

  const [selectedItem, setSelectedItem] = useState<MenuItem>();

  const handleItemPress = useCallback(
    (item: MenuItem) => {
      if (vendorLocationClosed) {
        return;
      }
      setSelectedItem(item);
      itemSelectModal.current?.snapToIndex(0);
    },
    [vendorLocationClosed]
  );

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
        vendor={vendor}
        vendorLocation={vendorLocation}
        onDismiss={() => {
          setSelectedItem(undefined);
        }}
      />
    </View>
  );
};
