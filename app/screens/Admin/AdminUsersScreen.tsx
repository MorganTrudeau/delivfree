import { Screen } from "app/components";
import { Drawer } from "app/components/Drawer";
import { ScreenHeader } from "app/components/ScreenHeader";
import { UsersList } from "app/components/Users/UsersList";
import { $containerPadding, $screen } from "app/components/styles";
import { useUserData } from "app/hooks";
import { AppStackScreenProps } from "app/navigators";
import { User } from "delivfree";
import React, { useEffect } from "react";

interface AdminUsersScreenProps extends AppStackScreenProps<"Users"> {}

export const AdminUsersScreen = (props: AdminUsersScreenProps) => {
  const handleUserPress = (user: User) => {};

  const { data, loadData } = useUserData();

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Screen
      preset="fixed"
      style={$screen}
      contentContainerStyle={$containerPadding}
      
    >
      <ScreenHeader title="Users" />
      <UsersList
        users={data}
        onPress={handleUserPress}
        onEndReached={loadData}
        onEndReachedThreshold={0.2}
      />
    </Screen>
  );
};
