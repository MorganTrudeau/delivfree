import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Portal } from "react-native-portalize";
import AppKeyboardAwareView from "../KeyboardAwareView";
import { useOnChange } from "app/hooks";
import { MAX_CENTER_MODAL_WIDTH } from "../styles";
import { spacing } from "app/theme";
import { borderRadius } from "app/theme/borderRadius";

type Props = {
  tapToClose?: boolean;
  children: ViewProps["children"];
  onDismiss?: () => void;
  modalStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  backdropStyle?: ViewStyle;
};
export type ModalRef = {
  open: () => void;
  close: () => void;
};

const ReanimatedCenterModal = forwardRef<ModalRef, Props>(
  function ReanimatedCenterModal(
    {
      tapToClose = true,
      children,
      onDismiss,
      modalStyle,
      contentStyle,
      backdropStyle,
    },
    ref
  ) {
    const { height } = useWindowDimensions();

    const [{ visible, hideContent }, setState] = useState({
      visible: false,
      hideContent: true,
    });

    const open = useCallback(
      () => setState({ visible: true, hideContent: false }),
      []
    );
    const close = useCallback(
      () => setState((s) => ({ visible: false, hideContent: s.hideContent })),
      []
    );

    useImperativeHandle(ref, () => ({ open, close }));

    const animation = useRef(new Animated.Value(visible ? 1 : 0));

    const handleDismiss = () => {
      setState({ visible: false, hideContent: true });
      onDismiss && onDismiss();
    };

    useOnChange(visible, (next) => {
      Animated.timing(animation.current, {
        toValue: next ? 1 : 0,
        useNativeDriver: true,
        duration: 200,
      }).start(!next ? handleDismiss : undefined);
    });

    const style: Animated.AnimatedProps<ViewStyle> = useMemo(
      () => ({
        flex: 1,
        opacity: animation.current,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99,
        ...modalStyle,
      }),
      [modalStyle]
    );

    return (
      <Portal>
        <Animated.View style={style} pointerEvents={visible ? "auto" : "none"}>
          {hideContent && !visible ? null : (
            <>
              <Backdrop
                enabled={tapToClose}
                onPress={close}
                style={backdropStyle}
              />
              <View style={styles.childWrapper} pointerEvents="box-none">
                <ModalChild maxHeight={height * 0.9} style={contentStyle}>
                  {children}
                </ModalChild>
              </View>
            </>
          )}
        </Animated.View>
      </Portal>
    );
  }
);

type ModalChildProps = {
  style?: StyleProp<ViewStyle>;
  maxHeight: number;
  children?: React.ReactNode | React.ReactNode[];
  HeaderComponent?: React.ReactElement | null;
};

const ModalChild = ({
  style,
  maxHeight,
  children,
  HeaderComponent = null,
}: ModalChildProps) => {
  return (
    <AppKeyboardAwareView
      enabled={_keyboardAwareViewEnabled}
      style={[
        styles.childContainer,
        { maxHeight, maxWidth: MAX_CENTER_MODAL_WIDTH },
        style,
      ]}
      scrollOffset={_scrollOffset}
    >
      <View style={{ maxHeight }}>
        {HeaderComponent}
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps={"handled"}
          style={styles.scrollStyle}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </View>
    </AppKeyboardAwareView>
  );
};

type BackdropProps = {
  enabled: boolean;
  onPress: (() => void) | undefined;
  children?: ViewProps["children"];
  style?: StyleProp<ViewStyle>;
};
const Backdrop = ({ enabled, onPress, children, style }: BackdropProps) => {
  return (
    <Pressable
      style={[backdropStyles.background, style]}
      onPress={onPress}
      disabled={!enabled}
    >
      {children}
    </Pressable>
  );
};

const backdropStyles = StyleSheet.create({
  background: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    padding: spacing.sm,
    position: "absolute",
    right: 0,
    top: 0,
  },
});

const _keyboardAwareViewEnabled = Platform.OS === "ios";
const _scrollOffset = -spacing.md;

const styles = StyleSheet.create({
  childContainer: {
    backgroundColor: Platform.select({
      ios: "rgba(255,255,255,0.98)",
      default: "white",
    }),
    borderRadius: borderRadius.md,
    maxWidth: MAX_CENTER_MODAL_WIDTH,
    width: "100%",
  },
  childWrapper: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    padding: spacing.md,
    position: "absolute",
    right: 0,
    top: 0,
  },
  scrollStyle: { flexGrow: 0 },
});

export default ReanimatedCenterModal;
