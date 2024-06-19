import React from "react";
import { spacing } from "app/theme";
import { ButtonSmall } from "../ButtonSmall";
import { $row } from "../styles";
import { View } from "react-native";
import { TextField } from "../TextField";
import { Icon } from "../Icon";

type TipType = "15" | "18" | "20" | "25" | "other";
const TipChoice = ({
  type,
  title,
  onPress,
  selected,
}: {
  type: TipType;
  title: string;
  onPress: (type: TipType) => void;
  selected: boolean;
}) => {
  return (
    <ButtonSmall
      text={title}
      onPress={() => onPress(type)}
      preset={selected ? "reversed" : "default"}
      style={{ marginRight: spacing.xs }}
    />
  );
};

export const TipSelect = ({
  selectedTipType,
  onChangeType,
  amount,
}: {
  selectedTipType: TipType;
  onChangeType: (type: TipType, amount?: string) => void;
  amount: string;
}) => {
  return (
    <>
      <View style={$row}>
        <TipChoice
          title={"15%"}
          type={"15"}
          onPress={onChangeType}
          selected={selectedTipType === "15"}
        />
        <TipChoice
          title={"18%"}
          type={"18"}
          onPress={onChangeType}
          selected={selectedTipType === "18"}
        />
        <TipChoice
          title={"20%"}
          type={"20"}
          onPress={onChangeType}
          selected={selectedTipType === "20"}
        />
        <TipChoice
          title={"25%"}
          type={"25"}
          onPress={onChangeType}
          selected={selectedTipType === "25"}
        />
        <TipChoice
          title={"Other"}
          type={"other"}
          onPress={onChangeType}
          selected={selectedTipType === "other"}
        />
      </View>
      {selectedTipType === "other" && (
        <TextField
          onChangeText={(amount) => onChangeType("other", amount)}
          containerStyle={{ marginTop: spacing.xs }}
          numberInput
          LeftAccessory={({ style }) => (
            <Icon icon={"currency-usd"} style={style} />
          )}
          placeholder="0.00"
          value={amount}
          onBlur={() => {
            onChangeType("other", Number(amount).toFixed(2));
          }}
        />
      )}
    </>
  );
};
