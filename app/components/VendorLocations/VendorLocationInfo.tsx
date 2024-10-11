import React, { useEffect, useState } from "react";
import { View, ViewStyle } from "react-native";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { VendorLocation } from "delivfree";
import { fetchVendorLocation } from "app/apis/vendorLocations";
import { $image, $imageContainer, $row } from "../styles";
import { borderRadius } from "app/theme/borderRadius";
import FastImage from "react-native-fast-image";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";

export const VendorLocationInfo = ({
  vendorLocationId,
  style,
  onVendorLocationLoaded,
}: {
  vendorLocationId?: string;
  style?: ViewStyle;
  onVendorLocationLoaded?: () => void;
}) => {
  const [vendorLocation, setVendorLocation] = useState<VendorLocation>();

  useEffect(() => {
    if (vendorLocationId) {
      const loadVendorLocation = async () => {
        try {
          const data = await fetchVendorLocation(vendorLocationId);
          if (data) {
            setVendorLocation(data);
            onVendorLocationLoaded && onVendorLocationLoaded();
          }
        } catch (error) {
          console.log(error);
        }
      };
      loadVendorLocation();
    }
  }, [vendorLocationId]);

  return (
    <View style={[$row, style]}>
      <LoadingPlaceholder
        loading={!vendorLocation}
        style={[$imageContainer, { width: 150, borderRadius: borderRadius.sm }]}
        disableAutoHeight
      >
        <FastImage
          style={[$image, { borderRadius: borderRadius.sm }]}
          source={{ uri: vendorLocation?.image }}
        />
      </LoadingPlaceholder>

      <View style={{ marginLeft: spacing.sm, flex: 1 }}>
        <LoadingPlaceholder loading={!vendorLocation} height={18} width={125}>
          <Text preset="semibold" numberOfLines={2} ellipsizeMode="tail">
            {vendorLocation?.name}
          </Text>
        </LoadingPlaceholder>
        <LoadingPlaceholder
          loading={!vendorLocation}
          height={13}
          width={100}
          style={{ marginTop: !vendorLocation ? 4 : 0, flex: 1 }}
        >
          <Text
            style={{ color: colors.textDim, flex: 1 }}
            size={"xs"}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {vendorLocation?.address}
          </Text>
        </LoadingPlaceholder>
      </View>
    </View>
  );
};
