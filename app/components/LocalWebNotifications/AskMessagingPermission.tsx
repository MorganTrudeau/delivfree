import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors, spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";
import { $row, $shadow } from "../styles";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { ButtonSmall } from "../ButtonSmall";

type Props = {
  style?: StyleProp<ViewStyle>;
  onEnable: () => void;
  onCancel: () => void;
};

const AskMessagingPermission = ({ style, onEnable, onCancel }: Props) => {
  return (
    <View
      style={[
        {
          backgroundColor: colors.background,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
        },
        $shadow,
        style,
      ]}
    >
      <Text preset="subheading">Enable Notifications</Text>
      <Text>Stay up to date with in-app notifications</Text>
      <View style={[$row, { marginTop: spacing.md }]}>
        <ButtonSmall
          onPress={onEnable}
          text="Enable"
          style={{ marginRight: spacing.md, flex: 1 }}
          RightAccessory={({ style }) => (
            <Icon icon="check-circle" style={style} color={colors.primary} />
          )}
        />
        <ButtonSmall onPress={onCancel} text="Not now" style={{ flex: 1 }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
});

export default AskMessagingPermission;
