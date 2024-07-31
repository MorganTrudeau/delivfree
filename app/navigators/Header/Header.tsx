import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppHeaderLayout, { Props as AppHeaderLayoutProps } from "./HeaderLayout";
import { useNavigation } from "@react-navigation/native";
import HeaderBackButton from "./HeaderBackButton";

type Props = Omit<AppHeaderLayoutProps, "insets">;

const AppHeader = ({ headerLeft, headerTint, ...rest }: Props) => {
  const insets = useSafeAreaInsets();

  const navigation = useNavigation();

  const renderHeaderLeft = useMemo(() => {
    if (headerLeft) {
      return headerLeft;
    }
    if (!navigation.canGoBack()) {
      return undefined;
    }
    return () => (
      <HeaderBackButton headerColor={headerTint} onPress={navigation.goBack} />
    );
  }, [headerLeft, headerTint, navigation]);

  return (
    <AppHeaderLayout
      {...rest}
      headerLeft={renderHeaderLeft}
      insets={insets}
      headerTint={headerTint}
    />
  );
};

export default AppHeader;
