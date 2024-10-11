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
import { VendorLocationInfo } from "../VendorLocations/VendorLocationInfo";

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

  const [{ license, error, deleteLoading }, setState] = useState<{
    license: License | null;
    error: boolean;
    deleteLoading: boolean;
  }>({
    license: null,
    error: false,
    deleteLoading: false,
  });

  useEffect(() => {
    return listenToLicense(licenseId, async (licenseData) => {
      if (licenseData) {
        return setState({
          deleteLoading: false,
          error: false,
          license: licenseData,
        });
      } else {
        return setState({
          deleteLoading: false,
          error: true,
          license: null,
        });
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

  if (error) {
    return null;
  }

  return (
    <View style={[$license, style]}>
      <VendorLocationInfo vendorLocationId={license?.vendorLocation} />

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
            license &&
            license.status !== "approved" && (
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
