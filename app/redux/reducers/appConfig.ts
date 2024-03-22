import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AppConfig } from "delivfree";

const defaultConfig: AppConfig = {
  skipAdCoins: 10,
  adFrequencySeconds: 300,
  gamesBeforeAd: 1,
  gamesBeforeAdResetFrequencySeconds: 3600,
};

export interface AppConfigState {
  config: AppConfig;
}

const initialState: AppConfigState = {
  config: defaultConfig,
};

export const appConfigSlice = createSlice({
  name: "appConfig",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<AppConfig>) => {
      state.config = action.payload || defaultConfig;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setConfig } = appConfigSlice.actions;

export default appConfigSlice.reducer;
