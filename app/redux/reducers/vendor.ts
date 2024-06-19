import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { License, Vendor } from "delivfree";
import { resetAppState } from "../resetAppState";
import { createVendor, fetchVendor } from "../thunks/vendor";

export interface VendorState {
  data: { [id: string]: Vendor };
  licenses: { [id: string]: License };
  activeVendor: Vendor | null;
  activeVendorLoaded: boolean;
  licencesLoaded: boolean;
}

const initialState: VendorState = {
  data: {},
  licenses: {},
  activeVendor: null,
  activeVendorLoaded: false,
  licencesLoaded: false,
};

export const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setActiveVendor: (
      state,
      action: PayloadAction<Vendor | null | undefined>
    ) => {
      state.activeVendor = action.payload || null;
      state.activeVendorLoaded = true;
    },
    setVendor: (state, action: PayloadAction<Vendor | null | undefined>) => {
      if (action.payload) {
        state.data = { ...state.data, [action.payload.id]: action.payload };
      }
    },
    setVendors: (state, action: PayloadAction<{ [id: string]: Vendor }>) => {
      state.data = action.payload;
    },
    setVendorLicenses: (
      state,
      action: PayloadAction<{ [id: string]: License }>
    ) => {
      state.licenses = action.payload;
      state.licencesLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      createVendor.fulfilled,
      (state, action: PayloadAction<Vendor>) => {
        state.activeVendor = action.payload;
      }
    );
    builder.addCase(
      fetchVendor.fulfilled,
      (state, action: PayloadAction<Vendor | undefined>) => {
        if (action.payload) {
          state.data = { ...state.data, [action.payload.id]: action.payload };
        }
      }
    );
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const { setActiveVendor, setVendor, setVendors, setVendorLicenses } =
  vendorSlice.actions;

export default vendorSlice.reducer;
