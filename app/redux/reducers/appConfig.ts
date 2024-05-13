import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "delivfree";

export interface AppConfigState {
  userType: UserType | undefined;
  webNotificationsEnabled: boolean;
}

const initialState: AppConfigState = {
  userType: undefined,
  webNotificationsEnabled: false,
};

export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<UserType>) => {
      state.userType = action.payload;
    },
    setWebNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.webNotificationsEnabled = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserType, setWebNotificationsEnabled } =
  appConfigSlice.actions;

export default appConfigSlice.reducer;
