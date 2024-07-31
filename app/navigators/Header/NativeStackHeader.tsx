import React from "react";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import AppHeader from "./Header";

export const NativeStackHeader = (props: NativeStackHeaderProps) => {
  return (
    <AppHeader
      headerTint={props.options.headerTintColor}
      headerTitle={props.options.headerTitle}
      // @ts-expect-error dont need props
      headerLeft={props.options.headerLeft}
      // @ts-expect-error dont need props
      headerRight={props.options.headerRight}
      transparent={props.options.headerTransparent}
    />
  );
};
