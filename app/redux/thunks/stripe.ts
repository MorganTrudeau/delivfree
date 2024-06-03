import { createAsyncThunk } from "@reduxjs/toolkit";
import * as StripeApis from "../../apis/stripe";

export const fetchProducts = createAsyncThunk(
  "subscription/fetchProducts",
  async () => {
    return await StripeApis.fetchProducts();
  }
);
