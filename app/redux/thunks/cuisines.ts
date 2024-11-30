import { createAsyncThunk } from "@reduxjs/toolkit";
import * as CuisineApis from "../../apis/cuisines";
import { setCuisines } from "../reducers/cuisines";

export const listenToCuisines = createAsyncThunk(
  "cuisine/listenToCuisines",
  async (_, { dispatch }) => {
    return CuisineApis.listenToCuisines((data) => dispatch(setCuisines(data)));
  }
);
