import React, { forwardRef, useRef, useState } from "react";
import { BottomSheet, BottomSheetRef } from "./BottomSheet";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "../Icon";
import { colors, spacing } from "app/theme";
import { Text } from "../Text";
import { Button } from "../Button";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { $borderBottom } from "../styles";
import { useCombinedRefs } from "app/hooks/useCombinedRefs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ReportModal = forwardRef<BottomSheetRef>(function ReportModal(
  _,
  ref
) {
  const insets = useSafeAreaInsets();

  const innerRef = useRef<BottomSheetRef>(null);

  const combinedRefs = useCombinedRefs(ref, innerRef);

  const [reported, setReported] = useState<{ title: string } | null>(null);

  const handleOptionPress = (option: { title: string }) => () => {
    setReported(option);
  };

  const onClose = () => {
    setReported(null);
  };

  return (
    <BottomSheet ref={combinedRefs} onClose={onClose}>
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: spacing.md + insets.bottom }}
      >
        {reported ? (
          <View style={styles.content}>
            <Icon
              icon={"check-circle"}
              color={colors.primary}
              size={65}
              style={styles.successIcon}
            />

            <Text style={styles.text} preset="subheading">
              Thanks for reporting
            </Text>

            <Text style={styles.text}>
              Your submission will be reviewed by our team and the content will
              be removed if necessary.
            </Text>

            <Button
              text="Complete"
              onPress={() => innerRef.current?.close()}
              style={styles.button}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Text preset="subheading">Why are you reporting this content?</Text>
            <Text style={styles.message}>
              Your report is anonymous, except if you're reporting an
              intellectual property infringement. If someone is in immediate
              danger, call the local emergency services - don't wait.
            </Text>

            <View style={styles.options}>
              {REPORT_OPTIONS.map((option) => {
                return (
                  <Pressable
                    key={option.title}
                    style={styles.option}
                    onPress={handleOptionPress(option)}
                  >
                    <Text>{option.title}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}
      </BottomSheetScrollView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  button: { marginTop: spacing.lg },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  message: { paddingBottom: spacing.sm, paddingTop: spacing.sm },
  option: { paddingVertical: spacing.md, ...$borderBottom },
  options: { flex: 1, paddingVertical: spacing.md },
  successIcon: { alignSelf: "center", marginBottom: spacing.md },
  text: { paddingVertical: spacing.xxs, textAlign: "center" },
});

const REPORT_OPTIONS = [
  { title: "Nudity or sexual activity" },
  { title: "Hate speech or symbols" },
  { title: "Violence or dangerous organizations" },
  { title: "Bullying or harassment" },
  { title: "False information" },
  { title: "Scam or fraud" },
  { title: "Suicide or self-injury" },
  { title: "Sale of illegal or regulated goods" },
  { title: "Itellectual property violation" },
  { title: "Something else" },
];
