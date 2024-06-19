import React, { useState } from "react";
import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { StatusFilter } from "app/components/Filters/StatusFilter";
import { ScreenHeader } from "app/components/ScreenHeader";
import { VendorsList } from "app/components/Vendors/VendorsList";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { useVendorData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { Status, Vendor } from "delivfree";
import { View } from "react-native";

interface AdminVendorsScreenProps extends AppStackScreenProps<"Vendors"> {}

export const AdminVendorsScreen = (props: AdminVendorsScreenProps) => {
  const handleVendorPress = (vendor: Vendor) => {
    props.navigation.navigate("VendorDetail", { vendor: vendor.id });
  };

  const [dataParams, setDataParams] = useState<{ status?: Status }>({});

  const { data, loadData } = useVendorData(dataParams);

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
      
    >
      <ScreenHeader title="Vendors" />
      <View style={[$row, { paddingBottom: spacing.sm }]}>
        <StatusFilter
          activeFilter={dataParams.status}
          onFilterPress={(filter) =>
            setDataParams((d) => ({
              ...d,
              status: d.status === filter ? undefined : filter,
            }))
          }
        />
      </View>
      <VendorsList
        vendors={data}
        onPress={handleVendorPress}
        onEndReached={loadData}
        onEndReachedThreshold={0.2}
      />
    </Screen>
  );
};
