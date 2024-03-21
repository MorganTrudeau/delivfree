import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User } from "smarticus";
import { resetAppState } from "../resetAppState";
import createTransform from "redux-persist/es/createTransform";

export interface UserState {
  admin: boolean;
  user: User | null;
  loaded: boolean;
  deleteAccountLoading: boolean;
  blockLoading: boolean;
}

const initialState: UserState = {
  admin: false,
  user: null,
  loaded: false,
  deleteAccountLoading: false,
  blockLoading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loaded = true;
    },
    setDeleteAccountLoading: (state, action: PayloadAction<boolean>) => {
      state.deleteAccountLoading = action.payload;
    },
    setBlockUserLoading: (state, action: PayloadAction<boolean>) => {
      state.blockLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setDeleteAccountLoading, setBlockUserLoading } =
  userSlice.actions;

export const userTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: UserState) => {
    // convert mySet to an Array.
    return {
      admin: inboundState.admin,
      user: inboundState.user,
      loaded: inboundState.loaded,
    };
  },
  // transform state being rehydrated
  (outboundState: Pick<UserState, "admin" | "user" | "loaded">) => {
    // convert mySet back to a Set.
    return { ...initialState, ...outboundState };
  },
  // define which reducers this transform gets called for.
  { whitelist: ["badges"] }
);

export default userSlice.reducer;
