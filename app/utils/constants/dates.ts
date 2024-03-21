import { Dimensions } from "react-native";

const { width: DEVICE_WIDTH } = Dimensions.get("window");
export const MAX_WIDTH = 650;
export const WEEK_DAY_HEIGHT = 28;
export const DAY_HEIGHT = 38;
export const DAY_WIDTH = Math.min(DEVICE_WIDTH, MAX_WIDTH) / 7;
export const WEEK_WIDTH = DAY_WIDTH * 7;
export const ROW_HEIGHT = 48;
export const DATES_MAX_HEIGHT = 6 * ROW_HEIGHT;
export const CALENDAR_MIN_HEIGHT = ROW_HEIGHT;
export const ANIMATED_MAX_HEIGHT = ROW_HEIGHT * 4;
export const CALENDAR_HEIGHT = ROW_HEIGHT * 6;

export const RECORDED_DATES_LOADER_HEIGHT = 6;

export const OPEN_DURATION = 500;
export const FAST_CLOSE_DURATION = 100;
export const DEFAULT_CLOSE_DURATION = 300;
