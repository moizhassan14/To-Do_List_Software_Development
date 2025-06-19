import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store, persister } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
import AppRouter from "./router/appRouter.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <App />
      <RouterProvider router={AppRouter} />
    </PersistGate>
  </Provider>
);
