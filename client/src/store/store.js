// File: client/src/store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// Import reducers
import userReducer from "../store/slice/user/user.slice";
import themeReducer from "../store/slice/theme/theme.slice";
import taskReducer from "../store/slice/task/task.slice";

// Configuration for redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "theme", "task"], // only persist user state
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
  task: taskReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the Redux store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});
// Create a persistor for the store
export const persister = persistStore(store);
