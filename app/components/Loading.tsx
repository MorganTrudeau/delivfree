import React from "react";
import { $flex, $flexCenter } from "./styles";
import { TextStyle, View, ViewStyle } from "react-native";
import { LoadingText } from "./LoadingText";
import { FunFacts } from "./FunFacts";

export const Loading = ({ style }: { style?: ViewStyle }) => {
  return (
    <View style={[$flex, style]}>
      <LoadingText style={$loadingText} />
      <View style={$flexCenter}>
        <FunFacts />
      </View>
    </View>
  );
};

const $loadingText: TextStyle = {
  alignSelf: "center",
};
