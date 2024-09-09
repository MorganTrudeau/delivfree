import { Screen, Text } from "app/components";
import { colors, spacing } from "app/theme";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { useAppDispatch, useAppSelector } from "app/redux/store";
import { createUser, updateUser } from "app/apis/user";
import { useAlert } from "app/hooks";
import { LogoutButton } from "app/components/LogoutButton";
import { getAppType } from "app/utils/general";
import { User } from "delivfree";
import { AppStackScreenProps } from "app/navigators";
import { ConsumerRegistration } from "app/components/Auth/ConsumerRegistration";

export const EditUserScreen = ({
  navigation,
}: AppStackScreenProps<"EditProfile">) => {
  const Alert = useAlert();

  const authToken = useAppSelector((state) => state.auth.authToken as string);
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [skipping, setSkipping] = useState(false);

  const skipRegistration = useCallback(async () => {
    const newUser: User = {
      id: authToken,
      firstName: "",
      lastName: "",
      email: "",
      location: null,
      deliveryInstructions: { type: "meet-door", note: "" },
      phoneNumber: null,
      callingCode: null,
      callingCountry: null,
    };

    if (getAppType() === "ADMIN") {
      newUser.admin = {};
    } else {
      newUser.consumer = {};
    }

    try {
      setSkipping(true);
      if (user) {
        await updateUser(newUser.id, newUser);
      } else {
        await dispatch(createUser({ ...newUser, location: null }));
      }
      setSkipping(false);
    } catch (error) {
      setSkipping(false);
      Alert.alert("Something went wrong", "Please try that again.");
    }
  }, [authToken, dispatch, Alert]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        skipping ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <Pressable onPress={skipRegistration} hitSlop={10}>
            <Text preset="semibold">Skip</Text>
          </Pressable>
        ),
    });
  }, [navigation, skipping]);

  return (
    <Screen preset={"scroll"} contentContainerStyle={$screen}>
      <ConsumerRegistration />
      <LogoutButton style={{ marginTop: spacing.lg, alignSelf: "center" }} />
    </Screen>
  );
};

const $screen = { padding: spacing.md };
