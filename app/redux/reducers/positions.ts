import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Positions } from "delivfree";
import { resetAppState } from "../resetAppState";

export interface PositionsState {
  data: { [id: string]: Positions };
}

const initialState: PositionsState = {
  data: {},
};

export const positionsSlice = createSlice({
  name: "positions",
  initialState,
  reducers: {
    setPositions: (
      state,
      action: PayloadAction<{ [id: string]: Positions }>
    ) => {
      state.data = action.payload;
    },
    addPosition: (state, action: PayloadAction<Positions>) => {
      state.data = { ...state.data, [action.payload.id]: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setPositions } = positionsSlice.actions;

export default positionsSlice.reducer;
