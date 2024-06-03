import { createAsyncThunk } from "@reduxjs/toolkit";
import * as CustomersApi from "../../apis/customers";
import { setCustomers } from "../reducers/customers";

export const listenToCustomers = createAsyncThunk(
  "customers/listenToCustomers",
  (
    params: { vendor?: string | string[]; vendorLocation?: string | string[] },
    { getState, dispatch }
  ) => {
    return CustomersApi.listenToCustomers((customers) => {
      dispatch(setCustomers(customers));
    }, params);
  }
);
