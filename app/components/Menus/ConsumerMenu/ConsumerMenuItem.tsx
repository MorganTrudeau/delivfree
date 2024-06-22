import { Text } from "app/components/Text";
import { $borderLight, $row } from "app/components/styles";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { localizeCurrency } from "app/utils/general";
import { MenuItem } from "delivfree/types";
import React, { useMemo } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import FastImage, { ImageStyle } from "react-native-fast-image";

interface Props {
  item: MenuItem;
  onPress: (item: MenuItem) => void;
}

export const ConsumerMenuItem = React.memo(function ConsumerMenuItem({
  item,
  onPress,
}: Props) {
  const imageSource = useMemo(() => ({ uri: item.image }), [item.image]);
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={[$borderLight, { borderWidth: 1 }, $container]}
    >
      <View style={{ padding: spacing.md, flex: 1 }}>
        <Text preset="semibold">{item.name}</Text>
        <Text>
          <Text>{localizeCurrency(Number(item.price), "CAD")}</Text>
          {item.energy.cals ? (
            <Text style={{ color: colors.textDim }}>
              {" "}
              • {item.energy.cals} Cal.
            </Text>
          ) : null}
          {item.energy.kj ? (
            <Text style={{ color: colors.textDim }}>
              {" "}
              • {item.energy.kj} Kj
            </Text>
          ) : null}
        </Text>
        {!!item.description && (
          <Text
            style={{ color: colors.textDim }}
            numberOfLines={2}
            ellipsizeMode="tail"
            size="xs"
          >
            {item.description}
          </Text>
        )}
      </View>
      <FastImage source={imageSource} style={$image} />
    </Pressable>
  );
});

const ITEM_HEIGHT = 150;

const $container: ViewStyle = {
  flexDirection: "row",
  borderRadius: borderRadius.lg,
  overflow: "hidden",
  flexBasis: "45%",
  flexGrow: 1,
  height: ITEM_HEIGHT,
  maxHeight: ITEM_HEIGHT,
};

const $image: ImageStyle = {
  height: ITEM_HEIGHT,
  aspectRatio: 1,
};
