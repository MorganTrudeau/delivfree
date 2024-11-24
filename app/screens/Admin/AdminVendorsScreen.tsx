import React, { useEffect, useState } from "react";
import { Screen } from "app/components";
import { StatusFilter } from "app/components/Filters/StatusFilter";
import { ScreenHeader } from "app/components/ScreenHeader";
import { VendorsList } from "app/components/Vendors/VendorsList";
import { $containerPadding, $row, $screen } from "app/components/styles";
import { useVendorData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { spacing } from "app/theme";
import { Status, Vendor } from "delivfree";
import { View } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { generateUid } from "app/utils/general";

interface AdminVendorsScreenProps extends AppStackScreenProps<"Vendors"> {}

export const AdminVendorsScreen = (props: AdminVendorsScreenProps) => {
  const handleVendorPress = (vendor: Vendor) => {
    props.navigation.navigate("VendorDetail", { vendor: vendor.id });
  };

  const [dataParams, setDataParams] = useState<{ status?: Status }>({});

  const { data, loadData } = useVendorData(dataParams);

  const runTest = async () => {
    const orderDoc = await firestore()
      .collection("Orders")
      .doc("1eaa8bf9a5e434e03b49890dc94074308e5b")
      .get();
    const order = orderDoc.data();
    console.log(order);
    const newOrder = { ...order, id: generateUid() };
    await firestore().collection("Orders").doc(newOrder.id).set(newOrder);
  };

  // useEffect(() => {
  //   runTest();
  // }, []);

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
            setDataParams((d) =>
              d.status === filter
                ? {}
                : {
                    ...d,
                    status: filter,
                  }
            )
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
