import React from "react";
import {
  Linking,
  Platform,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Text } from "./Text";
import { translate } from "app/i18n";
import { colors, spacing } from "app/theme";

export const IosTerms = ({ style }: { style?: ViewStyle }) => {
  if (Platform.OS !== "ios") return null;
  return (
    <View style={style}>
      <Text style={$header} preset="formLabel">
        Purchase Terms
      </Text>
      <Text style={$iapTermsText}>
        {translate("ios_terms.payment_charge_text")}
      </Text>
      {/* <Text style={$iapTermsText}>
        <Text>{"\u2022"}</Text> {translate("ios_terms.auto_renew")}
      </Text>
      <Text style={$iapTermsText}>
        <Text>{"\u2022"}</Text> {translate("ios_terms.account_will_charge")}
      </Text>
      <Text style={$iapTermsText}>
        <Text>{"\u2022"}</Text> {translate("ios_terms.subs_may_managed")}
      </Text>
      <Text style={$iapTermsText}>
        <Text>{"\u2022"}</Text>{" "}
        {translate("ios_terms.free_trial_unused_portion")}
      </Text> */}
      <Pressable
        onPress={() => {
          Linking.canOpenURL("https://www.smarticus.app/privacy-policy.html")
            .then(
              (canOpen) =>
                canOpen &&
                Linking.openURL("https://www.smarticus.app/privacy-policy.html")
            )
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        <Text style={$iapTermsLink}>
          {translate("ios_terms.privacy_policy")}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          Linking.canOpenURL("https://www.smarticus.app/terms.html")
            .then(
              (canOpen) =>
                canOpen &&
                Linking.openURL("https://www.smarticus.app/terms.html")
            )
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        <Text style={$iapTermsLink}>{translate("ios_terms.terms_of_use")}</Text>
      </Pressable>
    </View>
  );
};

const $iapTermsText: TextStyle = {
  marginBottom: spacing.xxs,
};

const $iapTermsLink: TextStyle = {
  //   color: colors.primary,
  color: colors.textDim,
  marginBottom: spacing.xxs,
};

const $header: TextStyle = {
  marginBottom: spacing.xxs,
};
