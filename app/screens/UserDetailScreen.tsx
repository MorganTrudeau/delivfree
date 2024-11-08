import { Screen } from "app/components";
import { DetailItem } from "app/components/DetailItem";
import { DetailsHeader } from "app/components/Details/DetailsHeader";
import { ScreenHeader } from "app/components/ScreenHeader";
import { $containerPadding, $screen } from "app/components/styles";
import { useReduxListener } from "app/hooks/useReduxListener";
import { AppStackScreenProps } from "app/navigators";
import { colors, spacing } from "app/theme";
import { User } from "delivfree";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ViewStyle } from "react-native";
import { useAlert } from "app/hooks";
import { ButtonSmall } from "app/components/ButtonSmall";
import { useAsyncFunction } from "app/hooks/useAsyncFunction";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";
import { confirmDelete } from "app/utils/general";
import { deleteUser, getUser, listenToUser } from "app/apis/user";

interface DriverDetailScreenProps extends AppStackScreenProps<"UserDetail"> {}

export const UserDetailScreen = (props: DriverDetailScreenProps) => {
  const Alert = useAlert();

  const userId = props.route.params?.user;

  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUser(userId);
        setUser(data);
      } catch (error) {
        Alert.alert(
          "Something went wrong",
          "There was a problem loading this user. You can try to refresh and try again."
        );
      }
    };
    load();
  }, []);

  const handleDeleteUser = useCallback(async () => {
    try {
      if (!user) {
        return;
      }
      const shouldDelete = await confirmDelete(Alert);
      if (!shouldDelete) {
        return;
      }
      await deleteUser(user);
      props.navigation.navigate("Users");
    } catch (error) {
      console.log("Failed to delete user", error);
      Alert.alert(
        "Something went wrong",
        "Failed to delete user. Please try again."
      );
    }
  }, [user]);

  const { loading: deleteLoading, exec: execDeleteUser } =
    useAsyncFunction(handleDeleteUser);

  const DeleteLoading = useLoadingIndicator(deleteLoading, {
    color: colors.primary,
  });

  if (!user) {
    return (
      <Screen
        preset="scroll"
        style={$screen}
        contentContainerStyle={$containerPadding}
      >
        <ActivityIndicator
          color={colors.primary}
          style={{ margin: spacing.lg }}
        />
      </Screen>
    );
  }

  return (
    <Screen
      preset="scroll"
      style={$screen}
      contentContainerStyle={$containerPadding}
    >
      <ScreenHeader title={user.firstName + " " + user.lastName} />

      <DetailsHeader title={"Details"} />
      <DetailItem title="First name" value={user.firstName} />
      <DetailItem title="Last name" value={user.lastName} />
      <DetailItem title="Email" value={user.email} />
      <DetailItem
        title="Phone number"
        value={
          user.phoneNumber
            ? (user.callingCode ? user.callingCode + " " : "") +
              user.phoneNumber
            : "No phone number added"
        }
      />

      {!user.admin && (
        <ButtonSmall
          text="Delete User"
          style={{
            marginTop: spacing.xl,
            alignSelf: "center",
            width: "100%",
            maxWidth: 300,
          }}
          textStyle={{ color: colors.primary }}
          RightAccessory={DeleteLoading}
          onPress={execDeleteUser}
        />
      )}
    </Screen>
  );
};

const $listHeaderStyle: ViewStyle = { borderTopWidth: 0 };
const $detailHeaderStyle: ViewStyle = { marginTop: spacing.xl };
