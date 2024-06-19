import AsyncStorage from "@react-native-async-storage/async-storage";
import moment, { MomentInput } from "moment";
import * as React from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import TimeClockInput from "./TimeClockInput";
import {
  clockTypes,
  inputTypeIcons,
  inputTypes,
  PossibleClockTypes,
  PossibleInputTypes,
  reverseInputTypes,
} from "./timeUtils";
import { Text } from "../Text";
import { colors, spacing } from "app/theme";
import { $input } from "../styles";
import { Icon } from "../Icon";
import { borderRadius } from "app/theme/borderRadius";

export type Props = {
  locale?: undefined | string;
  label?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  time: MomentInput;
  initialTime?: MomentInput;
  hours?: number | undefined;
  minutes?: number | undefined;
  onCancel?: () => any;
  onConfirm: (date: Date) => any;
  animationType?: "slide" | "fade" | "none";
  roundness?: number;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  amPmStyle?: ViewStyle;
  inputStyle?: ViewStyle;
  clockStyle?: ViewStyle;
  onChangeTime?: (date: Date) => any;
};

export function TimePicker({
  onConfirm,
  onCancel,
  time,
  initialTime,
  label = "Select time",
  cancelLabel,
  confirmLabel,
  locale,
  roundness = 10,
  style,
  titleStyle,
  inputStyle,
  amPmStyle,
  clockStyle,
  onChangeTime,
}: Props) {
  const [inputType, setInputType] = React.useState<PossibleInputTypes>(
    inputTypes.picker
  );
  const [focused, setFocused] = React.useState<PossibleClockTypes>(
    clockTypes.hours
  );

  const [hoursMinutes, setHoursMinutes] = React.useState<{
    localHours: number;
    localMinutes: number;
  }>(getHoursMinutesFromDate(time || initialTime));

  const { localHours, localMinutes } = hoursMinutes;

  console.log({ localHours, localMinutes });

  React.useEffect(() => {
    initInputType();
  }, []);

  const onFocusInput = React.useCallback(
    (type: PossibleClockTypes) => setFocused(type),
    []
  );
  const onChange = React.useCallback(
    (params: {
      focused?: PossibleClockTypes | undefined;
      hours: number;
      minutes: number;
    }) => {
      if (params.focused) {
        setFocused(params.focused);
      }

      setHoursMinutes({
        localHours: params.hours,
        localMinutes: params.minutes,
      });

      if (onChangeTime) {
        onChangeTime(
          moment().hours(params.hours).minutes(params.minutes).toDate()
        );
      }
    },
    [setFocused, setHoursMinutes, onConfirm, onChangeTime]
  );

  const initInputType = async () => {
    try {
      const type = await getSavedInputType();
      if (type) {
        setInputType(type);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeInputType = (type: PossibleInputTypes) => {
    setInputType(reverseInputTypes[inputType]);
    saveInputType(type);
  };

  const handleConfirm = () => {
    onConfirm(moment().hours(localHours).minutes(localMinutes).toDate());
  };

  const renderTimePicker = () => {
    return (
      <View style={[styles.modalRoot, style]} pointerEvents="box-none">
        <View style={styles.labelContainer}>
          <Text style={titleStyle} preset="subheading">
            {label}
          </Text>
        </View>
        <View style={styles.timePickerContainer}>
          <TimeClockInput
            roundness={roundness}
            locale={locale}
            inputType={inputType}
            focused={focused}
            hours={localHours}
            minutes={localMinutes}
            onChange={onChange}
            onFocusInput={onFocusInput}
            onSubmitMinutes={handleConfirm}
            inputStyle={inputStyle || styles.input}
            amPmStyle={amPmStyle || styles.input}
            clockStyle={clockStyle || styles.input}
          />
        </View>
        <View style={styles.bottom}>
          <Icon
            icon={inputTypeIcons[reverseInputTypes[inputType]]}
            onPress={() => {
              changeInputType(reverseInputTypes[inputType]);
            }}
            size={24}
            style={styles.inputTypeToggle}
          />
          <View style={styles.fill} />
          {onCancel && (
            <Pressable style={styles.button} onPress={onCancel} hitSlop={10}>
              <Text style={[{ color: colors.textDim, marginEnd: spacing.md }]}>
                {cancelLabel || "Cancel"}
              </Text>
            </Pressable>
          )}
          <Pressable style={styles.button} onPress={handleConfirm} hitSlop={10}>
            <Text style={{ color: colors.primary }}>
              {confirmLabel || "Confirm"}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return <>{renderTimePicker()}</>;
}

const SAVED_INPUT_TYPE = "SAVED_INPUT_TYPE";
async function saveInputType(type: PossibleInputTypes) {
  try {
    await AsyncStorage.setItem(SAVED_INPUT_TYPE, type);
  } catch (error) {
    console.log(error);
  }
}
function getSavedInputType() {
  return AsyncStorage.getItem(
    SAVED_INPUT_TYPE
  ) as Promise<PossibleInputTypes | null>;
}

const getHoursMinutesFromDate = (date: MomentInput) => {
  const m = moment(date);
  const localHours = m.hours();
  const localMinutes = m.minutes();
  return { localHours, localMinutes };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  modalRoot: {
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.md,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    paddingBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.palette.neutral200,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: borderRadius.sm,
    borderColor: colors.border,
  },
  label: {
    fontSize: 13,
  },
  timePickerContainer: {},
  bottom: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: spacing.md,
  },
  button: { paddingVertical: spacing.xs },
  inputTypeToggle: { margin: 4 },
  fill: { flex: 1 },
});

export default React.memo(TimePicker);
