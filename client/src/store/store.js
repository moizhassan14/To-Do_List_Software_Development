// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import userReducer from "../store/slice/user/user.slice";
import themeReducer from "../store/slice/theme/theme.slice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["userReducer","themeReducer"], // only persist user state
};

const rootReducer = combineReducers({
  userReducer,
  themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persister = persistStore(store);