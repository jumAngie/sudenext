"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "light" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        // SUCCESS
        success: {
          style: {
            background: "#d1fae5",
            color: "#065f46",
            border: "1px solid #6ee7b7",
          },
        },

        // ERROR
        error: {
          style: {
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fca5a5",
          },
        },

        // WARNING
        warning: {
          style: {
            background: "#fef3c7",
            color: "#92400e",
            border: "1px solid #fde68a",
          },
        },

        // INFO
        info: {
          style: {
            background: "#dbeafe",
            color: "#1e3a8a",
            border: "1px solid #93c5fd",
          },
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
