import { Toaster } from "react-hot-toast";

export default function DashboardToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{ margin: "8px" }}
      toastOptions={{
        style: {
          fontSize: "14px",
          maxWidth: "420px",
          padding: "14px 18px",
          borderRadius: "12px",
          background: "hsl(var(--card))",
          color: "hsl(var(--text))",
          border: "1px solid hsl(var(--border))",
          boxShadow: "0 10px 25px -10px hsl(var(--text) / 0.25)",
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "hsl(var(--success))",
            secondary: "hsl(var(--success-foreground))",
          },
        },

        error: {
          duration: 5000,

          style: {
            borderLeft: "4px solid hsl(var(--destructive))",
          },
        },
      }}
    />
  );
}
