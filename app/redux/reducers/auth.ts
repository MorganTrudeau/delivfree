import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type FirebaseUser = Pick<
  FirebaseAuthTypes.User,
  "email" | "uid" | "emailVerified"
>;
export interface AuthState {
  authToken: string | undefined;
  user: FirebaseUser | undefined;
  isAnonymous: boolean;
  previousAuthToken: string | undefined;
}

const initialState: AuthState = {
  authToken: undefined,
  user: undefined,
  isAnonymous: false,
  previousAuthToken: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string | undefined>) => {
      state.authToken = action.payload;
      if (action.payload) {
        state.previousAuthToken = action.payload;
      }
    },
    setAnonymous: (state, action: PayloadAction<boolean>) => {
      state.isAnonymous = action.payload;
    },
    setAuthUser: (
      state,
      action: PayloadAction<AuthState["user"] | undefined>
    ) => {
      state.user = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setAuthToken, setAnonymous, setAuthUser } = authSlice.actions;

export default authSlice.reducer;
