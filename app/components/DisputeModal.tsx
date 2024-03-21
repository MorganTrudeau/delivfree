import React, { forwardRef } from "react";
import OptionsModal, { OptionModalItem } from "./Modal/OptionsModal";
import { useAppSelector } from "app/redux/store";
import { useToast } from "app/hooks";
import { translate } from "app/i18n";
import firestore from "@react-native-firebase/firestore";
import { ModalRef, User, Trivia } from "smarticus";

type Props = {
  trivia: Trivia;
};

export const DisputeModal = forwardRef<ModalRef, Props>(function DisputeModal(
  { trivia },
  ref
) {
  const Toast = useToast();

  const activeUser = useAppSelector((state) => state.user.user as User);

  const handleDispute = async (reason: string) => {
    try {
      await firestore()
        .collection("Disputes")
        .doc()
        .set({ userId: activeUser.id, reason, questionId: trivia.id });
      Toast.show("Thank you for reporting. Any lost rating will be refunded.");
    } catch (error) {
      console.log("Failed to dispute question: ", error);
      Toast.show(translate("errors.common"));
    }
  };

  const handleOptionSelect = (option: OptionModalItem) => {
    handleDispute(option.value);
  };

  return (
    <OptionsModal ref={ref} options={options} onSelect={handleOptionSelect} />
  );
});

const options: OptionModalItem[] = [
  {
    value: "incorrect",
    text: "Incorrect information",
    icon: "alert-circle-outline",
  },
  {
    value: "multiple-answers",
    text: "Multiple answers to question",
    icon: "checkbox-multiple-marked-circle-outline",
  },
  { value: "offensive", text: "Offensive content", icon: "cancel" },
];
