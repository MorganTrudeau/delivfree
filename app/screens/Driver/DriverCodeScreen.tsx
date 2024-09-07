import { Screen, Text } from "app/components";
import { useAppSelector } from "app/redux/store";
import { Driver } from "delivfree";
import React, { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { generatePin } from "app/utils/general";
import { ActivityIndicator, View } from "react-native";
import { colors, spacing } from "app/theme";
import { Card } from "app/components/Card";
import {
  $borderedArea,
  $containerPadding,
  $flex,
  $row,
} from "app/components/styles";
import { AppLogo } from "app/components/AppLogo";
import { LogoutButton } from "app/components/LogoutButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const DriverCodeScreen = () => {
  const insets = useSafeAreaInsets();

  const driver = useAppSelector((state) => state.driver.activeDriver as Driver);

  const [code, setCode] = useState("");

  const createCode = async (attempts = 0) => {
    try {
      const code = generatePin(6 + attempts);

      const driverCodeCollection = firestore().collection("DriverCodes");

      const existingCodes = await driverCodeCollection
        .where("code", "==", code)
        .get();

      if (!existingCodes.empty) {
        return createCode(attempts + 1);
      }

      await driverCodeCollection.doc(driver.id).set({ code });

      return code;
    } catch (error) {
      console.log("Failed to create code", error);
      return undefined;
    }
  };

  const loadCode = async () => {
    try {
      const driverCodeCollection = firestore().collection("DriverCodes");

      const driverCodeDoc = await driverCodeCollection.doc(driver.id).get();
      const driverCodeData = driverCodeDoc.data();

      if (driverCodeData && driverCodeData.code) {
        setCode(driverCodeData.code);
      } else {
        const code = await createCode();
        if (code) {
          setCode(code);
        }
      }
    } catch (error) {
      console.log("Failed to load code", error);
    }
  };

  useEffect(() => {
    loadCode();
  }, []);

  return (
    <Screen contentContainerStyle={$containerPadding}>
      <View style={$flex}>
        <Card>
          <AppLogo
            style={{ marginBottom: spacing.lg, alignSelf: "center" }}
            height={50}
          />
          <Text preset="heading" style={{ marginBottom: spacing.sm }}>
            Get Hired
          </Text>
          <View style={[$borderedArea, { backgroundColor: colors.background }]}>
            <Text preset="subheading" style={{ marginBottom: spacing.xs }}>
              Instructions
            </Text>
            <Text preset="formLabel">Being hired by a vendor?</Text>
            <Text>Provide your Driver Code to the vendor hiring you.</Text>
            <Text preset="formLabel" style={{ marginTop: spacing.sm }}>
              Being hired by a driver?
            </Text>
            <Text>Provide your Driver Code to the driver hiring you.</Text>
          </View>

          <View
            style={[
              $borderedArea,
              {
                alignItems: "flex-start",
                alignSelf: "flex-start",
                marginTop: spacing.lg,
              },
            ]}
          >
            <View style={$row}>
              <Text preset="subheading">Driver Code</Text>
              {!code && (
                <ActivityIndicator
                  color={colors.primary}
                  style={{ marginLeft: spacing.xs }}
                />
              )}
            </View>
            {!!code && (
              <Text
                preset="heading"
                allowFontScaling={false}
                style={{ fontSize: 50, marginTop: spacing.xxs, lineHeight: 60 }}
              >
                {code}
              </Text>
            )}
          </View>
        </Card>
      </View>
      <LogoutButton
        style={{
          alignSelf: "center",
          marginTop: spacing.md,
          marginBottom: insets.bottom,
        }}
      />
    </Screen>
  );
};
