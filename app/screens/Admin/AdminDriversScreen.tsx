import { Screen } from "app/components";
import { DriversList } from "app/components/Drivers/DriversList";
import { StatusFilter } from "app/components/Filters/StatusFilter";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { useDriverData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { Driver, Status } from "delivfree";
import React, { useState } from "react";
import { View } from "react-native";

interface AdminDriversScreenProps extends AppStackScreenProps<"Drivers"> {}

export const AdminDriversScreen = (props: AdminDriversScreenProps) => {
  const handleDriverPress = (driver: Driver) => {
    props.navigation.navigate("DriverDetail", { driver: driver.id });
  };

  const [dataParams, setDataParams] = useState<{ status?: Status }>({});

  const { data, loadData } = useDriverData(dataParams);

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title="Drivers" />
      <View style={[$row, { paddingBottom: spacing.sm }]}>
        <StatusFilter
          activeFilter={dataParams.status}
          onFilterPress={(filter) =>
            setDataParams((d) =>
              d.status === filter ? {} : { status: filter }
            )
          }
        />
      </View>
      <DriversList
        drivers={data}
        onPress={handleDriverPress}
        onEndReached={loadData}
        onEndReachedThreshold={0.2}
        showStatus
      />
    </Screen>
  );
};
