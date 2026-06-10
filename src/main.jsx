import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { DarkModeProvider } from "./context/DarkModeContext";
import "./i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry once on transient failures, but not on server/auth errors.
      retry: (failureCount, error) => {
        if (failureCount >= 1) return false;
        // Don't retry Supabase 5xx or auth errors
        const msg = error?.message ?? "";
        if (msg.includes("500") || msg.includes("JWT") || msg.includes("auth"))
          return false;
        return true;
      },
      retryDelay: 1500,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <App />
      </DarkModeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
