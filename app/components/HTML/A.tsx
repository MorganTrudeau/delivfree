import React from "react";
import { Text, TextProps } from "../Text";
import { Linking, TextStyle } from "react-native";
import { colors } from "app/theme";

export const A = ({ style, href, ...rest }: TextProps & { href: string }) => {
  const openLink = async () => {
    try {
      await Linking.openURL(href);
    } catch (error) {
      console.log(error);
    }
  };

  return <Text style={[$text, style]} {...rest} onPress={openLink} />;
};

const $text: TextStyle = { color: colors.primary };
