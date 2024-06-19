import { Screen } from "app/components";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import { useAppSelector } from "app/redux/store";
import React, { useMemo } from "react";
import { LicensesList } from "app/components/Licenses/LicensesList";

interface DriverLicensesScreenProps extends AppStackScreenProps<"Licenses"> {}

export const DriverLicensesScreen = (props: DriverLicensesScreenProps) => {
  const vendorLocations = useAppSelector((state) => state.vendorLocations.data);
  const licensesData = useAppSelector((state) => state.driver.licenses);

  const licensesList = useMemo(
    () => Object.values(licensesData).filter((l) => l.status === "approved"),
    [licensesData]
  );

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
      
    >
      <ScreenHeader title={"Licenses"} />
      <LicensesList licenses={licensesList} vendorLocations={vendorLocations} />
    </Screen>
  );
};
