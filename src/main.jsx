import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./state/auth";
import { DarkModeProvider } from "./context/DarkModeContext";
import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// in the order panel change the ready on cafe orders as something make sense.
// the sidebar should stay fixed and has a hight of 100vh

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
