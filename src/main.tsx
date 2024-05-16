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



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
          <App/>
  </React.StrictMode>
);
