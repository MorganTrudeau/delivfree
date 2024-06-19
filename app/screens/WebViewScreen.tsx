import { $flex } from "app/components/styles";
import { AppStackScreenProps } from "app/navigators";
import React, { useMemo } from "react";
import WebView from "react-native-webview";

type Props = AppStackScreenProps<"WebView">;

export const WebViewScreen = ({ route }: Props) => {
  const source = useMemo(() => ({ uri: route.params.uri }), [route.params.uri]);

  return <WebView source={source} style={$flex} />;
};
