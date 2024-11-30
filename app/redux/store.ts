import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import auth from "./reducers/auth";
import user, { userTransform } from "./reducers/user";
import appConfig from "./reducers/appConfig";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import vendor from "./reducers/vendor";
import customers from "./reducers/customers";
import vendorLocations from "./reducers/vendorLocations";
import subscription from "./reducers/subscription";
import driver from "./reducers/driver";
import vendorDrivers from "./reducers/vendorDrivers";
import positions from "./reducers/positions";
import checkoutCart from "./reducers/checkoutCart";
import driverAvailability from "./reducers/driverAvailability";
import cuisines from "./reducers/cuisines";

const persistConfig = {
  key: "5",
  storage: AsyncStorage,
  version: 0,
  tranforms: [userTransform],
};

const rootReducer = combineReducers({
  auth,
  cuisines,
  driver,
  user,
  appConfig,
  vendor,
  customers,
  vendorLocations,
  subscription,
  vendorDrivers,
  positions,
  checkoutCart,
  driverAvailability,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const enhancers =
//   typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//     ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
//         // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
//       })
//     : undefined;

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
