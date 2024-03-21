import React from "react";
import { Button } from "./Button";
import { Text } from "./Text";
import { TextStyle } from "react-native/types";
import { spacing } from "app/theme";

export const ErrorButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <>
      <Text
        preset={"subheading"}
        tx="errors.heading"
        size={"xl"}
        style={$heading}
      />
      <Button
        preset={"reversed"}
        onPress={onPress}
        tx="common.try_that_again"
      />
    </>
  );
};

const $heading: TextStyle = {
  marginBottom: spacing.xl,
  textAlign: "center",
};
