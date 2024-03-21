import React, { ErrorInfo } from "react";
import { ScrollView, TextStyle, View, ViewStyle } from "react-native";
import { Button, Icon, Screen, Text } from "../../components";
import { colors, spacing } from "../../theme";
import { NO_TOP_BOTTOM_SAFE_AREA_EDGES } from "app/components/styles";

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset(): void;
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <Screen
      preset="fixed"
      safeAreaEdges={NO_TOP_BOTTOM_SAFE_AREA_EDGES}
      contentContainerStyle={$contentContainer}
    >
      <View style={$topSection}>
        <Icon icon="ladybug" size={64} />
        <Text style={$heading} preset="subheading" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View>

      {__DEV__ && (
        <ScrollView
          style={$errorSection}
          contentContainerStyle={$errorSectionContentContainer}
        >
          <Text
            style={$errorContent}
            weight="bold"
            text={`${props.error}`.trim()}
          />
          {!!props.errorInfo && (
            <Text
              selectable
              style={$errorBacktrace}
              text={`${props.errorInfo.componentStack}`.trim()}
            />
          )}
        </ScrollView>
      )}

      <Button
        preset="reversed"
        style={$resetButton}
        onPress={props.onReset}
        tx="errorScreen.reset"
      />
    </Screen>
  );
}

const $contentContainer: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: spacing.md,
  paddingTop: spacing.xl,
  flex: 1,
};

const $topSection: ViewStyle = {
  // flex: 1,
  alignItems: "center",
};

const $heading: TextStyle = {
  color: colors.error,
  marginBottom: spacing.md,
};

const $errorSection: ViewStyle = {
  // flex: 1,
  backgroundColor: colors.separator,
  marginVertical: spacing.md,
  borderRadius: 6,
};

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing.md,
  flexGrow: 1,
};

const $errorContent: TextStyle = {
  color: colors.error,
};

const $errorBacktrace: TextStyle = {
  marginTop: spacing.md,
  color: colors.textDim,
};

const $resetButton: ViewStyle = {
  // backgroundColor: colors.error,
  paddingHorizontal: spacing.xxl,
};
