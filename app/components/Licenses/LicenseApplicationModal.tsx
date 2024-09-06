import React, { forwardRef, useMemo, useState } from "react";
import { License, Positions, VendorLocation } from "delivfree";
import { ActivityIndicator, ScrollView, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";
import { $image, $imageContainer, $row } from "../styles";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import ReanimatedCenterModal from "../Modal/CenterModal";
import { ModalRef } from "app/utils/types";
import { QuantitySelector } from "../QuantitySelector";
import { useDimensions } from "app/hooks/useDimensions";
import { borderRadius } from "app/theme/borderRadius";
import {
  alertCommonError,
  generateUid,
  localizeCurrency,
  pluralFormat,
} from "app/utils/general";
import { Button } from "../Button";
import { useAlert } from "app/hooks";
import { createLicense } from "app/apis/licenses";

type Props = {
  positions: Positions;
  vendorLocation: VendorLocation;
  driver: string;
  onSuccess?: (updatedPositions: Positions) => void;
};

export const LicenseApplication = ({
  positions,
  vendorLocation,
  driver,
  onSuccess,
}: Props) => {
  const Alert = useAlert();
  const { width } = useDimensions();
  const smallScreenLayout = width <= 600;

  const availableFullTime = positions.maxFullTime - positions.filledFullTime;
  const availablePartTime = positions.maxPartTime - positions.filledPartTime;

  const [loading, setLoading] = useState(false);
  const [fullTime, setFullTime] = useState(
    availableFullTime === 1 && !availablePartTime ? 1 : 0
  );
  const [partTime, setPartTime] = useState(
    availablePartTime === 1 && !availableFullTime ? 1 : 0
  );

  const estimatedRevenue = useMemo(
    () => localizeCurrency(fullTime * 4000 + partTime * 2000, "CAD"),
    [fullTime, partTime]
  );

  const handleApply = async () => {
    if (!(fullTime || partTime)) {
      return Alert.alert(
        "Select at least one license",
        "Please select how many licences you want to apply for."
      );
    }

    const shouldContinue = await new Promise((resolve) => {
      Alert.alert(
        "Apply for license",
        `Confirm license application for ${
          fullTime
            ? fullTime + ` Full time ${pluralFormat("license", fullTime)}`
            : ""
        }${fullTime && partTime ? "&" : ""}${
          partTime
            ? partTime + ` Part time ${pluralFormat("license", partTime)}`
            : ""
        }.`,
        [
          { text: "Cancel", onPress: () => resolve(false) },
          { text: "Apply", onPress: () => resolve(true), isPreferred: true },
        ]
      );
    });
    if (!shouldContinue) {
      return;
    }

    const license: License = {
      id: generateUid(),
      driver,
      position: positions.id,
      vendor: vendorLocation.vendor,
      vendorLocation: vendorLocation.id,
      fullTimePositions: fullTime,
      partTimePositions: partTime,
      status: "pending",
      updated: Date.now(),
    };

    try {
      setLoading(true);
      await createLicense(license);
      onSuccess &&
        onSuccess({
          ...positions,
          licenses: [...(positions.licenses || []), license.id],
        });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alertCommonError(Alert);
    }
  };

  const Loading = useMemo(
    () =>
      loading
        ? ({ style }) => <ActivityIndicator color={"#fff"} style={style} />
        : undefined,
    [loading]
  );

  return (
    <ScrollView
      contentContainerStyle={{
        padding: smallScreenLayout ? spacing.md : spacing.lg,
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      <Text preset="heading" style={{ marginBottom: spacing.md }}>
        License Application
      </Text>

      <View style={$imageContainer}>
        <FastImage style={$image} source={{ uri: vendorLocation?.image }} />
      </View>
      <View style={{ flex: 1, marginTop: spacing.xs }}>
        <Text preset={"subheading"} numberOfLines={2} ellipsizeMode="tail">
          {vendorLocation?.name}
        </Text>
      </View>
      <Text
        numberOfLines={2}
        ellipsizeMode="tail"
        size={"xs"}
        style={{ color: colors.textDim, marginBottom: spacing.xs }}
      >
        {vendorLocation?.address}
      </Text>

      {availableFullTime > 0 && (
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
            {fullTime} Full time {pluralFormat("license", fullTime)}
          </Text>
          <QuantitySelector
            disableDecrease={fullTime <= 0}
            disableIncrease={fullTime >= availableFullTime}
            changeQuantity={(n) => setFullTime((f) => f + n)}
          />
        </View>
      )}

      {availablePartTime > 0 && (
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
            {partTime} Part time {pluralFormat("license", partTime)}
          </Text>
          <QuantitySelector
            disableDecrease={partTime <= 0}
            disableIncrease={partTime >= availablePartTime}
            changeQuantity={(n) => setPartTime((f) => f + n)}
          />
        </View>
      )}

      <Text
        preset="subheading"
        style={{ marginTop: spacing.md }}
        selectable={false}
      >
        Minimum estimated monthly revenue {estimatedRevenue}
      </Text>

      <Button
        text="Apply for license"
        onPress={handleApply}
        preset={fullTime || partTime ? "filled" : "default"}
        style={{ marginTop: spacing.md, alignSelf: "stretch" }}
        RightAccessory={Loading}
      />
    </ScrollView>
  );
};

const $selectorSection: ViewStyle = {
  padding: spacing.sm,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: borderRadius.md,
  marginTop: spacing.sm,
};

export const LicenseApplicationModal = forwardRef<
  ModalRef,
  {
    onDismiss?: () => void;
    positions: Positions | null | undefined;
    vendorLocation: VendorLocation | null | undefined;
    driver?: string;
    onSuccess?: (updatedPositions: Positions) => void;
  }
>(function LicenseApplicationModal(
  { onDismiss, positions, vendorLocation, driver, onSuccess },
  ref
) {
  return (
    <ReanimatedCenterModal ref={ref} onDismiss={onDismiss}>
      {positions && vendorLocation && !!driver && (
        <LicenseApplication
          positions={positions}
          vendorLocation={vendorLocation}
          driver={driver}
          onSuccess={onSuccess}
        />
      )}
    </ReanimatedCenterModal>
  );
});
