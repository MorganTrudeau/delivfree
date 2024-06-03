import React, { useEffect, useState } from "react";
import { deleteLicense, listenToLicense } from "app/apis/licenses";
import { fetchVendorLocation } from "app/apis/vendorLocations";
import { useAlert, useToast } from "app/hooks";
import { ActivityIndicator, View, ViewStyle } from "react-native";
import { LoadingPlaceholder } from "../LoadingPlaceholder";
import { $image, $imageContainer, $row } from "../styles";
import { borderRadius } from "app/theme/borderRadius";
import FastImage from "react-native-fast-image";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";
import { StatusIndicator } from "../StatusIndicator";
import { IconButton } from "../IconButton";
import { License, VendorLocation } from "delivfree";
import { translate } from "app/i18n";

export const LicenseItem = ({
  licenseId,
  minDetails,
  style,
}: {
  licenseId: string;
  minDetails?: boolean;
  style?: ViewStyle;
}) => {
  const Alert = useAlert();
  const Toast = useToast();

  const [{ license, vendorLocation, error, deleteLoading }, setState] =
    useState<{
      license: License | null;
      vendorLocation: VendorLocation | null;
      error: boolean;
      deleteLoading: boolean;
    }>({
      license: null,
      vendorLocation: null,
      error: false,
      deleteLoading: false,
    });

  useEffect(() => {
    return listenToLicense(licenseId, async (licenseData) => {
      if (licenseData) {
        const vendorLocation = await fetchVendorLocation(
          licenseData?.vendorLocation
        );

        if (vendorLocation) {
          return setState({
            deleteLoading: false,
            error: false,
            license: licenseData,
            vendorLocation: vendorLocation,
          });
        }
      }
    });
  }, [licenseId]);

  const handleDelete = async () => {
    try {
      if (!license) {
        return;
      }
      const shouldContinue = await new Promise((resolve) => {
        Alert.alert(
          "Remove license application",
          "Are you sure you want to remove this license application?",
          [
            { text: "Cancel", onPress: () => resolve(false) },
            {
              text: "Remove application",
              onPress: () => resolve(true),
              style: "destructive",
            },
          ]
        );
      });
      if (!shouldContinue) {
        return;
      }
      setState((s) => ({ ...s, deleteLoading: true }));
      await deleteLicense(license.id);
      setState((s) => ({ ...s, deleteLoading: false }));
    } catch (error) {
      console.log("Failed to delete license", error);
      setState((s) => ({ ...s, deleteLoading: false }));
      Toast.show(translate("errors.common"));
    }
  };

  return (
    <View style={[$license, style]}>
      <View style={$row}>
        <LoadingPlaceholder
          loading={!license}
          style={[
            $imageContainer,
            { width: 150, borderRadius: borderRadius.sm },
          ]}
        >
          <FastImage
            style={[$image, { borderRadius: borderRadius.sm }]}
            source={{ uri: vendorLocation?.image }}
          />
        </LoadingPlaceholder>

        <View style={{ marginLeft: spacing.sm }}>
          <LoadingPlaceholder loading={!license} height={18} width={125}>
            <Text preset="semibold" numberOfLines={2} ellipsizeMode="tail">
              {vendorLocation?.name}
            </Text>
          </LoadingPlaceholder>
          <LoadingPlaceholder
            loading={!license}
            height={13}
            width={100}
            style={{ marginTop: !license ? 4 : 0 }}
          >
            <Text
              style={{ color: colors.textDim, maxWidth: 250 }}
              size={"xs"}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {vendorLocation?.address}
            </Text>
          </LoadingPlaceholder>
        </View>
      </View>

      <View style={{ marginTop: spacing.xs }}>
        <LoadingPlaceholder loading={!license} height={22} width={300}>
          <Text>
            {!!license?.fullTimePositions && (
              <Text>
                {license?.fullTimePositions} Full time position
                {license?.fullTimePositions !== 1 ? "s" : ""}
              </Text>
            )}
            {!!license?.fullTimePositions && !!license?.partTimePositions
              ? ", "
              : ""}
            {!!license?.partTimePositions && (
              <Text>
                {license?.partTimePositions} Part time position
                {license?.partTimePositions !== 1 ? "s" : ""}
              </Text>
            )}
          </Text>
        </LoadingPlaceholder>
      </View>

      {!minDetails && (
        <View
          style={[
            $row,
            { marginTop: spacing.xs, justifyContent: "space-between" },
          ]}
        >
          <LoadingPlaceholder loading={!license} height={27} width={80}>
            {license && (
              <View style={$row}>
                <StatusIndicator status={license?.status} />
                {!!license.statusMessage && (
                  <Text size="xs" style={{ marginLeft: spacing.xs }}>
                    {license.statusMessage}
                  </Text>
                )}
              </View>
            )}
          </LoadingPlaceholder>

          {deleteLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            license && (
              <IconButton
                icon={"delete"}
                color={colors.textDim}
                size={20}
                onPress={handleDelete}
              />
            )
          )}
        </View>
      )}
    </View>
  );
};

const $license: ViewStyle = {
  padding: spacing.sm,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.md,
};
