import { createAsyncThunk } from "@reduxjs/toolkit";
import * as PositionsApi from "../../apis/positions";
import { setPositions } from "../reducers/positions";

export const listenToPositions = createAsyncThunk(
  "positions/listenToPositions",
  (vendor: string, { dispatch }) => {
    return PositionsApi.listenToPositions(
      (customers) => {
        dispatch(setPositions(customers));
      },
      { vendor }
    );
  }
);
