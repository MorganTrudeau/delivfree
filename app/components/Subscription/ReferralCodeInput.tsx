import React, { useState } from "react";
import { TextField } from "../TextField";
import { View, ViewStyle } from "react-native";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { useOnChange, useToast } from "app/hooks";
import { translate } from "app/i18n";
import firestore from "@react-native-firebase/firestore";
import { $row } from "../styles";
import { Icon } from "../Icon";
import { useLoadingIndicator } from "app/hooks/useLoadingIndicator";

export const ReferralCodeInput = ({
  onVerified,
  style,
  freeTrialReward,
}: {
  onVerified: (code: string) => void;
  style?: ViewStyle;
  freeTrialReward?: boolean;
}) => {
  const Toast = useToast();

  const [code, setCode] = useState("");
  const [{ verified, error, loading }, setState] = useState({
    verified: false,
    error: false,
    loading: false,
  });

  const verifyCode = async (code: string) => {
    try {
      setState({ verified: false, error: false, loading: true });
      const doc = await firestore().collection("Referrals").doc(code).get();
      if (doc.exists) {
        setState({ verified: true, error: false, loading: false });
        onVerified(code);
      } else {
        setState({ verified: false, error: true, loading: false });
      }
    } catch (error) {
      Toast.show(translate("errors.common"));
      setState({ verified: false, error: true, loading: false });
    }
  };

  useOnChange(code, (nextCode, prevCode) => {
    if (prevCode.length !== 5 && nextCode.length === 5) {
      verifyCode(nextCode.toUpperCase());
    }
  });

  const Loading = useLoadingIndicator(loading, { color: colors.primary });

  return (
    <View style={style}>
      {freeTrialReward && (
        <Text preset="subheading" style={{ marginBottom: spacing.xxs }}>
          2 Months fee with referral
        </Text>
      )}
      <TextField
        label="Referral code"
        placeholder="Enter referral code"
        containerStyle={{ maxWidth: 250 }}
        value={code}
        onChangeText={(c) => setCode(c.toUpperCase())}
        RightAccessory={Loading}
      />
      {(verified || error) && (
        <View style={[$row, { marginTop: spacing.xxs }]}>
          <Icon
            icon={verified ? "check-circle" : "alert-circle"}
            color={verified ? colors.success : colors.error}
            style={{ marginRight: spacing.xxs }}
          />
          <Text>{verified ? "Code verified" : "Invalid code"}</Text>
        </View>
      )}
    </View>
  );
};
