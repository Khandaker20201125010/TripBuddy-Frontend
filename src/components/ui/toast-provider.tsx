
"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#374151",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          padding: "16px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
        success: {
          duration: 3000,
          style: {
            background: "#f0fdf4",
            color: "#166534",
            border: "1px solid #bbf7d0",
          },
          iconTheme: {
            primary: "#16a34a",
            secondary: "#f0fdf4",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
          iconTheme: {
            primary: "#dc2626",
            secondary: "#fef2f2",
          },
        },
        loading: {
          style: {
            background: "#f8fafc",
            color: "#475569",
            border: "1px solid #e2e8f0",
          },
        },
      }}
    />
  );
}