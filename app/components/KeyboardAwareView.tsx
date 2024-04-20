import React from "react";
import {
  Keyboard,
  Animated,
  Dimensions,
  Platform,
  ViewStyle,
  StyleProp,
  EmitterSubscription,
  KeyboardEventListener,
  View,
} from "react-native";

type Props = {
  style?: StyleProp<ViewStyle>;
  enabled: boolean;
  onKeyboardShow?: () => void;
  onKeyboardHide?: () => void;
  scrollOffset?: number;
  children: React.ReactNode | React.ReactNode[];
  minY: number;
};

type State = {
  keyboardVisible: boolean;
  keyboardHeight: number;
  viewHeight: number;
  viewPosition: number;
  overlap: number;
};

export default class AppKeyboardAwareView extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    enabled: true,
    scrollOffset: 0,
    minY: 0,
  };

  animation = new Animated.Value(0);
  viewRef = React.createRef<View>();

  keyboardDidShowListener: EmitterSubscription | undefined;
  keyboardDidHideListener: EmitterSubscription | undefined;

  keyboardHideTimeout: NodeJS.Timeout | undefined;

  constructor(props: Props) {
    super(props);
    this.state = {
      keyboardVisible: false,
      keyboardHeight: 0,
      viewHeight: 0,
      viewPosition: 0,
      overlap: 0,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      (!prevProps.enabled &&
        this.props.enabled &&
        this.state.keyboardVisible) ||
      (this.props.enabled &&
        !prevState.keyboardVisible &&
        this.state.keyboardVisible)
    ) {
      this.animateUp();
    }
    if (
      (prevProps.enabled !== this.props.enabled && !this.props.enabled) ||
      (!this.state.keyboardVisible && prevState.keyboardVisible)
    ) {
      this.animateDown();
    }
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      this.keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      this.keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    this.keyboardHideTimeout && clearTimeout(this.keyboardHideTimeout);
  }

  keyboardDidShow: KeyboardEventListener = ({
    endCoordinates: { height: keyboardHeight },
  }) => {
    this.keyboardHideTimeout && clearTimeout(this.keyboardHideTimeout);
    this.props.onKeyboardShow && this.props.onKeyboardShow();
    this.setState({
      keyboardVisible: true,
      keyboardHeight,
    });
  };

  keyboardDidHide: KeyboardEventListener = (e) => {
    this.props.onKeyboardHide && this.props.onKeyboardHide();
    this.keyboardHideTimeout = setTimeout(
      () => this.setState({ keyboardVisible: false }),
      100
    );
  };

  animateUp = () => {
    Animated.timing(this.animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  animateDown = () => {
    Animated.timing(this.animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  onLayout = () => {
    if (this.viewRef.current) {
      this.viewRef.current.measure((x, y, width, height, px, py) => {
        this.setState({
          viewHeight: height,
          viewPosition:
            py +
            (this.state.keyboardVisible
              ? this.calcOverlap(
                  this.state.keyboardHeight,
                  this.state.viewHeight,
                  this.state.viewPosition
                ) - (this.props.scrollOffset || 0)
              : 0),
        });
      });
    }
  };

  calcOverlap = (
    keyboardHeight: number,
    viewHeight: number,
    viewPosition: number
  ) => {
    const { minY = 0 } = this.props;

    const DEVICE_HEIGHT = Dimensions.get("window").height;

    const keyboardOverlap =
      keyboardHeight -
      (DEVICE_HEIGHT -
        (viewHeight + viewPosition) +
        (this.props.scrollOffset || 0));

    const topContraintOverlap =
      viewPosition - keyboardOverlap < minY
        ? viewPosition - keyboardOverlap + minY
        : 0;

    return Math.max(0, keyboardOverlap - topContraintOverlap);
  };

  render() {
    const { style } = this.props;
    const { viewHeight, viewPosition, keyboardHeight } = this.state;

    const overlap = this.calcOverlap(keyboardHeight, viewHeight, viewPosition);

    const translateY = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -overlap],
    });

    return (
      <Animated.View
        ref={this.viewRef}
        style={[style, { transform: [{ translateY }] }]}
        onLayout={this.onLayout}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
