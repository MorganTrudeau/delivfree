import { useAppSelector } from "app/redux/store";
import React, { useEffect, useMemo } from "react";
import { Platform, View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { useMenusLoading } from "app/hooks/useMenusLoading";
import { hasActiveMenu } from "app/utils/menus";

export const MenusEnabledNotice = ({ style }: { style?: ViewStyle }) => {
  const vendor = useAppSelector((state) => state.vendor.activeVendor?.id);

  const { menus, loadMenus, menusLoaded } = useMenusLoading({ vendor });

  useEffect(() => {
    loadMenus();
  }, []);

  const activeMenu = useMemo(() => hasActiveMenu(menus), [menus]);

  if (!menusLoaded || activeMenu) {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor: colors.palette.primary100,
          borderRadius: borderRadius.md,
          padding: spacing.md,
        },
        style,
      ]}
    >
      <Text>
        You have not set up your menus yet.{" "}
        {Platform.select({
          web: <>Please click on Menus in the side menu to get started.</>,
          default: (
            <>
              Please visit <Text preset="semibold">business.delivfree.com</Text>{" "}
              to get started.
            </>
          ),
        })}
      </Text>
    </View>
  );
};
