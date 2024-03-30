import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type UserType = "consumer" | "driver" | "vendor" | "admin";
export interface AppConfigState {
  userType: UserType | undefined;
}

const initialState: AppConfigState = {
  userType: undefined,
};

export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    setUserType: (state, action: PayloadAction<UserType>) => {
      state.userType = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserType } = appConfigSlice.actions;

export default appConfigSlice.reducer;
