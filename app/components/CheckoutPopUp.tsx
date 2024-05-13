import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ModalRef } from "delivfree";
import ReanimatedCenterModal from "./Modal/CenterModal";
import { Linking, View, ViewStyle } from "react-native";
import { LogoHeader } from "./LogoHeader";
import { Text } from "./Text";
import { Button } from "./Button";
import { spacing } from "app/theme";
import { ImageStyle } from "react-native-fast-image";

export interface CheckoutPopUpRef {
  open: (link: string) => void;
  close: () => void;
}
interface Props {}

export const CheckoutPopUp = forwardRef<CheckoutPopUpRef, Props>(
  function CheckoutPopUp({}, ref) {
    const modal = useRef<ModalRef>(null);

    const [link, setLink] = useState("");

    const open = (_link: string) => {
      setLink(_link);
      modal.current?.open();
    };

    const close = () => modal.current?.close();

    const handleContinue = () => {
      Linking.openURL(link);
      close();
    };

    useImperativeHandle(ref, () => ({ open, close }), []);

    return (
      <ReanimatedCenterModal ref={modal} tapToClose>
        <View style={$content}>
          <LogoHeader style={$logo} />
          <Text size={"sm"} weight="semiBold">
            FREE DELIVERY & ZERO ADDED FEES
          </Text>
          <Text size={"xs"}>
            You are saving money on this order via DelivFree. The menu price is
            all you pay!
          </Text>
          <Button
            text="Continue"
            preset="filled"
            onPress={handleContinue}
            style={$button}
          />
        </View>
      </ReanimatedCenterModal>
    );
  }
);

const $content: ViewStyle = {
  padding: spacing.md,
  alignItems: "center",
};
const $button: ViewStyle = {
  alignSelf: "stretch",
  marginTop: spacing.md,
};
const $logo: ImageStyle = { marginBottom: spacing.md };
