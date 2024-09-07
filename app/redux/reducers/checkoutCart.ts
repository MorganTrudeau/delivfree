import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CheckoutItem } from "delivfree";
import { resetAppState } from "../resetAppState";

export type CheckoutOrderUpdate = {
  id: string;
  customer: string;
  vendor: string;
  vendorLocation: string;
  items: CheckoutItem;
};
export type CheckoutOrder = {
  id: string;
  customer: string;
  vendor: string;
  vendorLocation: string;
  items: CheckoutItem[];
};
export interface CheckoutCartState {
  order: null | CheckoutOrder;
}

const initialState: CheckoutCartState = {
  order: null,
};

export const checkoutCartSlice = createSlice({
  name: "checkoutCart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CheckoutItem>) => {
      if (state.order) {
        state.order = {
          ...state.order,
          items: [...state.order.items, action.payload],
        };
      }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      if (state.order) {
        state.order = {
          ...state.order,
          items: state.order.items.filter((i) => i.item.id !== action.payload),
        };
      }
    },
    startCart: (state, action: PayloadAction<CheckoutOrder>) => {
      state.order = action.payload;
    },
    emptyCart: (state) => {
      state.order = null;
    },
    changeCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      if (state.order) {
        if (action.payload.quantity === 0) {
          state.order = {
            ...state.order,
            items: state.order.items.filter((i) => i.id !== action.payload.id),
          };
        } else {
          state.order = {
            ...state.order,
            items: state.order.items.map((i) =>
              i.id === action.payload.id
                ? { ...i, quantity: action.payload.quantity }
                : i
            ),
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAppState, () => initialState);
  },
});

// Action creators are generated for each case reducer function
export const {
  addItemToCart,
  removeItemFromCart,
  startCart,
  emptyCart,
  changeCartItemQuantity,
} = checkoutCartSlice.actions;

export default checkoutCartSlice.reducer;
