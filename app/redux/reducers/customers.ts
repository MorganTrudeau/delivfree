import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "delivfree";
import { resetAppState } from "../resetAppState";

export interface CustomersState {
  data: { [id: string]: Customer };
}

const initialState: CustomersState = {
  data: {},
};

export const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setCustomers: (
      state,
      action: PayloadAction<{ [id: string]: Customer }>
    ) => {
      state.data = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.data = { ...state.data, [action.payload.id]: action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setCustomers } = customersSlice.actions;

export default customersSlice.reducer;
