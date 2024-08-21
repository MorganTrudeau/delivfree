import { deleteAccount } from "app/apis/user";
import { Button, Icon, Screen, Text } from "app/components";
import {
  $containerPadding,
  NO_TOP_BOTTOM_SAFE_AREA_EDGES,
} from "app/components/styles";
import { colors, spacing } from "app/theme";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, TextStyle, ViewStyle } from "react-native";
import auth from "@react-native-firebase/auth";
import { useAppDispatch } from "app/redux/store";
import { setDeleteAccountLoading } from "app/redux/reducers/user";
import { Card } from "app/components/Card";
import { AppStackScreenProps } from "app/navigators";
import { useAlert } from "app/hooks";

interface Props extends AppStackScreenProps<"DeleteAccount"> {}

export const DeleteAccountScreen = ({ navigation }: Props) => {
  const Alert = useAlert();

  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    return () => {
      dispatch(setDeleteAccountLoading(false));
    };
  }, []);

  const confirmDelete = async () => {
    console.log("delete");
    try {
      const shouldContinue = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "Delete your account?",
          "Are you sure you want to continue? This operation cannot be reversed.",
          [
            { text: "No", onPress: () => resolve(false) },
            { text: "Yes", onPress: () => resolve(true), style: "destructive" },
          ]
        );
      });

      if (shouldContinue) {
        setLoading(true);
        dispatch(setDeleteAccountLoading(true));
        await deleteAccount();
        await auth().signOut();
      }
    } catch (error) {
      setLoading(false);
      dispatch(setDeleteAccountLoading(false));
      console.log(error);
      Alert.alert(
        "That didn't work",
        "You account could not be deleted. You can try again."
      );
    }
  };

  const ButtonLoading = useMemo(
    () =>
      loading
        ? function ButtonLoading({ style }) {
            return <ActivityIndicator color={colors.error} style={style} />;
          }
        : undefined,
    [loading]
  );

  const ButtonIcon = useMemo(
    () =>
      function ButtonIcon({ style }) {
        return (
          <Icon icon="alert-box-outline" color={colors.error} style={style} />
        );
      },
    []
  );

  return (
    <Screen
      safeAreaEdges={NO_TOP_BOTTOM_SAFE_AREA_EDGES}
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <Card>
        <Text preset="subheading" style={$title}>
          Deleting your account
        </Text>
        <Text>
          This will erase all your data and delete your account. You will no
          longer be able to login and access your account. This cannot be
          reversed.
        </Text>
        <Button
          text="Delete account"
          style={$button}
          textStyle={$buttonText}
          onPress={confirmDelete}
          LeftAccessory={ButtonIcon}
          RightAccessory={ButtonLoading}
        />
      </Card>
    </Screen>
  );
};

const $screen: ViewStyle = {
  padding: spacing.md,
};
const $title: TextStyle = {
  marginBottom: spacing.xs,
};
const $button: ViewStyle = {
  marginTop: spacing.md,
};
const $buttonText: TextStyle = { color: colors.error };
