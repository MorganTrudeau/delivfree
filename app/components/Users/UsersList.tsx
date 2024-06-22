import React, { useCallback, useMemo } from "react";
import { User } from "delivfree";
import { TableHeader, TableHeaders } from "../TableHeaders";
import { FlatList, FlatListProps, Pressable } from "react-native";
import { useDimensions } from "app/hooks/useDimensions";
import { $borderBottom, isLargeScreen } from "../styles";
import { TableCell } from "../TableCell";
import { Text } from "../Text";
import { spacing } from "app/theme";
import { EmptyList } from "../EmptyList";

interface Props extends Partial<FlatListProps<User>> {
  users: User[];
  onPress: (user: User) => void;
}

export const UsersList = ({ users, onPress, ...rest }: Props) => {
  const { width } = useDimensions();
  const largeScreen = isLargeScreen(width);

  const headers = useMemo(() => {
    const _headers: TableHeader[] = [
      { title: "First name" },
      { title: "Last name" },
      { title: "Address" },
      { title: "Email" },
      { title: "Registration" },
    ];
    return _headers;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: User }) => {
      const roles = [
        item.admin ? "Admin" : "",
        item.vendor ? "Vendor" : "",
        item.driver ? "Driver" : "",
        item.consumer ? "Consumer" : "",
      ]
        .filter((role) => role)
        .join(", ");

      if (largeScreen) {
        return (
          <TableCell
            data={item}
            onPress={onPress}
            dataCells={[
              { text: item.firstName },
              { text: item.lastName },
              { text: item.location?.address || "-" },
              { text: item.email },
              { text: roles.length ? roles : "Unregistered" },
            ]}
          />
        );
      } else {
        return (
          <Pressable
            onPress={() => onPress(item)}
            style={[$borderBottom, { paddingVertical: spacing.xs }]}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" preset="subheading">
              {item.firstName} {item.lastName}
            </Text>
            <Text>{item.email}</Text>
            {!!item.location?.address && <Text>{item.location?.address}</Text>}
            <Text>{roles.length ? roles : "Unregistered"}</Text>
          </Pressable>
        );
      }
    },
    [largeScreen, onPress]
  );

  const renderEmptyList = useCallback(
    () => <EmptyList title={"No users"} />,
    []
  );

  return (
    <>
      {largeScreen && <TableHeaders headers={headers} />}
      <FlatList
        data={users}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    </>
  );
};
