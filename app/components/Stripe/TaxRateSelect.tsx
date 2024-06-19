import { Vendor } from "functions/src/types";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { createTaxRate } from "app/apis/stripe";
import { $borderedArea, $formLabel, $inputFormContainer } from "../styles";
import ReanimatedCenterModal, { ModalRef } from "../Modal/CenterModal";
import { spacing } from "app/theme";
import { DropDownPicker } from "../DropDownPicker";
import { TextField } from "../TextField";
import { TextInput } from "../TextInput";
import { Icon } from "../Icon";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { Button } from "../Button";
import { updateVendor } from "app/apis/vendors";

export const TaxRateSelect = ({
  vendor,
  style,
}: {
  vendor: Vendor;
  style?: ViewStyle;
}) => {
  const modal = useRef<ModalRef>(null);

  const [
    { displayName, inclusive, percentage, displayNameType },
    setTaxRateEdit,
  ] = useState<{
    displayName: string;
    inclusive: boolean;
    percentage: string;
    displayNameType: DisplayNameType;
  }>({
    displayNameType: "sales-tax",
    displayName: "Sales tax",
    inclusive: false,
    percentage: "",
  });

  const taxRate = vendor.stripe.taxRates?.[0];

  const handleDisplayNameSelect = useCallback(
    (values: DisplayNameType[]) =>
      setTaxRateEdit((state) => ({
        ...state,
        displayNameType: values[0],
        displayName: getDisplayName(values[0]),
      })),
    []
  );

  const handleSaveTaxRate = useCallback(async () => {
    const newTaxRate = await createTaxRate({
      display_name: displayName,
      inclusive,
      percentage: Number(percentage),
    });

    if (newTaxRate) {
      updateVendor(vendor.id, {
        stripe: {
          ...vendor.stripe,
          taxRates: [{ id: newTaxRate.id, displayName, inclusive, percentage }],
        },
      });
    }

    modal.current?.close();
  }, [displayName, inclusive, percentage]);

  const { exec: saveTaxRate, loading } = useAsyncFunction(handleSaveTaxRate);
  const Loading = useLoadingIndicator(loading);

  return (
    <>
      <Pressable
        style={[$borderedArea, style]}
        onPress={() => modal.current?.open()}
      >
        <Text preset="semibold" size="md">
          Tax rate
        </Text>
        {!taxRate && <Text>Not collecting tax</Text>}
        {!!taxRate && (
          <Text>
            {taxRate.displayName} {taxRate.percentage}%
          </Text>
        )}
      </Pressable>
      <ReanimatedCenterModal ref={modal}>
        <View style={{ padding: spacing.md }}>
          <Text preset="subheading" style={{ marginBottom: spacing.sm }}>
            Tax rate
          </Text>
          <Text preset="formLabel" style={$formLabel}>
            Type
          </Text>
          <DropDownPicker<DisplayNameType>
            items={dropdownItems}
            onSelect={handleDisplayNameSelect}
            singleSelect
            selectedValues={[displayNameType]}
          />
          {displayNameType === "other" && (
            <TextInput
              style={{ marginTop: spacing.xs }}
              placeholder="Tax type"
              onChangeText={(displayName) =>
                setTaxRateEdit((state) => ({ ...state, displayName }))
              }
              value={displayName}
            />
          )}

          <TextField
            label={"Rate"}
            placeholder={"0"}
            RightAccessory={({ style }) => (
              <Icon icon="percent-outline" style={style} />
            )}
            containerStyle={[$inputFormContainer, { width: 150 }]}
            numberInput
            value={percentage}
            onChangeText={(percentage) => {
              console.log(percentage);
              setTaxRateEdit((state) => ({ ...state, percentage }));
            }}
            maxLength={3}
          />

          {/* <View style={{ marginTop: spacing.md }}>
            <Toggle
              label="Include tax in price"
              value={inclusive}
              onValueChange={(inclusive) =>
                setTaxRateEdit((state) => ({ ...state, inclusive }))
              }
            />
          </View> */}

          <Button
            preset={displayName && percentage ? "reversed" : "default"}
            text="Save tax rate"
            onPress={saveTaxRate}
            RightAccessory={Loading}
            style={{ marginTop: spacing.md }}
            disabled={!(displayName && percentage)}
          />
        </View>
      </ReanimatedCenterModal>
    </>
  );
};

type DisplayNameType = "sales-tax" | "vat" | "gst" | "other";

const getDisplayName = (value: DisplayNameType) => {
  switch (value) {
    case "gst":
      return "GST";
    case "sales-tax":
      return "Sales tax";
    case "vat":
      return "Vat";
    case "other":
      return "";
  }
};

const dropdownItems: { label: string; value: DisplayNameType }[] = [
  { label: "Sales tax", value: "sales-tax" },
  { label: "VAT", value: "vat" },
  { label: "GST", value: "gst" },
  { label: "Other", value: "other" },
];
