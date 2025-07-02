import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProfileProvider } from "./context/ProfileContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProfileProvider>
      <App />        {/* App ya incluye <BrowserRouter> */}
    </ProfileProvider>
  </React.StrictMode>
);