import React from "react";
import { Text } from "./Text";
import { Button } from "./Button";
import { spacing } from "app/theme";
import { TextStyle } from "react-native";

export const ErrorView = ({ onErrorClear }: { onErrorClear: () => void }) => {
  return (
    <>
      <Text preset={"heading"} tx="errors.heading" style={$heading} />
      <Button
        preset={"reversed"}
        onPress={onErrorClear}
        tx="common.try_that_again"
      />
    </>
  );
};

const $heading: TextStyle = {
  textAlign: "center",
  marginBottom: spacing.xl,
  marginTop: spacing.md,
};
