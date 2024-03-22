import { ModalRef } from "delivfree";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  InteractionManager,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors, spacing } from "app/theme";
import { $shadow } from "../styles";
import { Portal } from "react-native-portalize";
import { ModalCloseButton } from "./ModalCloseButton";
import { ScrollView } from "react-native-gesture-handler";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ReanimatedModalProps = {
  children: React.ReactNode;
  backdropStyle?: ViewStyle;
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  onShow?: () => void;
  onDismiss?: () => void;
  tapToDismiss?: boolean;
  showCloseButton?: boolean;
};

const defaultOnDismiss = () => null;
const defaultOnShow = () => null;

export const ReanimatedModal = forwardRef<ModalRef, ReanimatedModalProps>(
  function ReanimatedModal(
    {
      children,
      backdropStyle,
      containerStyle,
      contentStyle,
      onShow = defaultOnShow,
      onDismiss = defaultOnDismiss,
      tapToDismiss = true,
      showCloseButton,
    },
    ref
  ) {
    const animation = useSharedValue(0);

    const isOpen = useRef(false);
    const [dismissed, setDismissed] = useState(true);

    const animatedBackdropStyles = useAnimatedStyle(
      () => ({
        ...$backdrop,
        ...backdropStyle,
        opacity: animation.value,
      }),
      [backdropStyle]
    );
    const animatedContainerStyles = useAnimatedStyle(
      () => ({
        ...$container,
        ...containerStyle,
        transform: [
          { translateY: interpolate(animation.value, [0, 1], [20, 0]) },
        ],
      }),
      [containerStyle]
    );

    const openTimeout = useRef<{
      then: (
        onfulfilled?: (() => any) | undefined,
        onrejected?: (() => any) | undefined
      ) => Promise<any>;
      done: (...args: any[]) => any;
      cancel: () => void;
    }>();
    const closeTimeout = useRef<{
      then: (
        onfulfilled?: (() => any) | undefined,
        onrejected?: (() => any) | undefined
      ) => Promise<any>;
      done: (...args: any[]) => any;
      cancel: () => void;
    }>();

    const handleClose = useCallback(() => {
      if (isOpen.current === false) {
        setDismissed(true);
        onDismiss();
      }
    }, [onDismiss]);

    const open = useCallback(() => {
      if (closeTimeout.current) {
        closeTimeout.current.cancel();
      }
      isOpen.current = true;
      setDismissed(false);
      openTimeout.current = InteractionManager.runAfterInteractions(() => {
        animation.value = withTiming(
          1,
          {
            duration: 400,
            easing: Easing.out(Easing.cubic),
          },
          (finished) => {
            "worklet";
            if (finished) {
              runOnJS(onShow)();
            }
          }
        );
      });
    }, [animation, onShow]);

    const close = useCallback(() => {
      if (openTimeout.current) {
        openTimeout.current.cancel();
      }
      isOpen.current = false;
      closeTimeout.current = InteractionManager.runAfterInteractions(() => {
        animation.value = withTiming(0, { duration: 200 }, (finished) => {
          "worklet";
          if (finished) {
            runOnJS(handleClose)();
          }
        });
      });
    }, [animation, handleClose]);

    useEffect(() => {
      if (dismissed && !isOpen.current) {
        close();
      }
    }, [dismissed]);

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
        isOpen: () => isOpen.current,
      }),
      [open, close]
    );

    return (
      <Portal>
        <AnimatedPressable
          disabled={!tapToDismiss}
          onPress={close}
          style={animatedBackdropStyles}
          pointerEvents={dismissed ? "none" : "auto"}
        >
          <AnimatedPressable style={animatedContainerStyles}>
            {!dismissed && (
              <ScrollView
                style={$scrollStyle}
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"handled"}
              >
                <Pressable style={contentStyle}>{children}</Pressable>
              </ScrollView>
            )}
            {showCloseButton && <ModalCloseButton onPress={close} />}
          </AnimatedPressable>
        </AnimatedPressable>
      </Portal>
    );
  }
);

const $backdrop: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  padding: spacing.lg,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: colors.underlay,
};

const $container: ViewStyle = {
  backgroundColor: colors.background,
  maxWidth: 600,
  borderRadius: 6,
  width: "100%",
  margin: spacing.xl,
  ...$shadow,
};

const $scrollStyle: ViewStyle = {
  flexGrow: 0,
};
