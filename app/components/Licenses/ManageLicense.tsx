import React, { useEffect, useMemo, useState } from "react";
import { License, Status, VendorLocation } from "delivfree";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import { $image, $imageContainer, $row } from "../styles";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { QuantitySelector } from "../QuantitySelector";
import { useDimensions } from "app/hooks/useDimensions";
import { borderRadius } from "app/theme/borderRadius";
import { getAppType, localizeCurrency } from "app/utils/general";
import { Button } from "../Button";
import { StatusPicker } from "../StatusPicker";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { useToast } from "app/hooks";
import { translate } from "app/i18n";
import { fetchVendorLocation } from "app/apis/vendorLocations";

export type Props = {
  license: License;
  vendorLocationData?: VendorLocation;
  onChange: (license: string, licenseUpdate: Partial<License>) => void;
  onChangeStatus: (
    license: string,
    status: Status,
    message: string | null
  ) => void;
  onConfirm?: () => void;
  loading?: boolean;
  statusLoading?: Status;
  editable?: boolean;
  availableFullTime?: number;
  availablePartTime?: number;
};

export const ManageLicense = ({
  license,
  statusLoading,
  onChange,
  onChangeStatus,
  onConfirm,
  vendorLocationData,
  loading,
  availableFullTime,
  availablePartTime,
  editable = true,
}: Props) => {
  const Toast = useToast();

  const { width } = useDimensions();
  const smallScreenLayout = width <= 600;

  const fullTime = license.fullTimePositions;
  const partTime = license.partTimePositions;

  const [vendorLocation, setVendorLocation] = useState<
    VendorLocation | undefined
  >(vendorLocationData);

  useEffect(() => {
    if (!vendorLocation) {
      const loadVendorLocationData = async () => {
        try {
          const vendorLocationData = await fetchVendorLocation(
            license.vendorLocation
          );
          if (vendorLocationData) {
            setVendorLocation(vendorLocationData);
          } else {
            throw "missing-vendor-location";
          }
        } catch (error) {
          console.log("failed to load vendor location data", error);
          Toast.show(translate("errors.common"));
        }
      };
      loadVendorLocationData();
    }
  }, []);

  const estimatedRevenue = useMemo(
    () => localizeCurrency(fullTime * 4000 + partTime * 2000, "CAD"),
    [fullTime, partTime]
  );

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [loading]
  );

  const getFullTimeText = () =>
    `${fullTime} Full time position${fullTime !== 1 ? "s" : ""}`;
  const getPartTimeText = () =>
    `${partTime} Part time position${partTime !== 1 ? "s" : ""}`;

  return (
    <View
      style={{
        padding: smallScreenLayout ? spacing.md : spacing.lg,
        alignItems: "center",
      }}
    >
      <Text preset="heading" style={{ marginBottom: spacing.md }}>
        License Application
      </Text>

      <LoadingPlaceholder style={$imageContainer} loading={!vendorLocation}>
        <FastImage style={$image} source={{ uri: vendorLocation?.image }} />
      </LoadingPlaceholder>
      <LoadingPlaceholder
        style={{ marginTop: spacing.xs }}
        loading={!vendorLocation}
        height={25}
        width={200}
      >
        <Text preset={"subheading"} numberOfLines={2} ellipsizeMode="tail">
          {vendorLocation?.name}
        </Text>
      </LoadingPlaceholder>
      <LoadingPlaceholder
        loading={!vendorLocation}
        height={20}
        width={250}
        style={{
          marginTop: !vendorLocation ? spacing.xxs : 0,
          marginBottom: spacing.xs,
        }}
      >
        <Text
          numberOfLines={2}
          ellipsizeMode="tail"
          size={"xs"}
          style={{ color: colors.textDim }}
        >
          {vendorLocation?.address}
        </Text>
      </LoadingPlaceholder>

      {!editable && !!fullTime && (
        <Text preset="semibold">{getFullTimeText()}</Text>
      )}
      {!editable && !!partTime && (
        <Text preset="semibold">{getPartTimeText()}</Text>
      )}

      {getAppType() === "ADMIN" && (
        <StatusPicker
          status={license.status}
          onPress={(status, message) =>
            onChangeStatus(license.id, status, message)
          }
          style={{ marginTop: spacing.sm }}
          statusLoading={statusLoading}
        />
      )}

      {editable && !!availableFullTime && (
        <View
          style={[
            $selectorSection,
            !smallScreenLayout && $row,
            { marginTop: spacing.sm, alignSelf: "stretch" },
          ]}
        >
          <Text
            preset="semibold"
            style={{
              marginRight: smallScreenLayout ? 0 : spacing.md,
              marginBottom: smallScreenLayout ? spacing.xxs : 0,
              flex: 1,
            }}
          >
            {getFullTimeText()}
          </Text>
          <QuantitySelector
            disableDecrease={fullTime <= 0}
            disableIncrease={fullTime >= availableFullTime}
            changeQuantity={(n) =>
              onChange(license.id, {
                ...license,
                fullTimePositions: license.fullTimePositions + n,
              })
            }
          />
        </View>
      )}

      {editable && !!availablePartTime && (
        <View
          style={[
            $selectorSection,
            !smallScreenLayout && $row,
            { marginTop: spacing.sm, alignSelf: "stretch" },
          ]}
        >
          <Text
            preset="semibold"
            style={{
              marginRight: smallScreenLayout ? 0 : spacing.md,
              marginBottom: smallScreenLayout ? spacing.xxs : 0,
              flex: 1,
            }}
          >
            {getPartTimeText()}
          </Text>
          <QuantitySelector
            disableDecrease={partTime <= 0}
            disableIncrease={partTime >= availablePartTime}
            changeQuantity={(n) =>
              onChange(license.id, {
                ...license,
                partTimePositions: license.partTimePositions + n,
              })
            }
          />
        </View>
      )}

      {editable && (
        <Text
          preset="subheading"
          style={{ marginTop: spacing.md }}
          selectable={false}
        >
          Minimum estimated monthly revenue {estimatedRevenue}
        </Text>
      )}

      {onConfirm && (
        <Button
          text="Apply for license"
          onPress={onConfirm}
          disabled={!(fullTime || partTime)}
          preset={fullTime || partTime ? "filled" : "default"}
          style={{ marginTop: spacing.md, alignSelf: "stretch" }}
          RightAccessory={Loading}
        />
      )}
    </View>
  );
};

const $selectorSection: ViewStyle = {
  padding: spacing.xs,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.md,
  marginTop: spacing.sm,
};
