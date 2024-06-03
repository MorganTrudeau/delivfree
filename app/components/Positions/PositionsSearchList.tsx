import { Positions, VendorLocation } from "delivfree";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, FlatListProps, View } from "react-native";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import FastImage from "react-native-fast-image";
import { $flex, $image, $imageContainer, $shadow } from "../styles";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { fetchVendorLocation } from "app/apis/vendorLocations";
import { ButtonSmall } from "../ButtonSmall";
import { borderRadius } from "app/theme/borderRadius";
import { EmptyList } from "../EmptyList";
import { useDimensions } from "app/hooks/useDimensions";
import { Icon } from "../Icon";

type Props = {
  positions: Positions[];
  onApply: (positions: Positions, vendorLocation: VendorLocation) => void;
  licenses: string[] | undefined;
} & Partial<FlatListProps<Positions>>;

export const PositionsSearchList = ({
  positions,
  onApply,
  licenses,
  ...rest
}: Props) => {
  const { width } = useDimensions();

  const numColums = Math.min(3, Math.floor(width / (300 + spacing.sm * 2)));

  const renderItem = useCallback(
    ({ item }: { item: Positions }) => {
      const applied = !!licenses?.find((id) => item.licenses?.includes(id));
      return (
        <PositionsItem positions={item} onApply={onApply} applied={applied} />
      );
    },
    [licenses]
  );

  const renderEmpty = useCallback(
    () => <EmptyList title="No positions to show" />,
    []
  );

  return (
    <FlatList
      extraData={licenses}
      key={`positions-search-list-${numColums}`}
      data={positions}
      renderItem={renderItem}
      ListEmptyComponent={renderEmpty}
      showsVerticalScrollIndicator={false}
      {...rest}
      numColumns={numColums}
    />
  );
};

const PositionsItem = ({
  positions,
  onApply,
  applied,
}: {
  positions: Positions;
  onApply: (positions: Positions, vendorLocation: VendorLocation) => void;
  applied: boolean;
}) => {
  const [vendorLocation, setVendorLocation] = useState<VendorLocation>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchVendorLocation(positions.vendorLocation);
        setVendorLocation(data);
      } catch (error) {
        console.log("Failed to load vendor location", error);
      }
    };
    load();
  }, []);

  const availableFullTime = positions.maxFullTime - positions.filledFullTime;
  const availablePartTime = positions.maxPartTime - positions.filledPartTime;

  const AppliedCheck = useMemo(
    () =>
      applied
        ? ({ style }) => (
            <Icon icon={"check-circle"} color={colors.primary} style={style} />
          )
        : undefined,
    [applied]
  );

  return (
    <View
      style={[
        {
          padding: spacing.md,
          flex: 1,
          // maxWidth: 400,
          backgroundColor: colors.background,
          borderRadius: borderRadius.md,
          marginHorizontal: spacing.sm,
          marginBottom: spacing.lg,
        },
        $shadow,
      ]}
    >
      <View style={[{ marginBottom: spacing.xs }]}>
        <LoadingPlaceholder style={[$imageContainer]} loading={!vendorLocation}>
          <FastImage style={$image} source={{ uri: vendorLocation?.image }} />
        </LoadingPlaceholder>
        <LoadingPlaceholder
          height={25}
          width={100}
          loading={!vendorLocation}
          style={{ flex: 1, marginTop: spacing.xs }}
        >
          <Text preset={"subheading"} numberOfLines={2} ellipsizeMode="tail">
            {vendorLocation?.name}
          </Text>
        </LoadingPlaceholder>
        <LoadingPlaceholder height={25} width={200} loading={!vendorLocation}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            size={"xs"}
            style={{ color: colors.textDim }}
          >
            {vendorLocation?.address}
          </Text>
        </LoadingPlaceholder>
      </View>

      <View style={$flex}>
        {!!availableFullTime && (
          <Text size={"md"}>
            <Text preset="semibold" size={"md"}>
              {availableFullTime}
            </Text>{" "}
            Full time positions
          </Text>
        )}
        {!!availablePartTime && (
          <Text size={"md"}>
            <Text preset="semibold" size={"md"}>
              {availablePartTime}
            </Text>{" "}
            Part time positions
          </Text>
        )}
      </View>

      <ButtonSmall
        text={applied ? "Applied" : "Apply now"}
        style={{ marginTop: spacing.sm }}
        disabled={applied}
        onPress={() => vendorLocation && onApply(positions, vendorLocation)}
        RightAccessory={AppliedCheck}
      />
    </View>
  );
};
