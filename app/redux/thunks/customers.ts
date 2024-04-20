import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import * as CustomersApi from "../../apis/customers";
import { setCustomers } from "../reducers/customers";

export const listenToCustomers = createAsyncThunk(
  "customers/listenToCustomers",
  (restaurantId: string, { getState, dispatch }) => {
    const user = (getState() as RootState).user.user;

    return CustomersApi.listenToCustomers(restaurantId, (customers) => {
      dispatch(setCustomers(customers));
    });
  }
);
