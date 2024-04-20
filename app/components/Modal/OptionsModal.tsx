import { sizing } from "app/theme/sizing";
import React, {
  Ref,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleProp,
  TextStyle,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, IconTypes } from "../Icon";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { $borderBottom, $row, HORIZONTAL_SAFE_AREA_EDGES } from "../styles";
import { SafeAreaView } from "../SafeAreaView";
import { ModalRef } from "functions/src/types";

export const OPTION_HEIGHT = 50;
export const OPTION_ICON_SIZE = sizing.lg;

export type OptionModalItem = {
  customRenderer?: (options: { close: () => void }) => React.ReactElement;
  value: string;
  text?: string;
  description?: string;
  icon?: IconTypes;
  iconSize?: number;
  iconColor?: string;
  onPress?: (value?: string) => void;
  renderIcon?: () => React.ReactNode;
  destructive?: boolean;
  onConfirmation?: () => Promise<boolean>;
  disabled?: boolean;
  loading?: boolean;
  textStyle?: StyleProp<TextStyle>;
  renderRightComponent?: () => React.ReactElement | null;
  stayOpenOnPress?: boolean;
};

type OptionModalProps = {
  options: Array<OptionModalItem>;
  onSelect?: (option: OptionModalItem) => void;
};

const OptionsModalWithoutRef = (
  { options = [], onSelect }: OptionModalProps,
  ref: Ref<ModalRef>
) => {
  const insets = useSafeAreaInsets();
  const windowHeight = useWindowDimensions();

  const bottomSheet = useRef<BottomSheetRef>(null);

  const height = useMemo(
    () => options.length * OPTION_HEIGHT + spacing.xs + insets.bottom + 24,
    [options.length, insets.bottom]
  );

  const snapPoints = useMemo(() => {
    return [`${(height / windowHeight.height) * 100}%`];
  }, [height, windowHeight.height]);

  const open = useCallback(() => bottomSheet.current?.snapToIndex(0), []);
  const close = useCallback(() => bottomSheet.current?.close(), []);

  useImperativeHandle(ref, () => ({ open, close }), [open, close]);

  const handleSelect = async (option: OptionModalItem) => {
    if (!option.stayOpenOnPress) {
      close();
    }

    if (typeof option.onConfirmation === "function") {
      try {
        const shouldContinue = await option.onConfirmation();
        if (!shouldContinue) {
          return;
        }
      } catch (error) {
        console.log(error);
        return;
      }
    }

    if (onSelect) {
      onSelect(option);
    }

    if (typeof option.onPress === "function") {
      requestAnimationFrame(() => {
        option.onPress && option.onPress(option.value);
      });
    }
  };

  const renderOptions = () =>
    options.map((option, index) =>
      typeof option.customRenderer === "function" ? (
        <View key={option.value}>{option.customRenderer({ close })}</View>
      ) : (
        <OptionItem
          key={option.value}
          option={option}
          onPress={handleSelect}
          lastItem={index === options.length - 1}
        />
      )
    );

  return (
    <BottomSheet ref={bottomSheet} snapPoints={snapPoints}>
      <SafeAreaView
        style={{
          paddingBottom: spacing.xs + insets.bottom,
        }}
        edges={HORIZONTAL_SAFE_AREA_EDGES}
      >
        {renderOptions()}
      </SafeAreaView>
    </BottomSheet>
  );
};

export const OptionsModal = forwardRef<ModalRef, OptionModalProps>(
  OptionsModalWithoutRef
);

type OptionItemProps = {
  option: OptionModalItem;
  lastItem?: boolean;
  onPress: (value: OptionModalItem) => void;
};

export const OptionItem = ({ option, lastItem, onPress }: OptionItemProps) => (
  <TouchableOpacity
    onPress={() => {
      onPress(option);
    }}
    activeOpacity={1}
    disabled={option.disabled}
    style={$optionContainer}
  >
    {typeof option.renderIcon === "function" ? (
      option.renderIcon()
    ) : option.icon ? (
      <View style={$optionIconContainer}>
        <Icon
          icon={option.icon}
          size={option.iconSize || OPTION_ICON_SIZE}
          color={
            option.destructive
              ? colors.error
              : option.disabled
              ? colors.disabled
              : option.iconColor
              ? option.iconColor
              : colors.tint
          }
        />
      </View>
    ) : null}
    <View style={[!lastItem && $borderBottom, $row, $optionContent]}>
      <View style={$optionTextContainer}>
        <Text
          style={[
            $optionText,
            option.disabled && { color: colors.disabled },
            option.destructive && { color: colors.error },
            option.textStyle,
          ]}
        >
          {option.text}
        </Text>
        {!!option.description && (
          <Text style={$optionDescription}>{option.description}</Text>
        )}
      </View>
      {option.renderRightComponent && option.renderRightComponent()}
      {option.loading && <ActivityIndicator color={colors.primary} />}
    </View>
  </TouchableOpacity>
);

const $optionContainer: ViewStyle = {
  flexDirection: "row",
  marginHorizontal: spacing.md,
  height: OPTION_HEIGHT,
};
const $optionTextContainer: ViewStyle = { flex: 1, paddingRight: spacing.lg };
const $optionIconContainer: ViewStyle = {
  height: OPTION_HEIGHT - 1,
  width: OPTION_ICON_SIZE,
  alignItems: "center",
  justifyContent: "center",
  marginEnd: spacing.md,
};
const $optionText: TextStyle = {
  textAlign: "left",
  flexShrink: 1,
};
const $optionDescription: ViewStyle = { flexShrink: 1 };
const $optionContent: ViewStyle = {
  paddingVertical: spacing.sm,
  justifyContent: "space-between",
  minHeight: OPTION_HEIGHT,
  flex: 1,
};

export default OptionsModal;
