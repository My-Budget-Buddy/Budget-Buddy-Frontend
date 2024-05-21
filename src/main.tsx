import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@trussworks/react-uswds/lib/uswds.css";
import "@trussworks/react-uswds/lib/index.css";
import { router } from './routing/Router.tsx'
import {
  RouterProvider,
} from "react-router-dom";
import "./i18n.ts";
import { Provider } from "react-redux";
import store from "./store/Store.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
        <App/>
    </Provider>
  </React.StrictMode>
);
