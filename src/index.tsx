import * as React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { App } from "@/components/app";

import { PermissionContext } from "./context/PermissionContext";

import { Privacy } from "./components/layouts/privacy-policy/Privacy";

import "@/styles/base/normalize.scss";
import "@/styles/base/typography.scss";
import "@/styles/layouts/general.scss";
ReactDOM.render(
  <React.StrictMode>
    <PermissionContext>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/privacyPolicy" element={<Privacy />} />

          {/* Protected route */}
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </PermissionContext>
  </React.StrictMode>,
  document.getElementById("root")
);
