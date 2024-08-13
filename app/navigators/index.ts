import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AppStackParamList } from "./AppStackParamList";

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type NavigationProp = AppStackScreenProps<
  keyof AppStackParamList
>["navigation"];

export * from "./navigationUtilities";
// export other navigators from here
